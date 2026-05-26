import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Department of Computer Science",
  description: "Official Departmental Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Chatbase Chatbot Script */}
        <Script
          src="https://www.chatbase.co/embed.min.js"
          id="kb7EDUojle9U7iyXXiloJ"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}