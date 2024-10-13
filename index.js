import http from "http";
let inMemoryDatabase = {};
let idCounter = 1;

// Helper function to handle body parsing
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Create the server
const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  // Route: Create new item (POST /items)
  if (url === "/api/users" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(Object.values(inMemoryDatabase)));
  } else if (url === "/items" && method === "POST") {
    try {
      const { name, description } = await parseRequestBody(req);
      const id = idCounter++;
      inMemoryDatabase[id] = { id, name, description };
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(inMemoryDatabase[id]));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON body" }));
    }

    // Route: Get all items (GET /items)
  } else if (url === "/items" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(Object.values(inMemoryDatabase)));

    // Route: Get item by ID (GET /items/:id)
  } else if (url.startsWith("/items/") && method === "GET") {
    const id = url.split("/")[2];
    const item = inMemoryDatabase[id];
    if (item) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Item not found" }));
    }

    // Route: Update item (PUT /items/:id)
  } else if (url.startsWith("/items/") && method === "PUT") {
    const id = url.split("/")[2];
    if (inMemoryDatabase[id]) {
      try {
        const { name, description } = await parseRequestBody(req);
        inMemoryDatabase[id] = { id: parseInt(id), name, description };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(inMemoryDatabase[id]));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON body" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Item not found" }));
    }

    // Route: Delete item (DELETE /items/:id)
  } else if (url.startsWith("/items/") && method === "DELETE") {
    const id = url.split("/")[2];
    if (inMemoryDatabase[id]) {
      delete inMemoryDatabase[id];
      res.writeHead(204); // No content on successful deletion
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Item not found" }));
    }

    // Default route for 404
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

// Listen on port 3000
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
