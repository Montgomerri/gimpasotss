"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
// Supabase removed and replaced with Firebase
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  limit,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

/* =========================
   TYPES
========================= */

type Question = {
  id: string; // firestore doc id
  title: string;
  description: string;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  author: string;
  time: string;
};

const initialQuestions: Question[] = [
  {
    id: "1",
    title: "How to properly structure a Next.js App Router project?",
    description:
      "I’m building a large-scale application and wondering what folder structure is considered best practice with the App Router...",
    votes: 12,
    answers: 3,
    views: 221,
    tags: ["next.js", "architecture", "react"],
    author: "john_dev",
    time: "asked 2 hours ago",
  },
  {
    id: "2",
    title: "Difference between Server and Client Components in Next.js 16",
    description:
      "Can someone clearly explain when to use server components vs client components in real production apps?",
    votes: 8,
    answers: 2,
    views: 104,
    tags: ["next.js", "server-components"],
    author: "maria_codes",
    time: "asked yesterday",
  },
];

/* =========================
   HOOK: Detect Mobile
========================= */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

/* =========================
   MAIN COMPONENT
========================= */

export default function Dashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch questions from Firestore on mount
  useEffect(() => {
    let mounted = true;

    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (!mounted) return;

        const docs = snapshot.docs;

        // For each question, attempt to resolve author name from users collection
        const formatted: Question[] = await Promise.all(
          docs.map(async (docSnap) => {
            const data: any = docSnap.data();
            // get author name if userId present
            let authorName = "Anonymous";
            try {
              if (data.userId) {
                const userDocRef = doc(db, "users", data.userId);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                  const ud = userSnap.data() as any;
                  authorName = ud.fullName || ud.displayName || ud.full_name || "Anonymous";
                }
              }
            } catch (e) {
              console.warn("Error fetching user for question:", e);
            }

            const createdAt = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date();

            return {
              id: docSnap.id,
              title: data.title || "",
              description: data.description || "",
              votes: data.votes ?? 0,
              answers: data.answers ?? 0,
              views: data.views ?? 0,
              tags: data.tags ?? [],
              author: authorName,
              time: createdAt.toLocaleString(),
            } as Question;
          })
        );

        setQuestions(formatted);
      } catch (err) {
        console.error("Unexpected error fetching questions:", err);
      }
    };

    fetchQuestions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      <TopBar
        isMobile={isMobile}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div style={styles.layout}>
        {/* Sidebar */}
        {(isMobile ? mobileMenuOpen : true) && (
          <Sidebar
            isMobile={isMobile}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main */}
        <main
          style={{
            ...styles.main,
            marginLeft: !isMobile ? 220 : 0,
            marginRight: !isMobile ? 300 : 0,
          }}
        >
          <div
            style={{
              ...styles.headerRow,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 12 : 0,
            }}
          >
            <h1 style={styles.heading}>All Questions</h1>
            <button
              style={styles.primaryButton}
              onClick={() => setIsModalOpen(true)}
            >
              Ask Question
            </button>
          </div>

          <div style={styles.questionList}>
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} isMobile={isMobile} />
            ))}
          </div>
        </main>

        {/* Right Sidebar (Desktop Only) */}
        {!isMobile && <RightSidebar />}
      </div>

      {/* Modal rendered at the root of this component */}
      {/* Pass setQuestions so modal can update the list after successful insert */}
      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setQuestions={setQuestions}
      />
    </div>
  );
}

/* =========================
   ASK QUESTION MODAL
   (mobile-friendly + Markdown-style toolbar)
========================= */

function AskQuestionModal({
  isOpen,
  onClose,
  setQuestions,
}: {
  isOpen: boolean;
  onClose: () => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  if (!isOpen) return null;

  // Helper: replace selection with new text and restore reasonable selection
  function replaceSelection(newText: string, selectFrom = 0, selectLen = 0) {
    const el = descRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = description.slice(0, start);
    const after = description.slice(end);
    const updated = before + newText + after;
    setDescription(updated);

    // Allow React to update textarea, then restore focus+selection
    setTimeout(() => {
      el.focus();
      const newStart = before.length + selectFrom;
      el.selectionStart = newStart;
      el.selectionEnd = newStart + selectLen;
    }, 0);
  }

  function getSelectionRange() {
    const el = descRef.current;
    if (!el) return { start: 0, end: 0, selected: "" };
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    return { start, end, selected: description.slice(start, end) };
  }

  // Inline wrappers (bold, italic, inline code)
  function wrapInline(before: string, after: string) {
    const { selected } = getSelectionRange();
    const wrapped = before + (selected || "") + after;
    replaceSelection(wrapped, before.length, (selected || "").length);
  }

  // Block wrapper for code fence
  function wrapCodeBlock() {
    const { selected } = getSelectionRange();
    const content = selected || "your code here";
    const wrapped = `\n\`\`\`\n${content}\n\`\`\`\n`;
    replaceSelection(wrapped, 4, content.length);
  }

  // Transform selected lines (lists, blockquote)
  function transformLines(transformer: (line: string, index: number) => string) {
    const { selected } = getSelectionRange();
    const lines = (selected || "").split("\n");
    const transformed = lines.map(transformer).join("\n");
    replaceSelection(transformed, 0, transformed.length);
  }

  function insertLink() {
    const { selected } = getSelectionRange();
    const url = window.prompt("Enter the URL (include https://):", "https://");
    if (!url) return;
    const text = selected || window.prompt("Text for the link:", "link text") || url;
    const markdown = `[${text}](${url})`;
    replaceSelection(markdown, 1, text.length);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  }

  async function handlePostQuestion() {
    try {
      if (submitting) return;
      if (!title.trim() || !description.trim()) {
        alert("Title and description are required.");
        return;
      }

      setSubmitting(true);

      // --- SAFELY get current user from Firebase Auth ---
      const user: FirebaseUser | null = auth.currentUser ?? null;

      // If not logged in, allow posting as anonymous, ask user to confirm
      let userIdToSend: string | null = null;
      if (user && user.uid) {
        userIdToSend = user.uid;
      } else {
        const confirmAnon = window.confirm(
          "You appear to be not logged in. Do you want to post this question anonymously?"
        );
        if (!confirmAnon) {
          setSubmitting(false);
          return;
        }
        userIdToSend = null;
      }

      // --- CHECK FOR EXISTING TITLE to avoid duplicates ---
      try {
        const q = query(
          collection(db, "questions"),
          where("title", "==", title.trim()),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const keep = window.confirm(
            "A question with this exact title already exists. Post anyway?"
          );
          if (!keep) {
            setSubmitting(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Exception while checking existing title:", e);
        // continue — we'll rely on the insert error if any
      }

      // NOTE: Image upload omitted (you can add Storage later)

      const insertPayload: any = {
        title: title.trim(),
        description: description.trim(),
        userId: userIdToSend,
        image_path: null,
        votes: 0,
        answers: 0,
        views: 0,
        tags: [],
        createdAt: serverTimestamp(),
      };

      console.log("Attempting insert with payload:", insertPayload);

      // insert into Firestore
      const docRef = await addDoc(collection(db, "questions"), insertPayload);

      // Build new question object for UI
      // Try to get the author's name
      let authorName = "Anonymous";
      if (userIdToSend) {
        try {
          const userSnap = await getDoc(doc(db, "users", userIdToSend));
          if (userSnap.exists()) {
            const ud = userSnap.data() as any;
            authorName = ud.fullName || ud.displayName || ud.full_name || "Anonymous";
          } else if (auth.currentUser?.displayName) {
            authorName = auth.currentUser.displayName;
          }
        } catch (e) {
          console.warn("Error fetching user after insert:", e);
        }
      } else if (user && user.displayName) {
        authorName = user.displayName;
      }

      const createdAtDate = new Date(); // UI will show now; Firestore server timestamp resolves later

      const newQuestion: Question = {
        id: docRef.id,
        title: insertPayload.title,
        description: insertPayload.description,
        votes: 0,
        answers: 0,
        views: 0,
        tags: [],
        author: authorName,
        time: createdAtDate.toLocaleString(),
      };

      // Add to UI list
      setQuestions((prev) => [newQuestion, ...prev]);

      // Reset and close
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Unexpected error in handlePostQuestion:", err);
      alert("An unexpected error occurred. Check console.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Overlay with click-to-close */}
      <div style={styles.modalOverlay} onClick={onClose} />

      {/* Modal box */}
      <div style={styles.modalContent} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Ask a Question</h2>

        {/* Title */}
        <label style={styles.label}>Title</label>
        <input
          type="text"
          placeholder="Enter your question title"
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description toolbar */}
        <label style={styles.label}>Description</label>

        <div style={styles.richTextToolbarWrap}>
          <div style={styles.richTextToolbar}>
            <button type="button" style={styles.toolbarButton} title="Bold" onClick={() => wrapInline("**", "**")}>
              <b>B</b>
            </button>
            <button type="button" style={styles.toolbarButton} title="Italic" onClick={() => wrapInline("*", "*")}>
              <i>I</i>
            </button>
            <button type="button" style={styles.toolbarButton} title="Inline code" onClick={() => wrapInline("`", "`")}>
              {"</>"}
            </button>
            <button type="button" style={styles.toolbarButton} title="Code block" onClick={wrapCodeBlock}>
              {"{ }"}
            </button>
            <button type="button" style={styles.toolbarButton} title="Ordered list" onClick={() => transformLines((line, i) => `${i + 1}. ${line}`)}>
              1.
            </button>
            <button type="button" style={styles.toolbarButton} title="Bulleted list" onClick={() => transformLines((line) => (line.trim() ? `- ${line}` : `-`))}>
              •
            </button>
            <button type="button" style={styles.toolbarButton} title="Blockquote" onClick={() => transformLines((line) => `> ${line}`)}>
              “
            </button>
            <button type="button" style={styles.toolbarButton} title="Insert link" onClick={insertLink}>
              🔗
            </button>
            <button type="button" style={styles.toolbarButton} title="Clear description" onClick={() => { setDescription(""); descRef.current?.focus(); }}>
              Clear
            </button>
          </div>

          <div style={styles.toolbarHint}>Tap buttons to insert Markdown formatting</div>
        </div>

        <textarea
          ref={descRef}
          placeholder="Describe your question..."
          style={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image upload */}
        <label style={styles.label}>Image</label>
        <input type="file" style={styles.input} accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div style={styles.imagePreviewWrap}>
            <img src={imagePreview} alt="preview" style={styles.imagePreview} />
            <button type="button" style={styles.removeImageBtn} onClick={() => setImageFile(null)}>
              Remove
            </button>
          </div>
        )}

        {/* Reference Link */}
        <label style={styles.label}>Reference Link</label>
        <input type="text" placeholder="Add a URL" style={styles.input} />

        {/* Actions */}
        <div style={styles.modalActions}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.submitButton} onClick={handlePostQuestion} disabled={submitting}>
            {submitting ? "Posting..." : "Post Question"}
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================
   TOP BAR
========================= */

function TopBar({
  onMenuClick,
  isMobile,
}: {
  onMenuClick: () => void;
  isMobile: boolean;
}) {
  return (
    <div style={styles.topBar}>
      
      {/* LEFT SIDE (hamburger + logo) */}
      <div style={styles.leftGroup}>
        {isMobile && (
          <button style={styles.hamburger} onClick={onMenuClick}>
            <MenuIcon />
          </button>
        )}
        <div style={styles.logo}>DevStack</div>
      </div>

      {/* CENTER (search only on desktop) */}
      {!isMobile && (
        <input
          placeholder="Search questions..."
          style={styles.search}
        />
      )}

      {/* RIGHT SIDE (ALWAYS visible now) */}
      <div style={styles.authRow}>
        <button style={styles.textButton}>Log in</button>
        <button style={styles.primaryButtonSmall}>Sign up</button>
      </div>
    </div>
  );
}

function Sidebar({
  isMobile,
  onClose,
}: {
  isMobile: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      style={{
        ...styles.sidebar,
        position: isMobile ? "fixed" : "fixed",
        top: 60,
        left: 0,
        height: "calc(100vh - 60px)",
        zIndex: 200,
        width: 220,
        background: "#fff",
      }}
    >
      {isMobile && (
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>
      )}
      <NavItem icon={<HomeIcon />} label="Home" href="/dashboard" />
      <NavItem icon={<QuestionIcon />} label="Questions" href="/lobby" />
      <NavItem icon={<TagIcon />} label="Tags" href="/tags" />
      <NavItem icon={<UserIcon />} label="Admin" href="/admin" /> {/* Admin now redirects */}
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={styles.navItem}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

/* =========================
   QUESTION CARD
========================= */

function QuestionCard({
  question,
  isMobile,
}: {
  question: Question;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        ...styles.card,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <div
        style={{
          ...styles.stats,
          flexDirection: isMobile ? "row" : "column",
          width: isMobile ? "100%" : 100,
          justifyContent: isMobile ? "space-between" : "flex-start",
        }}
      >
        <div>{question.votes} votes</div>
        <div>{question.answers} answers</div>
        <div>{question.views} views</div>
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={styles.cardTitle}>{question.title}</h2>
        <p style={styles.cardDesc}>{question.description}</p>

        <div style={styles.tagsRow}>
          {question.tags.map((tag) => (
            <span key={tag} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div style={styles.meta}>
          <span>{question.time}</span>
          <span>•</span>
          <span>{question.author}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   RIGHT SIDEBAR
========================= */

function RightSidebar() {
  return (
    <aside style={styles.rightSidebar}>
      <div style={styles.sideCard}>
        <h3 style={styles.sideHeading}>Trending</h3>
        <ul style={styles.sideList}>
          <li>AI in frontend engineering</li>
          <li>React 19 new features</li>
          <li>Scaling Node.js apps</li>
        </ul>
      </div>
    </aside>
  );
}

/* =========================
   STYLES
========================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  topBar: {
    height: 60,
    borderBottom: "1px solid #e6e6e6",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 100,
  },

  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  logo: {
    fontWeight: 700,
    fontSize: 18,
  },

  search: {
    flex: 1,
    maxWidth: 500,
    margin: "0 40px",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #e6e6e6",
  },

  authRow: {
    display: "flex",
    gap: 10,
  },

  textButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid #e6e6e6",
    background: "transparent",
    cursor: "pointer",
  },

  primaryButtonSmall: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    background: "#015BC1",
    color: "#fff",
    cursor: "pointer",
  },

  primaryButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background: "#015BC1",
    color: "#fff",
    cursor: "pointer",
  },

  layout: {
    display: "flex",
  },

  sidebar: {
    borderRight: "1px solid #e6e6e6",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 999,
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 30,
    maxWidth: 900,
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: 700,
  },

  questionList: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  card: {
    display: "flex",
    gap: 20,
    borderBottom: "1px solid #e6e6e6",
    paddingBottom: 20,
  },

  stats: {
    display: "flex",
    fontSize: 13,
    color: "#536471",
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },

  cardDesc: {
    fontSize: 14,
    marginBottom: 10,
    color: "#444",
  },

  tagsRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  tag: {
    background: "#f2f2f2",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
  },

  meta: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
    display: "flex",
    gap: 6,
  },

  rightSidebar: {
    width: 300,
    borderLeft: "1px solid #e6e6e6",
    padding: 20,
    position: "fixed",
    right: 0,
    top: 60,
    height: "calc(100vh - 60px)",
  },

  sideCard: {
    border: "1px solid #e6e6e6",
    borderRadius: 16,
    padding: 16,
  },

  sideHeading: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
  },

  sideList: {
    paddingLeft: 16,
    fontSize: 13,
    color: "#555",
  },

  /* ===== Modal styles added below ===== */

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 300,
  },

  modalContent: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    maxWidth: 700,
    maxHeight: "90vh",
    overflowY: "auto",
    zIndex: 301,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  label: { fontWeight: 600, marginTop: 15, display: "block" },
  input: { width: "100%", padding: 8, marginTop: 5, borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" },
  textarea: {
    width: "100%",
    minHeight: 160,
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: 14,
    lineHeight: "1.4",
  },

  richTextToolbarWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  richTextToolbar: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    alignItems: "center",
  },
  toolbarHint: {
    fontSize: 12,
    color: "#666",
  },
  toolbarButton: {
    padding: "6px 8px",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
    background: "#fff",
    fontSize: 14,
  },

  modalActions: { display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10 },
  cancelButton: { padding: "8px 14px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "#fff" },
  submitButton: { padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "#000", color: "#fff" },

  imagePreviewWrap: { marginTop: 8, display: "flex", gap: 8, alignItems: "center" },
  imagePreview: { maxWidth: 120, maxHeight: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #e6e6e6" },
  removeImageBtn: { padding: "6px 8px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "#fff" },
};

/* =========================
   ICONS
========================= */

const MenuIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

import { Home, HelpCircle, Tag, User } from "lucide-react";

const HomeIcon = () => <Home size={20} strokeWidth={2} />;
const QuestionIcon = () => <HelpCircle size={20} strokeWidth={2} />;
const TagIcon = () => <Tag size={20} strokeWidth={2} />;
const UserIcon = () => <User size={20} strokeWidth={2} />;