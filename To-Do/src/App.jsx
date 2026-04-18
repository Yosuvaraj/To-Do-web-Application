import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────────────────────
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [items, setItems] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const [loading, setLoading] = useState(true);
  const [addingList, setAddingList] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch lists on mount ──
  useEffect(() => {
    fetchLists();
  }, []);

  // ── Fetch items when active list changes ──
  useEffect(() => {
    if (activeListId) fetchItems(activeListId);
    else setItems([]);
  }, [activeListId]);

  async function fetchLists() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) { setError(error.message); }
    else {
      setLists(data || []);
      if (data?.length > 0 && !activeListId) setActiveListId(data[0].id);
    }
    setLoading(false);
  }

  async function fetchItems(listId) {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: true });
    if (!error) setItems(data || []);
  }

  async function addList() {
    const name = newListName.trim();
    if (!name) return;
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name }])
      .select()
      .single();
    if (!error && data) {
      setLists(prev => [...prev, data]);
      setActiveListId(data.id);
      setNewListName("");
      setAddingList(false);
    }
  }

  async function deleteList(id) {
    await supabase.from("items").delete().eq("list_id", id);
    await supabase.from("lists").delete().eq("id", id);
    setLists(prev => prev.filter(l => l.id !== id));
    if (activeListId === id) {
      const remaining = lists.filter(l => l.id !== id);
      setActiveListId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  async function addItem() {
    const text = newItemText.trim();
    if (!text || !activeListId) return;
    const { data, error } = await supabase
      .from("items")
      .insert([{ text, list_id: activeListId, completed: false }])
      .select()
      .single();
    if (!error && data) {
      setItems(prev => [...prev, data]);
      setNewItemText("");
    }
  }

  async function toggleItem(item) {
    const { data } = await supabase
      .from("items")
      .update({ completed: !item.completed })
      .eq("id", item.id)
      .select()
      .single();
    if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
  }

  async function deleteItem(id) {
    await supabase.from("items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const filteredItems = items.filter(i =>
    filter === "all" ? true : filter === "completed" ? i.completed : !i.completed
  );
  const completedCount = items.filter(i => i.completed).length;
  const pendingCount = items.filter(i => !i.completed).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const activeList = lists.find(l => l.id === activeListId);

  return (
    <div className="app">
      {/* ── Background layers ── */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="layout">
        {/* ════ SIDEBAR ════ */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="logo-mark">✦</span>
            <span className="logo-text">Taskr</span>
          </div>

          <div className="sidebar-section-label">MY LISTS</div>

          <nav className="list-nav">
            {lists.map(list => (
              <button
                key={list.id}
                className={`list-btn ${list.id === activeListId ? "active" : ""}`}
                onClick={() => setActiveListId(list.id)}
              >
                <ListIcon />
                <span className="list-btn-name">{list.name}</span>
                <button
                  className="list-delete-btn"
                  onClick={e => { e.stopPropagation(); deleteList(list.id); }}
                  title="Delete list"
                >
                  <TrashIcon />
                </button>
              </button>
            ))}
          </nav>

          {addingList ? (
            <div className="new-list-form">
              <input
                className="new-list-input"
                placeholder="List name…"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addList(); if (e.key === "Escape") setAddingList(false); }}
                autoFocus
              />
              <div className="new-list-actions">
                <button className="btn-confirm" onClick={addList}>Add</button>
                <button className="btn-cancel" onClick={() => setAddingList(false)}>✕</button>
              </div>
            </div>
          ) : (
            <button className="add-list-btn" onClick={() => setAddingList(true)}>
              <PlusIcon /> New List
            </button>
          )}

          <div className="sidebar-footer">
            {error && <p className="error-note">⚠ {error}</p>}
            <p className="sidebar-hint">Powered by Supabase</p>
          </div>
        </aside>

        {/* ════ MAIN PANEL ════ */}
        <main className="main-panel">
          {!activeList ? (
            <div className="empty-state">
              <span className="empty-icon">✦</span>
              <h2>No list selected</h2>
              <p>Create a new list from the sidebar to get started.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="panel-header">
                <div>
                  <h1 className="panel-title">{activeList.name}</h1>
                  <p className="panel-subtitle">
                    <span className="stat pending">{pendingCount} pending</span>
                    <span className="dot">·</span>
                    <span className="stat done">{completedCount} done</span>
                  </p>
                </div>
                {/* Progress ring */}
                <div className="progress-wrap">
                  <svg className="progress-ring" width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"/>
                    <circle
                      cx="28" cy="28" r="22"
                      fill="none" stroke="#a78bfa" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.5s ease" }}
                    />
                  </svg>
                  <span className="progress-pct">{progress}%</span>
                </div>
              </div>

              {/* Add item */}
              <div className="add-item-row">
                <input
                  className="add-item-input"
                  placeholder="Add a new task…"
                  value={newItemText}
                  onChange={e => setNewItemText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addItem(); }}
                />
                <button className="add-item-btn" onClick={addItem}>
                  <PlusIcon /> Add
                </button>
              </div>

              {/* Filter tabs */}
              <div className="filter-tabs">
                {["all","pending","completed"].map(f => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    <span className="filter-count">
                      {f === "all" ? items.length : f === "completed" ? completedCount : pendingCount}
                    </span>
                  </button>
                ))}
              </div>

              {/* Items list */}
              <ul className="items-list">
                {filteredItems.length === 0 && (
                  <li className="items-empty">
                    {filter === "completed" ? "Nothing completed yet." : filter === "pending" ? "All done! 🎉" : "No tasks yet. Add one above."}
                  </li>
                )}
                {filteredItems.map(item => (
                  <li key={item.id} className={`item-row ${item.completed ? "item-done" : ""}`}>
                    <button
                      className={`item-check ${item.completed ? "checked" : ""}`}
                      onClick={() => toggleItem(item)}
                      aria-label="Toggle complete"
                    >
                      {item.completed && <CheckIcon />}
                    </button>
                    <span className="item-text">{item.text}</span>
                    <button
                      className="item-delete"
                      onClick={() => deleteItem(item.id)}
                      aria-label="Delete task"
                    >
                      <TrashIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
