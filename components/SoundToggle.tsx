"use client";

import { useRef, useState } from "react";

const SONG = "/music/song.mp3"; // lives in public/music/
const VOLUME = 0.4;

// Speaker icon with sound waves (music on)
function VolumeOn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sound-icon">
      <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor" />
      <path d="M15.5 9.5a4 4 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Speaker icon with an X (music off)
function VolumeOff() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sound-icon">
      <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
        {on ? <VolumeOn /> : <VolumeOff />}
      </button>
    </>
  );
}