import { useState, useEffect } from "react";
import axios from "axios";

function Comments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState("Helkin"); // Cambia luego por el usuario logueado

  // 🔹 Cargar comentarios al montar
  useEffect(() => {
    if (movieId) {
      axios
        .get(`http://localhost:5000/comentarios/${movieId}`)
        .then((res) => setComments(res.data))
        .catch((err) => console.error("Error al cargar comentarios", err));
    }
  }, [movieId]);

  // 🔹 Enviar nuevo comentario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/comentarios", {
        movieId,
        user,
        comment: newComment,
      });

      setComments([...comments, res.data]); // Agrega sin recargar
      setNewComment("");
    } catch (err) {
      console.error("Error al enviar comentario", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg mt-8">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
        Comentarios
      </h2>

      <div className="space-y-3 mb-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <p className="font-bold text-green-400">{c.user}</p>
              <p className="text-gray-300">{c.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No hay comentarios aún.</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-gray-700 pt-3"
      >
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Comments;
