import CryptoJS from "crypto-js";

const SECRET = "local-client-secret"; // Keep this secret on client-side only

export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, SECRET).toString();
}

export function decryptData(cipher: string) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
