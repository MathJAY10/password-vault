"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import PasswordGenerator from "./components/PasswordGenerator";
import VaultList from "./components/VaultList";
import { encryptData } from "@/lib/crypto";

type VaultItem = {
  _id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [newPwd, setNewPwd] = useState("");
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);

  const fetchVault = async () => {
    try {
      const res = await fetch("/api/vault");
      if (!res.ok) throw new Error("Failed to fetch vault items");
      const data = await res.json();
      setVaultItems(data);
    } catch (err) {
      console.error("Error fetching vault:", err);
    }
  };

  useEffect(() => {
    if (session) fetchVault();
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;

  if (!session)
    return (
      <div className="p-4 text-center">
        <p className="text-lg mb-2">Please sign in to continue.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </div>
    );

  const handleGenerate = (pwd: string) => setNewPwd(pwd);

  const handleAdd = async () => {
    const title = prompt("Title for password?");
    if (!title || !newPwd) return;

    await fetch("/api/vault", {
      method: "POST",
      body: JSON.stringify({
        title,
        username: "",
        password: encryptData(newPwd),
      }),
      headers: { "Content-Type": "application/json" },
    });

    setNewPwd("");
    fetchVault();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* --- Header with Logout --- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🔐 Password Vault</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* --- Password Generator --- */}
      <PasswordGenerator onGenerate={handleGenerate} />

      {/* --- Show Generated Password --- */}
      {newPwd && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newPwd}
            readOnly
            className="border p-1 flex-1 rounded"
          />
          <button
            className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 transition"
            onClick={handleAdd}
          >
            Save
          </button>
        </div>
      )}

      {/* --- Vault List --- */}
      <VaultList items={vaultItems} refreshVault={fetchVault} />
    </div>
  );
}
