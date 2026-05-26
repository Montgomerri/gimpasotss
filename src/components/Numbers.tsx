// src/components/Numbers.tsx
export default function Numbers() {
  const stats = [
    { number: "25,000+", label: "Students" },
    { number: "135+", label: "Programs" },
    { number: "250+", label: "Faculty" },
    { number: "50+", label: "Research Labs" },
  ];

  return (
    <section className="section">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ flex: "1 1 200px", textAlign: "center" }}
          >
            <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#1e3a8a" }}>
              {stat.number}
            </h2>
            <p style={{ marginTop: "10px", fontSize: "18px", color: "#666" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}