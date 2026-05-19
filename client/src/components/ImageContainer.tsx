import { useRef, useState, useEffect } from "react";
import axios from "axios";

const ImageContainer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // 👈 track interval

  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState({
    name: "---",
    confidence: "---",
    status: "IDLE",
  });

  // 🎥 Start Camera
  // ✅ After — stream is ready before useEffect runs
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream; // stream stored first
      setIsScanning(true); // THEN trigger the useEffect
    } catch (error) {
      console.error("Camera error:", error);
      setIsScanning(false);
    }
  };

  // 🛑 Stop Camera
  const stopCamera = () => {
    // 👇 Clear the scanning interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setIsLoading(false);
    setResult({ name: "---", confidence: "---", status: "IDLE" });
  };

  // 🧠 Capture + Send to AI
  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Skip if video isn't ready yet
    if (video.videoWidth === 0 || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        setIsLoading(true);
        const res = await axios.post(
          "http://localhost:8000/recognize",
          formData,
        );
        setResult(res.data);
      } catch (err) {
        console.error("AI error:", err);
      } finally {
        setIsLoading(false);
      }
    }, "image/jpeg");
  };

  // 🔁 Attach stream to video + start scan interval once isScanning is true
  useEffect(() => {
    if (isScanning && videoRef.current && streamRef.current) {
      const video = videoRef.current;

      video.srcObject = streamRef.current;

      video.onloadedmetadata = () => {
        video.play().catch((e) => console.error("Play error:", e));

        // 👇 Start sending frames every 1.5 seconds once video is actually playing
        intervalRef.current = setInterval(() => {
          captureAndSend();
        }, 1500);
      };
    }

    // 👇 Clear interval if scanning stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isScanning]);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Camera */}
      <div className="bg-black rounded-xl h-[300px] relative overflow-hidden">
        {!isScanning ? (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={startCamera}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Start Biometrics
            </button>
          </div>
        ) : (
          <>
            {/* 👇 w-full h-full object-cover makes the video fill the black box */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Corner overlay */}
            <div className="absolute inset-0 flex justify-between p-6 pointer-events-none">
              <div className="border-t-4 border-l-4 border-green-400 w-10 h-10" />
              <div className="border-t-4 border-r-4 border-green-400 w-10 h-10" />
            </div>
            <div className="absolute bottom-0 w-full flex justify-between p-6 pointer-events-none">
              <div className="border-b-4 border-l-4 border-green-400 w-10 h-10" />
              <div className="border-b-4 border-r-4 border-green-400 w-10 h-10" />
            </div>

            {/* Stop button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded"
            >
              Stop
            </button>

            {/* Live scanning pulse */}
            {isLoading && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <span className="text-green-400 text-sm">Scanning...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Result */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p>
          FACE IDENTIFIED:{" "}
          <span
            className={`font-semibold ${
              result.status === "VERIFIED" ? "text-green-600" : "text-red-500"
            }`}
          >
            {result.name}
          </span>
        </p>
        <p>
          CONFIDENCE:{" "}
          <span className="text-green-600">{result.confidence}</span>
        </p>
        <p>
          STATUS:{" "}
          <span
            className={`font-semibold ${
              result.status === "VERIFIED" ? "text-green-600" : "text-red-500"
            }`}
          >
            {result.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ImageContainer;
