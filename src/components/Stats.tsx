// src/components/Stats.tsx
export default function Stats() {
  const stats = [
    { number: "15+", label: "Experienced Faculty", sublabel: "With industry standard experience" },
    { number: "3000+", label: "Students Enrolled ", sublabel: "11+ Unique Programmes" },
    { number: "1200+", label: "Ratings & reviews", sublabel: "Accross Multiple Platforms" },
  ];

  return (
    <section style={{ background: "#fff5f0", paddingBottom: "60px" }}>
      <div
        className="container"
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "40px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "#444",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
            lineHeight: "1.8",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          The Department of Technology at Ghana Institute of Management and Public Administration<><strong>(GIMPA){" "}</strong></> 
          <strong></strong> empowers students with cutting-edge digital skills, practical experience, and innovative thinking.{" "}
          <strong></strong> We prepare graduates to thrive in a rapidly evolving technological world and contribute meaningfully to national and global development.</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: "#1a1a2e",
                  margin: 0,
                }}
              >
                {stat.number}
              </h2>
              <p style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
                {stat.label}
                <br />
                <span style={{ color: "#888" }}>{stat.sublabel}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}