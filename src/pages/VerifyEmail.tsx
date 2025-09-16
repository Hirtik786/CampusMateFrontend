import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (token) {
            fetch(`https://campusmatebackend-production.up.railway.app/auth/verify?token=${token}`)
                .then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                        setStatus("success");
                        setMessage(data.message);
                    } else {
                        setStatus("error");
                        setMessage(data.message);
                    }
                })
                .catch(() => {
                    setStatus("error");
                    setMessage("Something went wrong. Please try again.");
                });
        } else {
            setStatus("error");
            setMessage("Missing token.");
        }
    }, [token]);

    // Redirect after 3s if success
    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="p-8 max-w-md w-full rounded-2xl shadow-xl bg-white text-center space-y-4">
                {status === "loading" && (
                    <>
                        <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
                        <p className="text-gray-700 font-medium">{message}</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <div className="text-5xl">✅</div>
                        <h2 className="text-xl font-semibold text-green-600">{message}</h2>
                        <p className="text-gray-500 text-sm">Redirecting to login...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <div className="text-5xl">❌</div>
                        <h2 className="text-xl font-semibold text-red-600">{message}</h2>
                        <p className="text-gray-500 text-sm">You may close this tab or try again.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
