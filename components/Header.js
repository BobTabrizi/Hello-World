import worlds from "../HelloWorlds.json";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [randomTextIndex, setRandomTextIndex] = useState(1);
  const handleTextIndex = () => {
    let idx = Math.floor(Math.random() * 29 + 1);
    setRandomTextIndex(idx);
  };

  return (
    <div
      className="headerTitle"
      style={{
        fontSize: 40,
        textAlign: "center",
      }}
      onMouseEnter={(e) => handleTextIndex()}
      onMouseLeave={(e) => setRandomTextIndex(0)}
    >
      <span>{worlds[randomTextIndex].text}</span>
    </div>
  );
}
