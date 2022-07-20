import React from "react";
import ReactDOM from "react-dom";
import ringer from "./fuegos.mp3";

export default function Sound( {reproducir}) {
  const audio = new Audio(ringer);
  audio.loop = true;

  return (
    <div>

{reproducir?
          audio.play()
          :
          audio.loop = false
}
      
      {/* <button
        onClick={() => {
          audio.loop = true;
          audio.play();
        }}
      >
        Play
      </button>
      <button onClick={() => ( audio.loop = false)}>Pause</button> */}
    </div>
  );
};
/*
const rootElement = document.getElementById("root");
ReactDOM.render(<Sound />, rootElement);*/