"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update displayName in Firebase Auth
      await updateProfile(user, { displayName: firstName.trim() });

      // 3️⃣ Store extra info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: firstName.trim(),
        email: email.trim(),
        createdAt: new Date(),
      });

      alert("Account created! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      console.error("Firebase signup error:", err);
      setError(err.message || "Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    alert("Google sign-in (implement OAuth)");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        background: "linear-gradient(160deg, #b8dff5 0%, #d6eef9 40%, #e8f4fb 70%, #c5e8f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background circles */}
      <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)", top: "50%", left: "50%", transform: "translate(-50%, -30%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", top: "50%", left: "50%", transform: "translate(-50%, -25%)", pointerEvents: "none" }} />

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: "28px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 8px 40px rgba(100,160,200,0.15)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.9)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: "26px" }} aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>Create your account</h2>
          <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" }}>Join AskNet and start asking questions,<br />getting answers. For free.</p>
        </div>

        {/* Inputs */}
        <div style={inputWrapper}>
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={showBtnStyle}>{showPassword ? "Hide" : "Show"}</button>
        </div>

        {/* Error */}
        {error && <p style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

        {/* Submit */}
        <button onClick={handleSignup} disabled={loading} style={submitBtnStyle}>{loading ? "Creating account..." : "Get Started"}</button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
          <span style={{ fontSize: "13px", color: "#999", whiteSpace: "nowrap" }}>Or sign in with</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Google */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button type="button" onClick={handleGoogle} style={googleBtnStyle}>
            <span style={{ fontWeight: 600 }}>Continue with Google</span>
          </button>
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#666", margin: 0 }}>
          Already have an account?{" "}
          <Link href="login" style={{ color: "#1a1a2e", fontWeight: 700, textDecoration: "none" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

/* =========================
   STYLES (unchanged)
========================= */
const inputWrapper: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(200,220,235,0.8)", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", position: "relative" };
const inputStyle: React.CSSProperties = { border: "none", outline: "none", background: "transparent", fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "#1a1a2e", width: "100%" };
const showBtnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#1a1a1a", padding: 0, flexShrink: 0 };
const submitBtnStyle: React.CSSProperties = { width: "100%", padding: "14px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer", opacity: 1, marginBottom: "20px", transition: "opacity 0.2s" };
const googleBtnStyle: React.CSSProperties = { flex: 1, padding: "12px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(200,220,235,0.8)", borderRadius: "12px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" };