# deno-hono-jwt-auth

## Usage
1. Generate `secret.key`.
```
deno run -A generate_key.ts
```

2. Start server
```
deno run -A app.ts
```

3. Test login
```
curl -X POST http://localhost:8787/login \
-H "Content-Type: application/json" \
-d '{"username":"usesr","password":"password"}'
```
