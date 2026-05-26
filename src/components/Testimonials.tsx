"use client";

export default function Testimonials() {
  const programmes = [
    {
      level: "BSc",
      courses: "BSc Computer Science, BSc ICT, BSc MIS",
      duration: "4 Years",
      mode: "Day & Evening",
      color: "#000000",
      enrollLink: "https://apply.gimpa.edu.gh/start",
    },
    {
      level: "MSc / MPhil",
      courses:
        "MSc/MPhil ICT, MSc IT & Law, MSc MIS, MSc Digital Forensics & Cybersecurity, MSc Industrial Analytics",
      duration: "2 Years",
      mode: "Evening & Weekend",
      color: "#000000",
      enrollLink: "https://apply.gimpa.edu.gh/start",
    },
    {
      level: "PGD",
      courses: "PGD ICT, PGD MIS",
      duration: "1 Year",
      mode: "Weekend",
      color: "#000000",
      enrollLink: "https://apply.gimpa.edu.gh/start",
    },
  ];

  return (
    <section style={{ background: "#f9f9f9", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <p style={{ color: "#000000", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
            Academic Offerings
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#1a1a2e" }}>
            Popular Programmes
          </h2>
        </div>

        {/* Programmes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {programmes.map((prog, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "32px 36px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                borderLeft: `6px solid ${prog.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {/* Left Content */}
              <div style={{ flex: 1, minWidth: "260px" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: prog.color,
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: "50px",
                    marginBottom: "14px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {prog.level}
                </span>

                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    lineHeight: "1.7",
                    marginBottom: "12px",
                  }}
                >
                  {prog.courses}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", color: "#666" }}>{prog.duration}</span>
                  <span style={{ color: "#ddd" }}>•</span>
                  <span style={{ fontSize: "13px", color: "#666" }}>{prog.mode}</span>
                </div>
              </div>

              {/* Enroll Button */}
              <div>
                <a
                  href={prog.enrollLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: prog.color,
                    color: "white",
                    padding: "12px 28px",
                    borderRadius: "50px",
                    fontWeight: 600,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Enroll Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href="https://gimpa.edu.gh/dept-computer-science-and-information-systems/#bsmsprogrammes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#1a1a2e",
              border: "2px solid #1a1a2e",
              padding: "12px 36px",
              borderRadius: "50px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1a2e";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#1a1a2e";
            }}
          >
            Explore More
          </a>
        </div>

      </div>
    </section>
  );
}