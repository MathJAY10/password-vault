Features:

Generate strong passwords with adjustable length, numbers, and symbols (look-alikes excluded).

Sign up / log in with email and password (NextAuth + MongoDB).

Vault items: title, username, password, URL, notes.

Client-side encryption ensures passwords are never stored in plaintext.

View, search, edit, delete vault items.

Copy to clipboard with auto-clear after 15 seconds.

Minimal, fast, responsive UI using Next.js + Tailwind CSS.

Tech Stack:

Front-end: Next.js 13, TypeScript, Tailwind CSS

Back-end: Next.js API routes (Node.js), MongoDB (via mongodb driver)

Authentication: NextAuth.js (Credentials Provider)

Encryption: CryptoJS (AES, client-side)

Crypto Choice:

We used AES encryption via CryptoJS on the client-side because:

It’s lightweight, fast, and widely used.

Ensures the server never sees plaintext passwords.

Easy integration with React/Next.js for encrypting/decrypting vault items.

# password-vault
