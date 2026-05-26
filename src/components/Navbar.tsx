"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");

  const navLinks = [
    "Home",
    "About",
    "News and events",
    "Programs",
    "Student services",
  ];

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff5f0;
          width: 100%;
        }

        .navbar-inner {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .navbar-logo-image {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .navbar-logo-text {
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .navbar-logo-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #f4c430;
          border-radius: 50%;
          margin-left: 1px;
          margin-bottom: 12px;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-links li a {
          text-decoration: none;
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #444;
          padding: 6px 14px;
          border-radius: 6px;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }

        .navbar-links li a:hover {
          color: #1a1a2e;
          background: #f5f5f5;
        }

        .navbar-links li a.active {
          color: #1a1a2e;
          font-weight: 700;
        }

        .navbar-cta {
          background: #2ecc8a;
          color: #ffffff;
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 26px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.2s ease;
          white-space: nowrap;
        }

        .navbar-cta:hover {
          background: #27b87a;
          transform: translateY(-1px);
        }

        .navbar-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }

        .navbar-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #1a1a2e;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .navbar-mobile {
          display: none;
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
          padding: 16px 5%;
        }

        .navbar-mobile.open {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .navbar-mobile a {
          text-decoration: none;
          font-family: "Poppins", "Segoe UI", sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #444;
          padding: 10px 14px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .navbar-mobile a:hover {
          background: #f5f5f5;
          color: #1a1a2e;
        }

        .navbar-mobile .navbar-cta-mobile {
          background: #2ecc8a;
          color: white;
          text-align: center;
          margin-top: 8px;
          padding: 12px;
          border-radius: 50px;
        }

        @media (max-width: 768px) {
          .navbar-links,
          .navbar-cta {
            display: none;
          }

          .navbar-hamburger {
            display: flex;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <Image
              src="/images/logo.jpg"
              alt="SOTSS Logo"
              width={36}
              height={36}
              className="navbar-logo-image"
            />
            <span className="navbar-logo-text">SOTSS</span>
            <span className="navbar-logo-dot" />
          </Link>

          {/* Center Nav Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={link === "About" ? "#about" : "#"}
                  className={activeLink === link ? "active" : ""}
                  onClick={() => setActiveLink(link)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Asknet button -> signup page */}
          <Link href="/signup" className="navbar-cta">
            Asknet
          </Link>

          <button
            className="navbar-hamburger"
            onClick={() => {
              const menu = document.getElementById("mobile-menu");
              if (menu) menu.classList.toggle("open");
            }}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="navbar-mobile">
          {navLinks.map((link) => (
            <a key={link} href={link === "About" ? "#about" : "#"}>
              {link}
            </a>
          ))}
          <Link href="/signup" className="navbar-cta-mobile">
            Join Us
          </Link>
        </div>
      </nav>
    </>
  );
}