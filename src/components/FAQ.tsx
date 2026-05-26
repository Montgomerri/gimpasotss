"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Where can I get application forms?",
      answer: (
        <>
          Proceed to apply online at{" "}
          <a
            href="https://apply.gimpa.edu.gh/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#000000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            https://apply.gimpa.edu.gh/
          </a>
          .
          <br />
          <br />
          Admission fee is payable ONLY after you submit your application.
          Obtain your application code (e.g. APPL0000) from your dashboard by
          clicking on <strong>Application Summary</strong>.
          <br />
          <br />
          <strong>Payment Modes:</strong>
          <br />
          CBG USSD: Dial *924*200*16# → select Application Form → enter your
          code → pay.
          <br />
          Ecobank (VISA/Mobile Money): Select Ecobank at payment prompt or use
          the dashboard “Pay Application” button.
          <br />
          <br />
          To proceed contact{" "}
          <a
            href="mailto:admissions@gimpa.edu.gh"
            style={{
              color: "#000000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            admissions@gimpa.edu.gh
          </a>
          .
        </>
      ),
    },
    {
      question: "How much is the application fee?",
      answer: (
        <>
          <strong>Fees by program:</strong>
          <br />
          Post First Degree Law (LLB): GHC 350
          <br />
          Masters / Postgraduate Diploma: GHC 250
          <br />
          Bachelors / Diploma: GHC 200
          <br />
          International Students: USD 100
        </>
      ),
    },
    {
      question: "What number can I call for enquiries?",
      answer: (
        <>
          <strong>Main lines:</strong>
          <br />
          <a
            href="tel:+233501620138"
            style={{ color: "#000000", fontWeight: 600, textDecoration: "none" }}
          >
            +233 (0)501 620138
          </a>
          <br />
          <a
            href="tel:+233302908076"
            style={{ color: "#000000", fontWeight: 600, textDecoration: "none" }}
          >
            +233 (0)302 908076
          </a>
          <br />
          <br />
          Email:{" "}
          <a
            href="mailto:csshead@gimpa.edu.gh"
            style={{
              color: "#000000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            csshead@gimpa.edu.gh
          </a>
        </>
      ),
    },
    {
      question: "What is the duration of your degree programmes?",
      answer: (
        <>
          Undergraduate: 4 years
          <br />
          Masters: 1–2 years depending on program
          <br />
          PG Diploma: 1 year
        </>
      ),
    },
    {
      question: "Do you offer short courses?",
      answer:
        "Yes. We offer short courses through the GIMPA Training and Consulting Unit.",
    },
  ];

  return (
    <section
      style={{
        background: "#f9f9f9",
        padding: "80px 0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          gap: "60px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Left */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <p
            style={{
              color: "#ff6d5a",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1a1a2e",
              lineHeight: "1.3",
            }}
          >
            Frequently asked
            <br />
            Questions
          </h2>
          <p
            style={{
              color: "#888",
              marginTop: "16px",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            For any unanswered questions, reach out to our support team via
            email. We'll respond as quickly as possible.
          </p>
        </div>

        {/* Right - Accordion */}
        <div style={{ flex: "2", minWidth: "300px" }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "12px",
                marginBottom: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a2e",
                  textAlign: "left",
                }}
              >
                {faq.question}
                <span
                  style={{
                    fontSize: "20px",
                    color: openIndex === index ? "#ff6d5a" : "#888",
                    transition: "transform 0.3s ease",
                    transform:
                      openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                    marginLeft: "12px",
                  }}
                >
                  +
                </span>
              </button>

              {openIndex === index && (
                <div
                  style={{
                    padding: "0 20px 18px",
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: "1.8",
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}