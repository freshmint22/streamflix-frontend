import { useRef, useState, useEffect } from "react";
import { API_BASE } from "../services/api";

/**
 * Player component
 * Props: videoUrl (src), movieId, onClose
 * Calls backend playback endpoints to persist play/pause/stop state.
 */
export default function Player({ videoUrl, movieId, onClose }: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setPosition(v.currentTime || 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  async function postPlayback(path: string, pos = 0) {
    try {
      await fetch(`${API_BASE}/api/playback/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}` },
        body: JSON.stringify({ movieId, position: pos }),
      });
    } catch (e) {
      console.error("Playback save error", e);
    }
  }

  async function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    await postPlayback("start", v.currentTime || 0);
    v.play();
    setPlaying(true);
  }

  async function handlePause() {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
    await postPlayback("pause", v.currentTime || 0);
  }

  async function handleStop() {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
    await postPlayback("stop", 0);
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Video player" style={{ maxWidth: 960, margin: "10px auto", background: "var(--panel-light)", padding: 12, borderRadius: 8 }}>
      <video ref={videoRef} src={videoUrl} controls style={{ width: "100%" }} aria-label="Video content" />

      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
        <button onClick={handlePlay} aria-label="Play" style={{ padding: 8 }}>Play</button>
        <button onClick={handlePause} aria-label="Pause" style={{ padding: 8 }}>Pause</button>
        <button onClick={handleStop} aria-label="Stop" style={{ padding: 8 }}>Stop</button>
        <div style={{ marginLeft: 12 }} aria-live="polite">Position: {Math.floor(position)}s</div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={onClose} aria-label="Close player">Close</button>
        </div>
      </div>
    </div>
  );
}
