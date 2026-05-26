// src/components/CTASection.tsx
export default function CTASection() {
  return (
    <section
      id="about"
      style={{
        background: "#fff",
        padding: "100px 0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            About Our Departments
          </h2>
          <p
            style={{
              color: "#888",
              marginTop: "12px",
              fontSize: "14px",
              maxWidth: "600px",
              marginInline: "auto",
              lineHeight: "1.7",
            }}
          >
          The Department of Computer Science and Information Systems was established following the merger of the departments of Computer Sciences and Information Systems and Innovation by the Institute’s management in September 2023. The staff strength at the time of the establishment of the department was eleven-seven full-time lecturers.

The department began with some existing academic programmes from the merged departments. These include BSc Computer Science, BSc Information and Communication Technology.

MSc/MPhil Information and Communication Technology, MSc Information Technology and Law, MSc/MPhil Management Information Systems, MSc Applied Mathematics (now MSc Industrial Analytics), MSc Digital Forensics and Cybersecurity, PhD Information Systems, Postgraduate Diploma in Information and Communication Technology, Diploma in Applied Computer Science, and BSc Health Informatics.

Both classrooms and computer laboratories are shared with the Department of Information Systems and Innovation within the School of Technology.

Ghana Institute of Management and Public Administration uses Simio simulation software under a grant from Simio LLC (www.simio.com).
          </p>
        </div>

        {/* Three Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Teach Card */}
          <div
            style={{
              background: "#fff5f0",
              borderRadius: "16px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              transition: "0.3s ease",
            }}
          >
            <span style={{ fontSize: "30px" }}></span>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a2e",
              }}
            >
              SOTSS
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              Department of economics And Applied Mathematics
            </p>

            <a
              href="https://gimpa.edu.gh/dept-economics-and-applied-mathematics/"
              style={{
                marginTop: "auto",
                background: "#1a1a2e",
                color: "white",
                padding: "10px 22px",
                borderRadius: "40px",
                fontWeight: 600,
                fontSize: "13px",
                textDecoration: "none",
                alignSelf: "flex-start",
                display: "inline-block",
              }}
            >
              explore
            </a>
          </div>

          {/* Learn Card */}
          <div
            style={{
              background: "#1a1a2e",
              borderRadius: "16px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <span style={{ fontSize: "30px" }}></span>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "white",
              }}
            >
              SOTSS
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "#bbb",
                lineHeight: "1.6",
              }}
            >
              Department of Liberal Arts & Hospitality Studies
            </p>

            <a
              href="https://gimpa.edu.gh/dept-liberal-arts-hospitality-studies/"
              style={{
                marginTop: "auto",
                background: "#000000",
                color: "white",
                padding: "10px 22px",
                borderRadius: "40px",
                fontWeight: 600,
                fontSize: "13px",
                textDecoration: "none",
                alignSelf: "flex-start",
                display: "inline-block",
              }}
            >
              explore
            </a>
          </div>

          {/* Explore Programs Card */}
          <div
            style={{
              background: "#f4f7ff",
              borderRadius: "16px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <span style={{ fontSize: "30px" }}></span>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a2e",
              }}
            >
            SOTSS
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              Department of computer Science and Information Systems
            </p>

            <a
             
              style={{
                marginTop: "auto",
                background: "#000000",
                color: "white",
                padding: "10px 22px",
                borderRadius: "40px",
                fontWeight: 600,
                fontSize: "13px",
                textDecoration: "none",
                alignSelf: "flex-start",
                display: "inline-block",
              }}
            >
              Current page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}