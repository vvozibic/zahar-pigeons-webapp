const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../build")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Привет от сервера!" });
});

// Для SPA: отдаём index.html на все не-API маршруты
app.get("{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
