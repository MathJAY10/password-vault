"use client";
import { useState } from "react";

export default function PasswordGenerator({ onGenerate }: { onGenerate: (pwd: string) => void }) {
  const [length, setLength] = useState(12);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  function generate() {
    let chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    if (numbers) chars += "23456789";
    if (symbols) chars += "!@#$%^&*()_+[]{}";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    onGenerate(pwd);
  }

  return (
    <div className="p-4 border rounded">
      <label>Password Length: {length}</label>
      <input type="range" min="8" max="32" value={length} onChange={e => setLength(+e.target.value)} />
      <div>
        <label><input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} /> Numbers</label>
        <label><input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} /> Symbols</label>
      </div>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={generate}>
        Generate
      </button>
    </div>
  );
}
