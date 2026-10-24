"use client";

import { useRef, useState } from "react";

const SONG = "/music/song.mp3"; // lives in public/music/
const VOLUME = 0.4;

export default function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(true); // the "tap to vibe" bubble

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setHint(false);
    if (audio.paused) {
      try {
        audio.volume = VOLUME;
        await audio.play();
        setOn(true);
      } catch {
        setOn(false); // browser refused; the next click will try again
      }
    } else {
      audio.pause();
      setOn(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={SONG} loop preload="auto" />

      {hint && (
        <div className="sound-hint px-box px-2" aria-hidden="true">
          tap to vibe 🎵
          <span className="tail" />
        </div>
      )}

      <button
        type="button"
        className="sound px-box px-2"
        aria-pressed={on}
        aria-label={on ? "Mute music" : "Play music"}
        onClick={toggle}
      >
        {on ? "🔊" : "🔇"}
      </button>
    </>
  );
}