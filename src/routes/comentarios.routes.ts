import express from "express";
import Comment from "../models/scr/Comentarios";

const router = express.Router();

// Crear un comentario
router.post("/", async (req, res) => {
  try {
    const { movieId, userEmail, content } = req.body;
    const comment = await Comment.create({ movieId, userEmail, content });
    res.status(201).json(comment);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error al crear comentario" });
  }
});

// Obtener comentarios de una película
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
});

export default router;
