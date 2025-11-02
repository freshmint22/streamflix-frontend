import { useRef, useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { API_BASE } from "../services/api";

type PlayerProps = {
  videoUrl: string;
  movieId: string;
  onClose: () => void;
};

/**
 * Player component renders an overlayed modal video player and persists playback state.
 */
export default function Player({ videoUrl, movieId, onClose }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPositionRef = useRef(0);
  const [subtitles, setSubtitles] = useState<{ es: string | null; en: string | null }>({ es: null, en: null });
  const [language, setLanguage] = useState<'es' | 'en' | 'none'>('none'); // default no subtitles

  // Bloquea el scroll del body cuando se abre el player
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Reinicia el video cuando cambia la URL
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    lastPositionRef.current = 0;
    try {
      v.load();
    } catch (e) {
      console.warn("Unable to reload video element", e);
    }
  }, [videoUrl]);

  // Guarda posición del video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      lastPositionRef.current = v.currentTime || 0;
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  // Cierra con tecla ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Notifica al backend progreso de reproducción
  async function postPlayback(path: string, pos = 0) {
    try {
      await fetch(`${API_BASE}/playback/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
        },
        body: JSON.stringify({ movieId, position: pos }),
      });
    } catch (e) {
      console.error("Playback save error", e);
    }
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handlePlay = () => postPlayback("start", v.currentTime || 0);
    const handlePause = () => postPlayback("pause", v.currentTime || 0);
    const handleEnded = () => {
      lastPositionRef.current = 0;
      postPlayback("stop", 0);
    };
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnded);
    return () => {
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnded);
    };
  }, []);

  async function handleClose() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      const currentPos = v.currentTime || lastPositionRef.current || 0;
      await postPlayback("stop", Math.floor(currentPos));
      v.currentTime = 0;
      lastPositionRef.current = 0;
    }
    onClose();
  }

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      void handleClose();
    }
  }

  const handleSubtitleToggle = (lang: 'es' | 'en' | 'none') => {
    setLanguage(lang);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      style={overlayStyles}
      onClick={handleOverlayClick}
    >
      <div style={containerStyles} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          aria-label="Cerrar reproductor"
          style={closeButton}
          type="button"
        >
          ✕
        </button>

        {videoUrl ? (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            style={videoStyles}
            aria-label="Video content"
          >
            {language !== 'none' && subtitles[language] && (
              <track kind="subtitles" srcLang={language} label={language === 'es' ? "Español" : "English"} src={subtitles[language]} default />
            )}
          </video>
        ) : (
          <div style={emptyStyles}>
            <p>No encontramos un trailer disponible para esta película.</p>
          </div>
        )}
        <div style={subtitleControls}>
          <button onClick={() => handleSubtitleToggle('none')} disabled={!subtitles.es && !subtitles.en}>Sin Subtítulos</button>
          <button onClick={() => handleSubtitleToggle('es')} disabled={!subtitles.es}>Subtítulos en Español</button>
          <button onClick={() => handleSubtitleToggle('en')} disabled={!subtitles.en}>Subtítulos en Inglés</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyles: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(12px, 4vw, 40px)",
  zIndex: 9999,
  animation: "fadeIn 0.25s ease-in-out",
};

const containerStyles: CSSProperties = {
  position: "relative",
  width: "min(960px, 90vw)",
  maxHeight: "85vh",
  background: "rgba(15,23,42,0.96)",
  borderRadius: 20,
  boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  animation: "scaleIn 0.3s ease",
};

const closeButton: CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  border: "none",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  borderRadius: "50%",
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s ease",
};

const videoStyles: CSSProperties = {
  width: "100%",
  height: "auto",
  maxHeight: "70vh",
  borderRadius: 16,
  backgroundColor: "#000",
  boxShadow: "0 0 20px rgba(0,0,0,0.6)",
};

const emptyStyles: CSSProperties = {
  width: "100%",
  minHeight: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#e2e8f0",
  background: "rgba(15,23,42,0.65)",
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.15)",
  textAlign: "center",
  padding: "32px",
};

const subtitleControls: CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  marginTop: "16px",
};
