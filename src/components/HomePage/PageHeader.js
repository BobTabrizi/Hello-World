import worlds from "../../../Data/HelloWorlds.json";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [randomTextIndex, setRandomTextIndex] = useState(0);
  const handleTextIndex = () => {
    if (randomTextIndex === 0) {
      let idx = Math.floor(Math.random() * 14 + 1);
      setRandomTextIndex(idx);
    } else {
      setRandomTextIndex(0);
    }
  };

  return (
    <div
      className="headerTitle"
      style={{
        fontSize: 60,
        textAlign: "center",
        fontFamily: "Codystar",
      }}
      onMouseEnter={(e) => handleTextIndex()}
    >
      <span>{worlds[randomTextIndex].text}</span>
    </div>
  );
}
