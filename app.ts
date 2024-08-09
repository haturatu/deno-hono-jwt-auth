import { Hono } from "https://deno.land/x/hono/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { crypto } from "https://deno.land/std@0.140.0/crypto/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const app = new Hono();

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
    throw error;
  }
};

// ユーザーのログイン処理
app.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    // ユーザー認証のロジック (ここでは仮の認証を使用)
    if (username === "usesr" && password === "password") {
      const key = await loadKey();

      // JWTを生成
      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        { username: username }, 
        key
      );

      return c.json({ message: "Login successful", token: jwt });
    } else {
      return c.json({ message: "Invalid username or password" }, 401);
    }
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "Internal Server Error", error: error.message }, 500);
  }
});

// JWT検証
app.use("*", async (c, next) => {
  if (c.req.method === "POST" && c.req.url.includes("/login")) {
    await next();
    return;
  }

  try {
    const authHeader = c.req.headers.get("Authorization");
    if (!authHeader) {
      return c.json({ message: "Authorization header missing" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const key = await loadKey();
    const payload = await verify(token, key);

    c.req.state = { payload };
    await next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return c.json({ message: "Unauthorized", error: error.message }, 401);
  }
});

app.get("/", (c) => {
  return c.json({ message: "Hello, world!" });
});

// Honoサーバーの起動
const port = 8787;
console.log(`Server running on http://localhost:${port}`);
await serve(app.fetch, { port });

