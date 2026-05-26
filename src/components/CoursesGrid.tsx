"use client";

export default function CoursesGrid() {
  const courses = [
    {
      title: "Graduate with internationally recognized GIMPA degrees and diplomas that validate your skills and open doors to further studies, career advancement, and leadership opportunities globally.",
      category: "Recognized GIMPA Degrees & Diplomas",
    },
    {
      title: "Through partnerships with leading tech companies, startups, and organizations, GIMPA provides students with internships, career guidance, and direct job opportunities, preparing them to thrive in Africa’s and the global job market.",
      category: "Industry Partnerships & Career Support",
    },
    {
      title: "Students benefit from state-of-the-art computer labs, high-speed internet, and digital resources that remain accessible around the clock to support learning, research, and innovation.",
      category: "Computer Labs & Digital Resources",
    },
    {
      title: "Our faculty combines years of teaching, research, and real-world industry practice, ensuring students gain both theoretical knowledge and practical insights from world-class lecturers and researchers.",
      category: "World-Class Lecturers & Researchers",
    },
    {
      title: "Get academic support when you need it. Our AI-powered chatbot provides instant answers to your questions 24/7, while dedicated faculty and mentors are available for in-depth guidance.",
      category: "Live Q&A Support",
    },
    {
      title: "GIMPA’s blended learning model offers the best of both worlds — structured in-person lectures and convenient online access to recorded sessions, giving students the flexibility to study at their own pace without compromising academic quality.",
      category: "Blended Learning &Flexible Study Modes",
    },
  ];

  const categoryColors: { [key: string]: string } = {
    DESIGN: "#000000",
    ILLUSTRATION: "#000000",
    "UI/UX": "#000000",
    BUSINESS: "#000000",
  };

  return (
    <section style={{ background: "#f9f9f9", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#1a1a2e" }}>
            What We Offer
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {courses.map((course, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                padding: "28px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* Category Badge */}
              <span
                style={{
                  background: categoryColors[course.category] || "#888",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "50px",
                  display: "inline-block",
                  marginBottom: "16px",
                }}
              >
                {course.category}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#1a1a2e",
                  lineHeight: "1.6",
                }}
              >
                {course.title}
              </h3>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            style={{
              background: "transparent",
              color: "#1a1a2e",
              border: "2px solid #1a1a2e",
              padding: "12px 32px",
              borderRadius: "50px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              transition: "all 0.3s ease",
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
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}