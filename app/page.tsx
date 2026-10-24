import Character from "@/components/Character";
import PixelHeart from "@/components/PixelHeart";
import PolkaDots from "@/components/PolkaDots";
import SoundToggle from "@/components/SoundToggle";

const CHARACTERS = [
  {
    name: "Naurah",
    src: "/characters/naurah.png",
    line: "We’ve survived enough lectures to have some opinions 😭",
  },
  {
    name: "Bhoomi",
    src: "/characters/bhoomi.png",
    line: "And we figured other students probably have opinions too…",
  },
  {
    name: "Arushi",
    src: "/characters/arushi.png",
    line: "So why not put all the professor tea in one place? 💅",
  },
];

export default function Home() {
  return (
    <main className="page">
      <PolkaDots />

      <section className="hero">
        <div className="logo px-box px-2 no-shadow">Word Of Warning.</div>

        <h1>
          Wondering what your professor is really like?
        </h1>

        <button
          type="button"
          className="cta px-box px-2"
          // TODO: route to sign up page once it exists
        >
          Join the campus conversation <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className="login-link"
          // TODO: route to login page once it exists
        >
          Already a member? Login
        </button>
      </section>

      <section className="characters">
        {CHARACTERS.map((c) => (
          <Character key={c.name} {...c} />
        ))}
      </section>

      <footer className="footer">
        <span className="pill px-box px-3">
          <PixelHeart />
          Made by students, for students
          <PixelHeart />
        </span>
      </footer>

      <SoundToggle />
    </main>
  );
}
