"use client";
import { useSession, signIn } from "next-auth/react";
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
    const res = await fetch("/api/vault");
    const data = await res.json();
    setVaultItems(data);
  };

  useEffect(() => {
    if (session) fetchVault();
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <div className="p-4 text-center">
        <p>Please sign in to continue.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Sign In
        </button>
      </div>
    );

  const handleGenerate = (pwd: string) => setNewPwd(pwd);

  const handleAdd = async () => {
    const title = prompt("Title for password?");
    if (!title) return;

    await fetch("/api/vault", {
      method: "POST",
      body: JSON.stringify({ title, username: "", password: encryptData(newPwd) }),
      headers: { "Content-Type": "application/json" },
    });

    setNewPwd("");
    fetchVault();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <PasswordGenerator onGenerate={handleGenerate} />
      {newPwd && (
        <div className="mt-2 flex gap-2">
          <input type="text" value={newPwd} readOnly className="border p-1 flex-1" />
          <button className="bg-blue-600 text-white px-3 rounded" onClick={handleAdd}>
            Save
          </button>
        </div>
      )}
      <VaultList items={vaultItems} refreshVault={fetchVault} />
    </div>
  );
}
