// src/components/AdminDashboard.jsx
import React, { useMemo, useState } from "react";

function AdminDashboard({ foodItems, setFoodItems }) {
  const [query, setQuery] = useState("");
  const [edits, setEdits] = useState({}); // { [id]: { stock?: number, price?: number } }

  const lowStockThreshold = 10;

  const stats = useMemo(() => {
    const totalItems = foodItems?.length || 0;
    const totalStock = (foodItems || []).reduce((sum, i) => sum + (Number(i.stock) || 0), 0);
    const lowStockCount = (foodItems || []).filter(i => (Number(i.stock) || 0) <= lowStockThreshold).length;
    return { totalItems, totalStock, lowStockCount };
  }, [foodItems]);

  const filtered = useMemo(() => {
    if (!query?.trim()) return foodItems || [];
    const q = query.toLowerCase();
    return (foodItems || []).filter(i =>
      String(i.name).toLowerCase().includes(q) ||
      String(i.category).toLowerCase().includes(q)
    );
  }, [foodItems, query]);

  const handleChange = (id, field, value) => {
    setEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const applyEdit = (id) => {
    const edit = edits[id];
    if (!edit) return;
    setFoodItems((prev) => (prev || []).map(item => {
      if (item.id !== id) return item;
      const next = { ...item };
      if (edit.stock !== undefined && edit.stock !== null && edit.stock !== "") {
        const parsed = Number(edit.stock);
        next.stock = Number.isFinite(parsed) && parsed >= 0 ? parsed : item.stock;
      }
      if (edit.price !== undefined && edit.price !== null && edit.price !== "") {
        const parsed = Number(edit.price);
        next.price = Number.isFinite(parsed) && parsed >= 0 ? parsed : item.price;
      }
      return next;
    }));
    setEdits(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const adjustStock = (id, delta) => {
    setFoodItems((prev) => (prev || []).map(item => {
      if (item.id !== id) return item;
      const nextStock = Math.max(0, (Number(item.stock) || 0) + delta);
      return { ...item, stock: nextStock };
    }));
  };

  const styles = {
    page: { padding: "20px", background: "#ffffff", minHeight: "100vh" },
    title: { color: "#0f172a", margin: 0, fontSize: 28, fontWeight: 800 },
    subtitle: { color: "#334155", marginTop: 8, marginBottom: 20 },
    cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 16 },
    card: { background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16, color: "#fff" },
    cardLabel: { color: "#9ca3af", fontSize: 12, letterSpacing: 0.5 },
    cardValue: { fontSize: 22, fontWeight: 800, marginTop: 6 },
    toolbar: { display: "flex", gap: 12, alignItems: "center", marginTop: 20, marginBottom: 12 },
    search: { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0b1220", color: "#fff", outline: "none" },
    gridWrap: { overflowX: "auto", borderRadius: 12, border: "1px solid #1f2937" },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, color: "#e5e7eb", background: "#0b1220" },
    th: { textAlign: "left", padding: 12, background: "#111827", color: "#93c5fd", position: "sticky", top: 0 },
    td: { padding: 12, borderTop: "1px solid #1f2937" },
    badgeLow: { padding: "4px 10px", background: "#ef444433", color: "#fecaca", borderRadius: 999 },
    badgeOk: { padding: "4px 10px", background: "#10b98133", color: "#bbf7d0", borderRadius: 999 },
    img: { width: 56, height: 40, objectFit: "cover", borderRadius: 8, border: "1px solid #1f2937" },
    input: { width: 90, padding: 8, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", outline: "none" },
    btn: { padding: "8px 12px", border: "1px solid #334155", borderRadius: 8, background: "#0f172a", color: "#93c5fd", cursor: "pointer" },
    btnPrimary: { padding: "8px 12px", border: "none", borderRadius: 8, background: "#2563eb", color: "#fff", cursor: "pointer" },
    btnIcon: { padding: "6px 10px", border: "1px solid #334155", borderRadius: 8, background: "#0f172a", color: "#93c5fd", cursor: "pointer" },
    name: { fontWeight: 700, color: "#fff" },
    cat: { color: "#9ca3af", fontSize: 12, marginTop: 4 }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>Manage inventory, prices and monitor low stock items.</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Items</div>
          <div style={styles.cardValue}>{stats.totalItems}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Stock</div>
          <div style={styles.cardValue}>{stats.totalStock}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Low Stock (≤ {lowStockThreshold})</div>
          <div style={styles.cardValue}>{stats.lowStockCount}</div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          placeholder="Search by name or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.search}
        />
      </div>

      <div style={styles.gridWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price (₹)</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filtered || []).map(item => {
              const currentEdit = edits[item.id] || {};
              const stockValue = currentEdit.stock !== undefined ? currentEdit.stock : item.stock;
              const priceValue = currentEdit.price !== undefined ? currentEdit.price : item.price;
              const low = (Number(stockValue) || 0) <= lowStockThreshold;
              return (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={item.image} alt={item.name} style={styles.img} />
                      <div>
                        <div style={styles.name}>{item.name}</div>
                        <div style={styles.cat}>ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      min="0"
                      value={priceValue}
                      onChange={(e) => handleChange(item.id, 'price', e.target.value)}
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => adjustStock(item.id, -1)} style={styles.btnIcon}>-</button>
                      <input
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={(e) => handleChange(item.id, 'stock', e.target.value)}
                        style={styles.input}
                      />
                      <button onClick={() => adjustStock(item.id, +1)} style={styles.btnIcon}>+</button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={low ? styles.badgeLow : styles.badgeOk}>{low ? "Low" : "OK"}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => applyEdit(item.id)} style={styles.btnPrimary}>Save</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Keep existing section (not removed) */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ color: "#93c5fd" }}>Manage Food Items</h2>
        <ul>
          {foodItems.map((item) => (
            <li key={item.id} style={{ color: "#e5e7eb" }}>
              {item.name} - ₹{item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
