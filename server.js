const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // frontend serve

// ================== MongoDB Connection ==================
mongoose.connect("mongodb://127.0.0.1:27017/bookdb")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================== Schema ==================
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  stock: Number
});

const Book = mongoose.model("Book", bookSchema);

// ================== API ROUTES ==================

// 1️⃣ GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ GET single book
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ ADD new book
app.post("/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4️⃣ UPDATE book
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5️⃣ DELETE book
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Book Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== SERVER ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});