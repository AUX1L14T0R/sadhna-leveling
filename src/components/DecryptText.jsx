import { useEffect, useState } from "react";

const CHARS = "01X#@$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function DecryptText({ text }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((c, i) =>
            i < frame ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      frame++;
      if (frame > text.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono">{display}</span>;
}
