import { useEffect, useRef, useState } from "react";
import axios from "axios";

type EnrolledUser = {
  first_name: string;
  last_name: string;
  email: string;
};

function SuccessScreen({
  user,
  onEnrollAnother,
}: {
  user: EnrolledUser;
  onEnrollAnother: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6 text-center animate-fade-in">
      {/* Animated checkmark */}
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute w-24 h-24 rounded-full bg-green-100 animate-ping opacity-30" />
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-900">
          Enrolled Successfully!
        </h2>
        <p className="text-gray-500 text-sm">
          The user has been registered in the biometrics system.
        </p>
      </div>

      {/* User card */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Avatar initials */}
          <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.first_name[0]?.toUpperCase()}
            {user.last_name[0]?.toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-lg font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Biometric face data captured
        </div>
      </div>

      <button
        onClick={onEnrollAnother}
        className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white py-3 rounded-xl font-semibold"
      >
        Enroll Another User
      </button>
    </div>
  );
}

function EnrollmentComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [enrolledUser, setEnrolledUser] = useState<EnrolledUser | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      setCameraStarted(true);
    } catch (error) {
      console.error(error);
      setMessage("Unable to access camera");
    }
  };

  useEffect(() => {
    if (cameraStarted && videoRef.current && streamRef.current) {
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
  }, [cameraStarted]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStarted(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnrollment = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("file", blob, "enrollment.jpg");

      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:8000/users/enroll",
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        // Stop camera before showing success screen
        stopCamera();

        setEnrolledUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        });

        setFormData({ first_name: "", last_name: "", email: "", password: "" });
        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        setMessage("Enrollment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const handleEnrollAnother = () => {
    setEnrolledUser(null);
    setMessage("");
  };

  // ── Success Screen ──────────────────────────────────────────
  if (enrolledUser) {
    return (
      <SuccessScreen
        user={enrolledUser}
        onEnrollAnother={handleEnrollAnother}
      />
    );
  }

  // ── Enrollment Form ─────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Biometric Enrollment</h1>
        <p className="text-gray-500 mt-2">
          Register a new user into the biometrics system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="relative h-80 rounded-2xl overflow-hidden bg-black">
        {!cameraStarted ? (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={startCamera}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Start Enrollment Camera
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={640}
              height={480}
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Stop
            </button>
            <div className="absolute inset-0 border-[3px] border-green-400 rounded-2xl pointer-events-none" />
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={handleEnrollment}
        disabled={!cameraStarted || loading}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 active:scale-95 transition-all text-white py-3 rounded-xl font-semibold"
      >
        {loading ? "Enrolling User..." : "Enroll User"}
      </button>

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {message}
        </div>
      )}
    </div>
  );
}

export default EnrollmentComponent;
