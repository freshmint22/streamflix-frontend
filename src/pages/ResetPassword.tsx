import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../services/api";

/**
 * Page that handles the password reset flow triggered from the email link.
 */
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setMessage("This reset link is invalid or has expired.");
      return;
    }
    if (!password) {
      setMessage("Please enter a new password.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/password/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Password reset failed.");
      }
      setMessage("Password updated successfully. Redirecting to login…");
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Password reset failed.";
      console.error("Reset password request failed", error);
      setMessage(description);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Reset your password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ padding: "8px", margin: "10px", width: "250px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }} disabled={submitting}>
          {submitting ? "Saving…" : "Change password"}
        </button>
      </form>
      {message && (
        <p aria-live="assertive" role="status">
          {message}
        </p>
      )}
    </div>
  );
}