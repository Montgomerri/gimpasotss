"use client";

import React, { useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* =========================
   FIREBASE SETUP
========================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent duplicate Firebase app initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/* =========================
   ADMIN DASHBOARD
========================= */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "questions">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch users and questions from Firebase */
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Fetch questions
      const questionsSnapshot = await getDocs(collection(db, "questions"));
      const questionsData = questionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Map user names to questions
      const formattedQuestions = questionsData.map((q: any) => {
        const user = usersData.find((u) => u.id === q.user_id);
        return {
          ...q,
          user_name: user?.full_name ?? "Unknown",
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* Promote user to admin */
  const promoteToAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to admin?")) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { is_admin: true });
      alert("User promoted to admin!");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_admin: true } : u))
      );
    } catch (err) {
      console.error("Promote error:", err);
    }
  };

  /* Delete user */
  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Admin Panel</h1>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab("users")}
          style={{ ...styles.tab, ...(activeTab === "users" ? styles.activeTab : {}) }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          style={{ ...styles.tab, ...(activeTab === "questions" ? styles.activeTab : {}) }}
        >
          Questions
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div style={styles.cardContainer}>
          {users.map((user) => (
            <div key={user.id} style={styles.card}>
              <div>
                <h3 style={styles.cardTitle}>{user.full_name}</h3>
                <p style={styles.cardSubtitle}>{user.email}</p>
                <p style={styles.role}>{user.is_admin ? "Admin" : "User"}</p>
              </div>
              <div style={styles.cardActions}>
                {!user.is_admin && (
                  <button style={styles.promoteBtn} onClick={() => promoteToAdmin(user.id)}>
                    Promote to Admin
                  </button>
                )}
                <button style={styles.deleteBtn} onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div style={styles.cardContainer}>
          {questions.map((q) => (
            <div key={q.id} style={styles.card}>
              <div>
                <h3 style={styles.cardTitle}>{q.title}</h3>
                <p style={styles.cardSubtitle}>By: {q.user_name}</p>
                <p>{q.description}</p>
                <p style={styles.timestamp}>
                  {q.created_at?.seconds
                    ? new Date(q.created_at.seconds * 1000).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/* =========================
   STYLES
========================= */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 40,
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f5f5f5",
  },
  heading: { fontSize: "2.5rem", fontWeight: 700, marginBottom: 30 },
  loading: { padding: 40, fontSize: 18 },

  tabContainer: { display: "flex", gap: 15, marginBottom: 30 },
  tab: {
    padding: "10px 20px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#e0e0e0",
    color: "#000",
    border: "none",
  },
  activeTab: {
    backgroundColor: "#0070f3",
    color: "#fff",
  },

  cardContainer: { display: "flex", flexDirection: "column", gap: 20 },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 600, marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: "#666", marginBottom: 6 },
  role: { fontSize: 12, color: "#0070f3", fontWeight: 600 },

  cardActions: { display: "flex", gap: 10 },
  promoteBtn: {
    padding: "6px 14px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 14px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  timestamp: { fontSize: 12, color: "#999", marginTop: 10 },
};