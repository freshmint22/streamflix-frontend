import { useState, useEffect, type FormEvent } from "react";
import commentsSvc, { type CommentItem } from "../services/comments";
import styles from "./Comments.module.scss";

type CommentsProps = {
  movieId: string;
};

/**
 * Renders the comment feed for a movie and lets authenticated users post new feedback.
 */
export default function Comments({ movieId }: CommentsProps) {
  const [items, setItems] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName =
    localStorage.getItem("sf_username") ||
    localStorage.getItem("sf_email") ||
    "StreamFlix fan";

  useEffect(() => {
    let active = true;
    if (!movieId) {
      setItems([]);
      setLoadingList(false);
      return;
    }

    (async () => {
      try {
        setLoadingList(true);
        setError(null);
        const data = await commentsSvc.listComments(movieId);
        if (active) setItems(data);
      } catch (err: unknown) {
        if (active) {
          const message = err instanceof Error ? err.message : "Unable to load comments.";
          setError(message);
        }
      } finally {
        if (active) setLoadingList(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [movieId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      setError(null);
      const saved = await commentsSvc.createComment(movieId, trimmed);
      setItems((previous) => [saved, ...previous]);
      setNewComment("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to post your comment.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isAuthenticated = Boolean(localStorage.getItem("sf_token"));

  return (
    <div className={styles.commentsWrapper}>
      <h2 className={styles.commentsHeader}>Comments</h2>

      {error && (
        <p className={styles.errorMessage} role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <div className={styles.commentList}>
        {loadingList ? (
          <p className={styles.emptyState}>Loading comments…</p>
        ) : items.length > 0 ? (
          items.map((comment) => (
            <div key={comment._id} className={styles.commentCard}>
              <p className={styles.commentAuthor}>
                {comment.userEmail?.split("@")[0] || "StreamFlix user"}
              </p>
              <p className={styles.commentBody}>{comment.content}</p>
              <span className={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>Be the first to leave a comment.</p>
        )}
      </div>

      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <input
          className={styles.commentInput}
          type="text"
          placeholder={isAuthenticated ? "Share your thoughts…" : "Sign in to post"}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          disabled={!isAuthenticated || submitting}
          aria-label="Write a new comment"
        />
        <button className={styles.submitButton} type="submit" disabled={!isAuthenticated || submitting}>
          {submitting ? "Posting…" : "Post"}
        </button>
      </form>

      <p className={styles.commentMeta}>
        Commenting as <strong>{displayName}</strong>
      </p>
    </div>
  );
}
