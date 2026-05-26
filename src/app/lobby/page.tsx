"use client";
import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CLOUDINARY_CLOUD_NAME = "dpj2oa5k3";
const CLOUDINARY_UPLOAD_PRESET = "chat_images";

export default function LobbyPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null); // ← ADDED

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "lobby_messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        const createdAtDate =
          data.createdAt && (data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt);
        const editedAtDate =
          data.editedAt && (data.editedAt.toDate ? data.editedAt.toDate() : data.editedAt);
        return {
          id: docSnap.id,
          uid: data.uid ?? null,
          displayName: data.displayName ?? data.name ?? "Anonymous",
          text: data.text ?? "",
          imageUrl: data.imageUrl ?? null,
          replyTo: data.replyTo ?? null,
          rawCreatedAt: data.createdAt ?? null,
          createdAtDate,
          editedAtDate,
        };
      });
      setMessages(msgs);
      setTimeout(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 30);
    });
    return () => { unsub(); unsubAuth(); };
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    if (!currentUser) { alert("Please sign in to send messages."); return; }
    try {
      await addDoc(collection(db, "lobby_messages"), {
        text: input.trim(),
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email || "Anonymous",
        createdAt: serverTimestamp(),
        replyTo: replyTo ? replyTo.id : null,
      });
      setInput("");
      setReplyTo(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Check console.");
    }
  }

  function uploadImage(file: File) {
    if (!currentUser) { alert("Please sign in to upload images."); return; }
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => { setUploadProgress(null); alert("Image upload failed (network)."); };
    xhr.onload = async () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const resp = JSON.parse(xhr.responseText);
          await addDoc(collection(db, "lobby_messages"), {
            text: (input && input.trim()) ? input.trim() : "",
            imageUrl: resp.secure_url,
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email || "Anonymous",
            createdAt: serverTimestamp(),
            replyTo: replyTo ? replyTo.id : null,
          });
          setUploadProgress(null); setInput(""); setReplyTo(null);
        } else { setUploadProgress(null); alert("Image upload failed."); }
      } catch (err) { setUploadProgress(null); alert("Image upload succeeded but saving message failed."); }
    };
    xhr.send(formData);
  }

  async function handleDeleteMessage(messageId: string) {
    if (!currentUser) return;
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try { await deleteDoc(doc(db, "lobby_messages", messageId)); }
    catch (err) { alert("Failed to delete message."); }
  }

  function startEditMessage(msg: any) {
    if (!currentUser || msg.uid !== currentUser.uid) return;
    if (!msg.createdAtDate) return alert("Editing is not allowed for this message.");
    const elapsed = Date.now() - new Date(msg.createdAtDate).getTime();
    if (elapsed > 3 * 60 * 1000) return alert("Editing time (3 minutes) has expired.");
    setEditingMessageId(msg.id); setEditText(msg.text ?? ""); setOpenMenuId(null);
  }

  async function saveEditMessage(messageId: string) {
    if (!currentUser || !editingMessageId || editingMessageId !== messageId) return;
    try {
      await updateDoc(doc(db, "lobby_messages", messageId), { text: editText, editedAt: serverTimestamp() });
      setEditingMessageId(null); setEditText("");
    } catch (err) { alert("Failed to save edit."); }
  }

  function cancelEdit() { setEditingMessageId(null); setEditText(""); }

  function toggleMenu(e: React.MouseEvent, msgId: string) {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === msgId ? null : msgId));
  }

  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      const target = ev.target as Element | null;
      if (!target || !target.closest(".so-menu-wrapper")) setOpenMenuId(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const users = [
    { name: "Codfans_09", id: "Cod_23243", flag: "🇺🇸" },
    { name: "balla_posti", id: "Guest_2424", flag: "🇨🇦" },
    { name: "eebo_345", id: "Guest_3122", flag: "🇳🇱" },
    { name: "Tekkentag", id: "Guest_123", flag: "🇵🇰" },
    { name: "GameOfThrones", id: "Guest_123", flag: "🇺🇸" },
  ];

  function getInitials(name: string) {
    return name.slice(0, 2).toUpperCase();
  }

  function getAvatarColor(name: string) {
    const colors = ["#1c00f2", "#0077cc", "#2d9c6e", "#bac81b", "#7c3e9e", "#c94e4e"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  // ← ADDED: modal content
  const modalContent: Record<string, { title: string; body: React.ReactNode }> = {
    guidelines: {
      title: "Room Guidelines",
      body: (
        <ul style={{ paddingLeft: 18, lineHeight: 2, color: "#374151", fontSize: 14 }}>
          <li>Be respectful to all users at all times.</li>
          <li>No spam, flooding, or repeated messages.</li>
          <li>Keep conversations relevant to the lobby topic.</li>
          <li>No sharing of personal or sensitive information.</li>
          <li>No hate speech, harassment, or offensive content.</li>
          <li>Moderators have the final say on all disputes.</li>
        </ul>
      ),
    },
    conduct: {
      title: "Code of Conduct",
      body: (
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>By participating in this lobby, you agree to:</p>
          <ul style={{ paddingLeft: 18, lineHeight: 2 }}>
            <li>Treat everyone with dignity and respect.</li>
            <li>Not engage in discrimination of any kind.</li>
            <li>Report violations instead of retaliating.</li>
            <li>Accept consequences for violating these rules.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Violations may result in removal from the lobby.</p>
        </div>
      ),
    },
    learn: {
      title: "Learn More About Chat",
      body: (
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>This is the <strong>General Lobby</strong> — a real-time chat room where users can:</p>
          <ul style={{ paddingLeft: 18, lineHeight: 2 }}>
            <li>Send text messages instantly.</li>
            <li>Upload and share images and GIFs.</li>
            <li>Reply to specific messages.</li>
            <li>Edit messages within 3 minutes of sending.</li>
            <li>Delete their own messages at any time.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Messages are stored in real-time via Firestore.</p>
        </div>
      ),
    },
  };

  return (
    <div className="so-root">
      {sidebarOpen && <div className="so-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="so-layout">
        {/* MAIN CHAT */}
        <div className="so-main">

          {/* Top bar */}
          <div className="so-topbar">
            <button className="so-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <span /><span /><span />
            </button>
            <div className="so-room-info">
              <span className="so-room-name">General Lobby</span>
              <span className="so-room-desc">SOTSS</span>
            </div>
            <div className="so-topbar-actions">
              <button className="so-btn-ghost">load older messages</button>
              <button className="so-btn-ghost">full transcript</button>
              <button className="so-btn-ghost so-btn-highlight">highlights</button>
            </div>
          </div>

          {/* Messages */}
          <div className="so-messages" ref={messagesRef}>
            {messages.map((msg, idx) => {
              const isMe = currentUser && msg.uid === currentUser.uid;
              const prevMsg = messages[idx - 1];
              const isSameSender = prevMsg && prevMsg.uid === msg.uid;
              const timeLabel = msg.createdAtDate
                ? new Date(msg.createdAtDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";
              const canEdit =
                msg.createdAtDate &&
                Date.now() - new Date(msg.createdAtDate).getTime() <= 3 * 60 * 1000 &&
                currentUser && msg.uid === currentUser.uid;

              return (
                <div
                  key={msg.id}
                  className={`so-msg-row ${isMe ? "so-msg-me" : ""} ${isSameSender ? "so-msg-grouped" : ""}`}
                >
                  {/* Avatar — only show for first in group */}
                  <div className="so-avatar-col">
                    {!isSameSender ? (
                      <div
                        className="so-avatar"
                        style={{ background: getAvatarColor(msg.displayName) }}
                        title={msg.displayName}
                      >
                        {getInitials(msg.displayName)}
                      </div>
                    ) : (
                      <div className="so-avatar-spacer" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="so-msg-content">
                    {!isSameSender && (
                      <div className="so-msg-header">
                        <a className="so-username" href="#">{msg.displayName}</a>
                        <span className="so-timestamp">{timeLabel}</span>
                        {msg.editedAtDate && <span className="so-edited-label">edited</span>}
                      </div>
                    )}

                    {/* Reply preview */}
                    {msg.replyTo && msg.replyPreview && (
                      <div className="so-reply-preview">
                        ↩ <strong>{msg.replyPreview.displayName}</strong>: {String(msg.replyPreview.text).slice(0, 60)}
                      </div>
                    )}

                    {/* Edit mode */}
                    {editingMessageId === msg.id ? (
                      <div className="so-edit-wrap">
                        <textarea
                          className="so-edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          autoFocus
                        />
                        <div className="so-edit-actions">
                          <button className="so-btn-save" onClick={() => saveEditMessage(msg.id)}>save edits</button>
                          <button className="so-btn-cancel" onClick={cancelEdit}>cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="so-msg-body">
                        {msg.text && <span className="so-msg-text">{msg.text}</span>}
                        {isSameSender && timeLabel && (
                          <span className="so-timestamp so-timestamp-inline">{timeLabel}</span>
                        )}
                        {msg.imageUrl && (
                          <div className="so-img-wrap">
                            <img
                              src={msg.imageUrl}
                              alt="attachment"
                              className="so-chat-img"
                              onClick={() => setPreviewUrl(msg.imageUrl)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message actions (hover) */}
                  <div className="so-msg-actions">
                    <button
                      className="so-action-btn"
                      title="Reply"
                      onClick={() => {
                        setReplyTo(msg);
                        const el = document.querySelector(".so-text-input") as HTMLElement;
                        el?.focus();
                      }}
                    >
                      ↩
                    </button>
                    {currentUser && msg.uid === currentUser.uid && (
                      <div className="so-menu-wrapper">
                        <button
                          className="so-action-btn"
                          onClick={(e) => toggleMenu(e, msg.id)}
                          title="More options"
                        >
                          ▾
                        </button>
                        {openMenuId === msg.id && (
                          <div className="so-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="so-dd-item"
                              onClick={() => {
                                setOpenMenuId(null);
                                canEdit ? startEditMessage(msg) : alert("Editing time (3 minutes) has expired.");
                              }}
                            >
                              edit
                            </button>
                            <button
                              className="so-dd-item so-dd-danger"
                              onClick={async () => { setOpenMenuId(null); await handleDeleteMessage(msg.id); }}
                            >
                              delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply banner */}
          {replyTo && (
            <div className="so-reply-bar">
              <span>Replying to <strong>{replyTo.displayName}</strong>: {String(replyTo.text).slice(0, 80)}</span>
              <button className="so-reply-cancel" onClick={() => setReplyTo(null)}>✕</button>
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="so-upload-progress">
              <div className="so-progress-bar" style={{ width: `${uploadProgress}%` }} />
              <span>Uploading… {uploadProgress}%</span>
            </div>
          )}

          {/* Input area */}
          <div className="so-input-area">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }}
            />
            <button
              className="so-attach-btn"
              title="Attach image"
              onClick={() => {
                if (!currentUser) { alert("Please sign in to upload images."); return; }
                fileInputRef.current?.click();
              }}
            >
              📎
            </button>
            <input
              className="so-text-input"
              value={input}
              placeholder={currentUser ? "Message..." : "Sign in to chat"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              disabled={!currentUser}
            />
            <button
              className="so-send-btn"
              onClick={sendMessage}
              disabled={!currentUser || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className={`so-sidebar ${sidebarOpen ? "so-sidebar-open" : ""}`}>
          <button className="so-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>

          {/* Room info box */}
          <div className="so-sidebar-section">
            <div className="so-sidebar-room-title">General Lobby</div>
            <p className="so-sidebar-room-desc">
              Welcome to the lobby. A place to chat with no set topic. Feel free to discuss anything.
            </p>
            {/* ← UPDATED: links now open modals */}
            <div className="so-sidebar-links">
              <a href="#" className="so-sidebar-link" onClick={(e) => { e.preventDefault(); setActiveModal("guidelines"); }}>Room guidelines</a>
              <a href="#" className="so-sidebar-link" onClick={(e) => { e.preventDefault(); setActiveModal("conduct"); }}>Code of Conduct</a>
              <a href="#" className="so-sidebar-link" onClick={(e) => { e.preventDefault(); setActiveModal("learn"); }}>Learn more about Chat</a>
            </div>
            <div className="so-sidebar-tags">
              <span className="so-tag">lobby</span>
              <span className="so-tag">no-codedumps</span>
            </div>
          </div>

          {/* Random select */}
          <div className="so-sidebar-section">
            <div className="so-sidebar-section-title">GAMEPLAY</div>
            <button className="so-random-btn">SELECT A RANDOM FAN</button>
          </div>

          {/* Users */}
          <div className="so-sidebar-section">
            <div className="so-sidebar-section-title">{users.length} USERS</div>
            <div className="so-user-list">
              {users.map((user, i) => (
                <div className="so-user-item" key={i}>
                  <div
                    className="so-user-avatar"
                    style={{ background: getAvatarColor(user.name) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="so-user-details">
                    <span className="so-user-name">{user.name} {user.flag}</span>
                    <span className="so-user-id">{user.id}</span>
                  </div>
                  <button className="so-user-menu-btn" title="Options">⋯</button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Image preview overlay */}
      {previewUrl && (
        <div className="so-preview-overlay" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="preview" className="so-preview-img" />
        </div>
      )}

      {/* ← ADDED: Info Modal */}
      {activeModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 3000,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 8, width: "100%", maxWidth: 480,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)", overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #e4e6e8",
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: 0 }}>
                {modalContent[activeModal].title}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: "none", border: "none", fontSize: 20,
                  cursor: "pointer", color: "#6a737c", lineHeight: 1, padding: 4,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "20px" }}>
              {modalContent[activeModal].body}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #e4e6e8", textAlign: "right" }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: "7px 16px", background: "#f48024", color: "#fff",
                  border: "none", borderRadius: 4, fontSize: 13,
                  fontWeight: 700, cursor: "pointer",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* =====================
           STACK OVERFLOW CHAT THEME
           ===================== */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .so-root {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
          font-size: 13px;
          color: #242729;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #fff;
        }

        .so-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 800;
        }

        /* Layout */
        .so-layout {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        /* ---- MAIN CHAT ---- */
        .so-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #fff;
        }

        /* Top bar */
        .so-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #f8f9f9;
          border-bottom: 1px solid #e4e6e8;
          flex-shrink: 0;
        }

        .so-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .so-hamburger span {
          display: block;
          width: 18px;
          height: 2px;
          background: #6a737c;
          border-radius: 1px;
        }

        .so-room-info {
          flex: 1;
          min-width: 0;
        }

        .so-room-name {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #242729;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .so-room-desc {
          display: block;
          font-size: 11px;
          color: #6a737c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .so-topbar-actions {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .so-btn-ghost {
          background: none;
          border: 1px solid #d6d9dc;
          border-radius: 3px;
          padding: 4px 8px;
          font-size: 11px;
          color: #6a737c;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 80ms, color 80ms;
        }
        .so-btn-ghost:hover { border-color: #9fa6ad; color: #3d4043; }
        .so-btn-highlight { color: #f48024; border-color: #f48024; }
        .so-btn-highlight:hover { background: #fdf3e7; }

        /* Messages */
        .so-messages {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 0;
          background: #fff;
        }

        .so-messages::-webkit-scrollbar { width: 6px; }
        .so-messages::-webkit-scrollbar-thumb { background: #d6d9dc; border-radius: 3px; }

        .so-msg-row {
          display: flex;
          align-items: flex-start;
          padding: 2px 12px;
          gap: 8px;
          position: relative;
        }
        .so-msg-row:hover { background: #f8f9f9; }
        .so-msg-row:hover .so-msg-actions { opacity: 1; }
        .so-msg-grouped { padding-top: 1px; }
        .so-msg-me .so-msg-text { color: #3d4043; }

        /* Avatar */
        .so-avatar-col {
          flex-shrink: 0;
          width: 32px;
        }
        .so-avatar {
          width: 32px;
          height: 32px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
        }
        .so-avatar-spacer {
          width: 32px;
          height: 4px;
        }

        /* Message content */
        .so-msg-content {
          flex: 1;
          min-width: 0;
          padding-top: 1px;
        }

        .so-msg-header {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 2px;
        }

        .so-username {
          font-size: 13px;
          font-weight: 700;
          color: #0077cc;
          text-decoration: none;
          cursor: pointer;
        }
        .so-username:hover { color: #005999; text-decoration: underline; }

        .so-timestamp {
          font-size: 11px;
          color: #9fa6ad;
        }
        .so-timestamp-inline {
          margin-left: 6px;
          opacity: 0;
          transition: opacity 150ms;
        }
        .so-msg-row:hover .so-timestamp-inline { opacity: 1; }

        .so-edited-label {
          font-size: 10px;
          color: #9fa6ad;
          font-style: italic;
        }

        .so-reply-preview {
          font-size: 11px;
          color: #6a737c;
          background: #f0f3f5;
          border-left: 3px solid #d6d9dc;
          padding: 4px 8px;
          border-radius: 0 3px 3px 0;
          margin-bottom: 4px;
          max-width: 480px;
        }

        .so-msg-body {
          display: flex;
          align-items: baseline;
          gap: 4px;
          flex-wrap: wrap;
        }

        .so-msg-text {
          font-size: 13px;
          line-height: 1.5;
          color: #242729;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Image */
        .so-img-wrap { margin-top: 6px; }
        .so-chat-img {
          max-width: 300px;
          max-height: 200px;
          border-radius: 3px;
          border: 1px solid #e4e6e8;
          cursor: zoom-in;
          display: block;
        }

        /* Message actions (hidden until hover) */
        .so-msg-actions {
          display: flex;
          align-items: center;
          gap: 2px;
          opacity: 0;
          transition: opacity 100ms;
          flex-shrink: 0;
          position: relative;
        }

        .so-action-btn {
          background: none;
          border: 1px solid #d6d9dc;
          border-radius: 3px;
          width: 24px;
          height: 22px;
          cursor: pointer;
          color: #6a737c;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 80ms, border-color 80ms;
        }
        .so-action-btn:hover { background: #f0f3f5; border-color: #9fa6ad; color: #3d4043; }

        /* Dropdown */
        .so-menu-wrapper { position: relative; }
        .so-dropdown {
          position: absolute;
          right: 0;
          top: 26px;
          background: #fff;
          border: 1px solid #e4e6e8;
          border-radius: 3px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          z-index: 1000;
          min-width: 100px;
          overflow: hidden;
        }
        .so-dd-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 7px 12px;
          background: none;
          border: none;
          font-size: 12px;
          color: #242729;
          cursor: pointer;
          transition: background 80ms;
        }
        .so-dd-item:hover { background: #f8f9f9; }
        .so-dd-danger { color: #c91e1e; }
        .so-dd-danger:hover { background: #fef2f2; }

        /* Edit */
        .so-edit-wrap { margin-top: 4px; }
        .so-edit-input {
          width: 100%;
          max-width: 480px;
          padding: 6px 8px;
          border: 1px solid #9fa6ad;
          border-radius: 3px;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
          background: #fff;
        }
        .so-edit-input:focus { border-color: #0077cc; box-shadow: 0 0 0 3px rgba(0,119,204,0.15); }
        .so-edit-actions { display: flex; gap: 6px; margin-top: 6px; }
        .so-btn-save {
          padding: 4px 10px;
          border-radius: 3px;
          border: none;
          background: #0077cc;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          transition: background 80ms;
        }
        .so-btn-save:hover { background: #005999; }
        .so-btn-cancel {
          padding: 4px 10px;
          border-radius: 3px;
          border: 1px solid #d6d9dc;
          background: none;
          font-size: 12px;
          color: #6a737c;
          cursor: pointer;
          transition: background 80ms;
        }
        .so-btn-cancel:hover { background: #f0f3f5; }

        /* Reply bar */
        .so-reply-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 6px 12px;
          background: #fdf3e7;
          border-top: 1px solid #f4b77b;
          font-size: 12px;
          color: #6a737c;
          flex-shrink: 0;
        }
        .so-reply-cancel {
          background: none;
          border: none;
          color: #9fa6ad;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          padding: 0 4px;
        }
        .so-reply-cancel:hover { color: #3d4043; }

        /* Upload progress */
        .so-upload-progress {
          padding: 4px 12px;
          background: #f8f9f9;
          border-top: 1px solid #e4e6e8;
          font-size: 11px;
          color: #6a737c;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-shrink: 0;
        }
        .so-progress-bar {
          height: 3px;
          background: #f48024;
          border-radius: 2px;
          transition: width 200ms;
        }

        /* Input area */
        .so-input-area {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-top: 1px solid #e4e6e8;
          background: #fff;
          flex-shrink: 0;
        }

        .so-attach-btn {
          background: none;
          border: 1px solid #d6d9dc;
          border-radius: 3px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6a737c;
          transition: background 80ms, border-color 80ms;
          flex-shrink: 0;
        }
        .so-attach-btn:hover { background: #f0f3f5; border-color: #9fa6ad; }

        .so-text-input {
          flex: 1;
          padding: 7px 10px;
          border: 1px solid #d6d9dc;
          border-radius: 3px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          color: #242729;
          background: #fff;
          transition: border-color 80ms, box-shadow 80ms;
        }
        .so-text-input:focus {
          border-color: #0077cc;
          box-shadow: 0 0 0 3px rgba(0,119,204,0.15);
        }
        .so-text-input:disabled {
          background: #f8f9f9;
          color: #9fa6ad;
        }
        .so-text-input::placeholder { color: #9fa6ad; }

        .so-send-btn {
          padding: 7px 14px;
          border-radius: 3px;
          border: none;
          background: #f48024;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 80ms;
          flex-shrink: 0;
        }
        .so-send-btn:hover:not(:disabled) { background: #da6b0e; }
        .so-send-btn:disabled { background: #f4c090; cursor: default; }

        /* ---- SIDEBAR ---- */
        .so-sidebar {
          width: 280px;
          background: #f8f9f9;
          border-left: 1px solid #e4e6e8;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-shrink: 0;
          position: relative;
        }
        .so-sidebar::-webkit-scrollbar { width: 4px; }
        .so-sidebar::-webkit-scrollbar-thumb { background: #d6d9dc; border-radius: 2px; }

        .so-sidebar-close {
          display: none;
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          color: #6a737c;
          cursor: pointer;
          z-index: 10;
        }

        .so-sidebar-section {
          padding: 14px;
          border-bottom: 1px solid #e4e6e8;
        }

        .so-sidebar-room-title {
          font-size: 15px;
          font-weight: 700;
          color: #0077cc;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .so-sidebar-room-title:hover { color: #005999; text-decoration: underline; }

        .so-sidebar-room-desc {
          font-size: 12px;
          color: #6a737c;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .so-sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }

        .so-sidebar-link {
          font-size: 12px;
          color: #0077cc;
          text-decoration: none;
        }
        .so-sidebar-link:hover { text-decoration: underline; color: #005999; }

        .so-sidebar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
        }

        .so-tag {
          display: inline-block;
          padding: 2px 6px;
          background: #e1ecf4;
          color: #39739d;
          font-size: 11px;
          border-radius: 3px;
          border: 1px solid #b3cee1;
          cursor: default;
        }

        .so-sidebar-section-title {
          font-size: 10px;
          font-weight: 700;
          color: #9fa6ad;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .so-random-btn {
          width: 100%;
          padding: 8px;
          border-radius: 3px;
          border: 1px solid #1f6b3c;
          background: #2e7d32;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: background 80ms;
        }
        .so-random-btn:hover { background: #256428; }

        /* User list */
        .so-user-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .so-user-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 4px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 80ms;
        }
        .so-user-item:hover { background: #eff0f1; }

        .so-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .so-user-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .so-user-name {
          font-size: 12px;
          font-weight: 600;
          color: #0077cc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .so-user-id {
          font-size: 10px;
          color: #9fa6ad;
        }

        .so-user-menu-btn {
          background: none;
          border: none;
          color: #9fa6ad;
          font-size: 16px;
          cursor: pointer;
          padding: 2px;
          line-height: 1;
          border-radius: 3px;
          transition: background 80ms, color 80ms;
          opacity: 0;
          flex-shrink: 0;
        }
        .so-user-item:hover .so-user-menu-btn { opacity: 1; }
        .so-user-menu-btn:hover { background: #d6d9dc; color: #3d4043; }

        /* Image preview overlay */
        .so-preview-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          cursor: zoom-out;
        }
        .so-preview-img {
          max-width: 96%;
          max-height: 90vh;
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        /* Scrollbar */
        .so-sidebar::-webkit-scrollbar { width: 4px; }

        /* Responsive */
        @media (max-width: 900px) {
          .so-sidebar {
            display: none;
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            width: 85%;
            max-width: 320px;
            z-index: 900;
            box-shadow: -8px 0 24px rgba(0,0,0,0.15);
          }
          .so-sidebar-open {
            display: flex !important;
          }
          .so-sidebar-close { display: block; }
          .so-hamburger { display: flex; }
          .so-topbar-actions { display: none; }
        }

        @media (max-width: 480px) {
          .so-msg-row { padding: 2px 8px; }
          .so-input-area { padding: 6px 8px; gap: 4px; }
          .so-text-input { font-size: 14px; padding: 8px; }
        }
      `}</style>
    </div>
  );
}