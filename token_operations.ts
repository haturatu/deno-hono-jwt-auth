import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { crypto } from "https://deno.land/std@0.140.0/crypto/mod.ts";

// シークレットキーをファイルから読み込む
const loadKey = async () => {
  try {
    const keyData = await Deno.readFile("secret.key");
    return await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"]
    );
  } catch (error) {
    console.error("Error loading key:", error);
  }
};

// JWTを生成する
const createToken = async (key: CryptoKey) => {
  try {
    const jwt = await create(
      { alg: "HS512", typ: "JWT" }, // ヘッダー
      { foo: "bar" }, // ペイロード
      key // CryptoKey
    );
    console.log("Generated JWT:", jwt);
    return jwt;
  } catch (error) {
    console.error("Error creating token:", error);
  }
};

// JWTを検証する
const verifyToken = async (token: string, key: CryptoKey) => {
  try {
    const payload = await verify(token, key);
    console.log("Payload:", payload);
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};

const run = async () => {
  try {
    const key = await loadKey();
    if (!key) {
      console.error("Failed to load key.");
      return;
    }

    const token = await createToken(key);
    if (token) {
      await verifyToken(token, key);
    }
  } catch (error) {
    console.error("Error during token operations:", error);
  }
};

await run();

