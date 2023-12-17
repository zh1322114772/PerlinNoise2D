import { PerlinNoiseGenerator } from "./PerlinNoiseGenerator.js";

let canvas = document.getElementById("canvas");
let generator = new PerlinNoiseGenerator(canvas, 256, 256, 8);


function run()
{ 
    generator.renderNextFrame(0.2);
    window.requestAnimationFrame(run);
}

run();