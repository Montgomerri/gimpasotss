"use client";

export default function HeadMessage() {
  return (
    <section style={{ background: "#fff", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
      <div
        className="container"
        style={{
          display: "flex",
          gap: "60px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Left - Photo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #2ecc8a",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="/images/head.png"
              alt="Department Head"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e", margin: 0 }}>
              Dr. Felicia Engmann
            </p>
            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>
              Head of Department
            </p>
          </div>
        </div>

        {/* Right - Message */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <p
            style={{
              color: "#48D197",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Head's Message
          </p>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1a1a2e",
              lineHeight: "1.3",
              marginBottom: "20px",
            }}
          >
            A Message From Our{" "}
            <span style={{ color: "#2ecc8a" }}>Department Head</span>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#555",
              lineHeight: "1.9",
              marginBottom: "16px",
            }}
          >
            Head, Department of Computer Science and Information Systems.

A warm welcome to the Department of Computer Sciences. This department hosts typical computer and other related computational sciences programmes within GIMPA. Driven by the needs of Ghana and the West African Sub-region, we employ our core values of excellence, quality and connectedness to deliver relevant education to our students, offer consultancy and training to our stakeholders, and conduct cutting-edge research in the computing fields.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#555",
              lineHeight: "1.9",
              marginBottom: "28px",
            }}
          >
            
We achieve these using state-of-the-art facilities and employing faculty with diverse backgrounds in Information Technology and Computing. I am proud to welcome you to this portal. I look forward to receiving you as a student, researcher, or industry practitioner.
          </p>

          {/* Signature */}
          <div
            style={{
              borderLeft: "4px solid #2ecc8a",
              paddingLeft: "16px",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: "#888",
                fontSize: "14px",
                margin: 0,
              }}
            >
              ......
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}