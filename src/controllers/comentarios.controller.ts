import { Request, Response } from "express";
import Comentario from "../models/scr/Comentarios";


// Crear un nuevo comentario
export const crearComentario = async (req: Request, res: Response) => {
  try {
    const { movieId, userId, text } = req.body;

    if (!movieId || !userId || !text) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const nuevoComentario = new Comentario({
      movieId,
      userId,
      text,
      createdAt: new Date(),
    });

    await nuevoComentario.save();
    res.status(201).json({ message: "Comentario creado correctamente", comentario: nuevoComentario });
  } catch (error) {
    console.error("❌ Error al crear comentario:", error);
    res.status(500).json({ message: "Error al crear comentario", error });
  }
};

// Obtener los comentarios de una película
export const obtenerComentariosPorPelicula = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Falta el ID de la película" });
    }

    const comentarios = await Comentario.find({ movieId }).sort({ createdAt: -1 });
    res.status(200).json(comentarios);
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};