"use client";
import { useState } from "react";
import { encryptData, decryptData } from "@/lib/crypto";

type VaultItem = {
  _id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
};

type Props = {
  items: VaultItem[];
  refreshVault: () => void;
};

export default function VaultList({ items, refreshVault }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (pwd: string, id: string) => {
    navigator.clipboard.writeText(decryptData(pwd));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 15000);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/vault/${id}`, { method: "DELETE" });
    refreshVault(); // refresh after delete
  };

  const handleEdit = async (id: string) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const newTitle = prompt("Title", item.title);
    if (!newTitle) return;

    const updatedItem = { ...item, title: newTitle, password: encryptData(decryptData(item.password)) };

    await fetch(`/api/vault/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
      headers: { "Content-Type": "application/json" },
    });

    refreshVault(); // refresh after edit
  };

  return (
    <div className="p-4">
      {items.map((item) => (
        <div key={item._id} className="p-2 border-b flex justify-between items-center">
          <div>
            <div className="font-bold">{item.title}</div>
            <div className="text-sm">{item.username}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(item.password, item._id)}
              className="px-2 py-1 bg-green-600 text-white rounded"
            >
              {copiedId === item._id ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => handleEdit(item._id)}
              className="px-2 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
