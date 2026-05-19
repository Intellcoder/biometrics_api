import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Waiting for authentication...");
  const [user, setUser] = useState<any>(null);

  // 🎥 START CAMERA (FIXED)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // IMPORTANT: wait for metadata BEFORE play
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
          } catch (err) {
            console.error("Play error:", err);
          }
        };
      }

      setIsScanning(true);
    } catch (error) {
      console.error(error);
      setMessage("Unable to access camera");
    }
  };

  useEffect(() => {
    if (isScanning && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.onloadedmetadata = async () => {
        try {
          await video.play();
        } catch (err) {
          console.error("Video play error:", err);
        }
      };
    }
  }, [isScanning]);

  // 🛑 STOP CAMERA
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // 📸 LOGIN
  const handleLogin = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // IMPORTANT: ensure video is ready
    if (video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "login.jpg");

      try {
        setLoading(true);

        const res = await axios.post(
          "http://localhost:8000/auth/face-login",
          formData,
        );

        localStorage.setItem("token", res.data.token);

        setUser(res.data.user);
        setMessage("Login successful!");

        stopCamera();

        // 🚀 ROUTE TO DASHBOARD
        setTimeout(() => {
          navigate("/");
        }, 800);
      } catch (err) {
        console.error(err);
        setMessage("Face not recognized");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-4">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Biometric Login</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Authenticate using facial recognition
        </p>
      </div>

      {/* CAMERA BOX */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        {!isScanning ? (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={startCamera}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Start Camera
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Stop
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* BUTTON */}
      <button
        onClick={handleLogin}
        disabled={!isScanning || loading}
        className="bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Login"}
      </button>

      {/* STATUS */}
      <div className="bg-gray-100 p-3 rounded-xl text-sm">{message}</div>

      {/* USER DATA */}
      {user && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-sm">
          <p>
            <b>Name:</b> {user.first_name} {user.last_name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>ID:</b> {user.id}
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
