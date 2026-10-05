const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || process.argv[2] || 8000);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain; charset=utf-8",
};

const SKIP_DIRS = new Set([".git", "__pycache__", ".mypy_cache", "node_modules", ".venv"]);

const CACHE = new Map();

function preload(dir, urlBase) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      total += preload(path.join(dir, entry.name), urlBase + "/" + entry.name);
    } else {
      const data = fs.readFileSync(path.join(dir, entry.name));
      const mime = MIME[path.extname(entry.name).toLowerCase()] || "application/octet-stream";
      CACHE.set(urlBase + "/" + entry.name, { data, mime });
      total += data.length;
    }
  }
  return total;
}

function send(res, code, mime, body) {
  res.writeHead(code, { "Content-Type": mime, "Content-Length": body.length });
  res.end(body);
}

const server = http.createServer((req, res) => {
  res.on("error", () => {});
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    return send(res, 400, "text/plain", "bad request");
  }
  const probe = pathname === "/health" || pathname.startsWith("/v1/") || pathname.startsWith("/api/");

  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, "text/plain", "method not allowed");
  }
  const headOnly = req.method === "HEAD";

  if (pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain", "Content-Length": 2 });
    return res.end(headOnly ? undefined : "ok");
  }
  if (probe) {
    const body = '{"error":"static preview server, no API here"}';
    res.writeHead(404, { "Content-Type": "application/json", "Content-Length": body.length });
    return res.end(headOnly ? undefined : body);
  }
  if (pathname === "/") pathname = "/index.html";

  const entry = CACHE.get(pathname);
  if (!entry) {
    console.error(`404 ${pathname}`);
    return send(res, 404, "text/plain", "File not found");
  }
  const { data, mime } = entry;

  let start = 0;
  let end = data.length - 1;
  let ranged = false;
  const rng = req.headers.range;
  if (rng && rng.startsWith("bytes=")) {
    const [a, b] = rng.slice(6).split("-", 2);
    if (a === "") start = Math.max(0, data.length - Number(b));
    else start = Number(a);
    if (b !== "" && b !== undefined) end = Math.min(Number(b), data.length - 1);
    ranged = Number.isInteger(start) && Number.isInteger(end) && start <= end && start < data.length;
  }

  const headers = {
    "Content-Type": mime,
    "Content-Length": ranged ? end - start + 1 : data.length,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
  };
  if (ranged) headers["Content-Range"] = `bytes ${start}-${end}/${data.length}`;
  res.writeHead(ranged ? 206 : 200, headers);
  if (headOnly) return res.end();
  res.end(ranged ? data.subarray(start, end + 1) : data);
});

server.on("clientError", () => {});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use — is another server still running?`);
    process.exit(1);
  }
  throw err;
});

const total = preload(ROOT, "");
console.log(`Ready: ${CACHE.size} files, ${(total / 1024 / 1024).toFixed(1)} MB in RAM → http://127.0.0.1:${PORT}`);
server.listen(PORT, "127.0.0.1");
