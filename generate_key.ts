import { crypto } from "https://deno.land/std@0.140.0/crypto/mod.ts";

const generateKey = async () => {
  try {
    // 32バイトのHMACキーを生成
    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"]
    );

    // キーをエクスポート
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const keyUint8Array = new Uint8Array(exportedKey);

    // キーをファイルに保存
    await Deno.writeFile("secret.key", keyUint8Array);
    console.log("Secret key generated and saved to 'secret.key'.");
  } catch (error) {
    console.error("Error generating or saving key:", error);
  }
};

await generateKey();

