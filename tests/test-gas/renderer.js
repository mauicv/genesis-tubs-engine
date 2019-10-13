// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// const engine = require('genesis-tubs-engine')
const engine = require('../../src/index.js')
const builder = new engine.Builder()

const Line = engine.Line
const Particle = engine.Particle
const Features = engine.featureInstances
const Law = engine.lawInstances
const gm = engine.GeneralMethods

var canvas = document.getElementById("TestCanvas");
var drawCtx = canvas.getContext("2d");
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight-60;
canvas.width = WIDTH;
canvas.height = HEIGHT;

var enviro = builder.returnEnviro()

// var p = builder.addParticle(
//   [WIDTH/2, HEIGHT/2], 50, [0,0]
// )

for (var i = 0; i<300; i++) {
  var y = Math.random() * canvas.height
  var x = Math.random() * canvas.width
  // if(gm.size([WIDTH/2, HEIGHT/2],[x,y]) > 50) {
  var p = builder.addParticle(
    [x, y], 10, [0,0]
  )
  // }
}


enviro.points.forEach(point=>{
  builder.addStructure([point], [])
})

enviro.structures.forEach(function(structure) {
  // enviro.builder.addBoundingRect(structure);

  structure.features.push(Features["mass"]);
  // structure.randomNudges(0.1);
});

enviro.laws.bowl = Law['bowl']([WIDTH/2, HEIGHT/2], 2)
enviro.laws.bowl.structures = enviro.structures

window.main = function () {
  window.requestAnimationFrame( main );
  enviro.timeStep();
  draw();
};



main(); //start Game

function draw(){
  drawCtx.fillStyle = "black";
  drawCtx.fillRect(0, 0, canvas.width, canvas.height);

  // drawCtx.fillStyle = 'red'
  // drawCtx.beginPath();
  // drawCtx.arc(enviro.points[0].x[0], enviro.points[0].x[1], enviro.points[0].radius, 0, 2*Math.PI);
  // // drawCtx.arc(enviro.points[0].x[0], enviro.points[0].x[1], 3, 0, 2*Math.PI);
  // drawCtx.fill();

  enviro.points.forEach(((point,i)=>{
    if (i>1){
      drawCtx.fillStyle = 'purple'
      drawCtx.beginPath();
      drawCtx.arc(point.x[0], point.x[1], point.radius, 0, 2*Math.PI);
      drawCtx.fill();
    }
  }))
}
