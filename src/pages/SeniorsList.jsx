import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function SeniorsList() {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeniors() {
      const colRef = collection(db, "seniors");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeniors(data);
      setLoading(false);
    }
    fetchSeniors();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 40}}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 24 }}>All Seniors</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {seniors.map(senior => (
          <li key={senior.id} style={{ marginBottom: 18, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 18 }}>
            <Link to={`/senior/${slugify(senior.name)}`} style={{ textDecoration: 'none', color: '#1E88E5', fontWeight: 700, fontSize: 20 }}>
              {senior.name}
            </Link>
            <div style={{ color: '#5F6368', fontSize: 15, marginTop: 4 }}>
              {senior.role} at <span style={{ color: '#7C3AED', fontWeight: 600 }}>{senior.company}</span>
            </div>
            <div style={{ color: '#10B981', fontWeight: 600, fontSize: 15 }}>{senior.package}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 