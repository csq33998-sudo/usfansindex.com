import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("dist");
const port = Number(process.env.PORT || 4321);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
};

function insideRoot(file) {
  return file === root || file.startsWith(root + sep);
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const cleaned = decoded.replace(/^\/+/, "");
  let file = resolve(root, cleaned || "index.html");
  if (!insideRoot(file)) return null;

  try {
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, "index.html");
  } catch {
    file = resolve(root, cleaned, "index.html");
  }

  return insideRoot(file) ? file : null;
}

const server = createServer(async (request, response) => {
  try {
    const file = await resolveFile(request.url || "/");
    if (!file) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const body = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Local preview: http://127.0.0.1:${port}/`);
});
