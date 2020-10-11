import React from "react";
import { hydrate } from "react-dom";
import App from "./App";


console.log('reactele')
console.log(document.getElementById("reactele"))
hydrate(<App />, document.getElementById("reactele"));
