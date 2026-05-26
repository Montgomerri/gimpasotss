"use client";

export default function Categories() {
  const quickLinks = [
    { label: "Student Complaint Form", href: "https://accounts.google.com/v3/signin/confirmidentifier?authuser=1&continue=https%3A%2F%2Fdocs.google.com%2Fforms%2Fu%2F1%2Fd%2Fe%2F1FAIpQLSfnfNINNiW_byDh0lHoQq3bsJTsdkvnfiOrpnSHX_vqVb8tDw%2Fviewform&dsh=S19608468%3A1772107808671237&followup=https%3A%2F%2Fdocs.google.com%2Fforms%2Fu%2F1%2Fd%2Fe%2F1FAIpQLSfnfNINNiW_byDh0lHoQq3bsJTsdkvnfiOrpnSHX_vqVb8tDw%2Fviewform&ifkv=ASfE1-oS2EU4GwfbO3koAU30Vh9ubD6bai8Tn8mO-4C_e7J2FsGXicw9bnDVnMcqZAlsNTURre7HFQ&ltmpl=forms&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin" },
    { label: "ID card request(new students)", href: "https://forms.gle/22wLYP98gLLpcpyy5" },
    { label: "Lecturer Evaluation Portal", href: "https://evaluation.gimpa.edu.gh/" },
    { label: "ID card request(Replacement)", href: "https://forms.gle/94hChbaZtoT1jqeL6" },
    { label: "Library", href: "https://gimpa.edu.gh/library/" },
  ];

  return (
    <section style={{ background: "#f9f9f9", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#000000", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
            Get In Touch
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#1a1a2e" }}>
            Reach Out
          </h2>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          <div style={cardStyle("#2ecc8a")}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}></div>
            <h3 style={titleStyle}>Open Hours</h3>
            <p style={textStyle}>Mon–Sat : 8:30 – 18:00 GMT</p>
          </div>

          <div style={cardStyle("#012E5B")}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}></div>
            <h3 style={titleStyle}>Phone Number</h3>
            <p style={textStyle}>
              +233-(0) 501620138
              <br />
              +233-(0) 332095432
            </p>
          </div>

          <div style={cardStyle("#000000")}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}></div>
            <h3 style={titleStyle}>Our Location</h3>
            <p style={textStyle}>GIMPA School of Technology</p>
          </div>

          <div style={cardStyle("#ffffff")}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}></div>
            <h3 style={titleStyle}>Our Email</h3>
            <a
              href="mailto:csshead@gimpa.edu.gh"
              style={{
                fontSize: "14px",
                color: "#2ecc8a",
                lineHeight: "1.7",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              csshead@gimpa.edu.gh
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "20px",
            padding: "40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "white", margin: 0 }}>
            Quick Links
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#ffffff15",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid #ffffff20",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2ecc8a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff15")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

const cardStyle = (borderColor: string): React.CSSProperties => ({
  background: "#fff",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  borderTop: `4px solid ${borderColor}`,
});

const titleStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#1a1a2e",
  marginBottom: "10px",
};

const textStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  lineHeight: "1.7",
};