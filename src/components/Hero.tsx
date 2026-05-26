// src/components/Hero.tsx
"use client";
export default function Hero() {
  return (
    <section className="section" style={{ background: "#015BC1", position: "relative" }}>
      <div
        className="container"
        style={{
          minHeight: "500px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* Left Text */}
        <div style={{ maxWidth: "500px", flex: "1" }}>
          <p style={{ color: "#ffffff", fontWeight: 700, marginBottom: "10px" }}>
            E-Learning Platform
          </p>
          <h1 style={{ fontSize: "48px", fontWeight: 700, lineHeight: "1.2", color: "#ffffff" }}>
            Smart Learning Deeper & More{" "}
            <span style={{ color: "#3EBC84" }}>-Amazing</span>
          </h1>
          <p style={{ marginTop: "20px", color: "#ffffff", lineHeight: "1.7" }}>
The Department of Computer Science & Information Systems equips students with cutting-edge skills in technology, research, and innovation ,preparing them for global impact.
          </p>
          <div style={{ marginTop: "30px", display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              style={{
                background: "#2ecc8a",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "50px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Join our Asknet community
            </button>
            <button
              style={{
                background: "transparent",
                color: "#1a1a2e",
                padding: "12px 28px",
                borderRadius: "50px",
                border: "2px solid #ffffff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ▶ How it Works
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <img
            src="/images/hero-person.png"
            alt="Hero"
            style={{
              width: "100%",
              maxWidth: "500px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </section>
  );
}