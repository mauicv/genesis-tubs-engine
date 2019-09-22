// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const modules = require('../../src/moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const cr=modules.getModule('CollisionResponse');
const sl=modules.getModule('SL');
const Features = modules.getModule('featureInstances');
const Laws = modules.getModule('lawInstances');
const Beam = modules.getModule('Beam');
const Line = modules.getModule('Line');
const Particle = modules.getModule('Particle');


var canvas = document.getElementById("TestCanvas");
var drawCtx = canvas.getContext("2d");
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight-60;
canvas.width = WIDTH;
canvas.height = HEIGHT;

//load test
var enviro = sl.load("ship.txt");

//bounding boxes
enviro.structures.forEach(function(structure){
	enviro.builder.addBoundingRect(structure);
  structure.features.push(Features["mass"])
  structure.randomNudges(1)
	enviro.laws.gravity.structures.push(structure)
	enviro.laws.airResistance.structures.push(structure)
})

enviro.structures[5].fix()
enviro.structures[9].fix()



console.log(enviro)

window.main = function () {
  window.requestAnimationFrame( main );
  enviro.timeStep();
  draw();
};


main(); //start Game

function draw(){
  drawCtx.fillStyle="white";
  drawCtx.fillRect(0,0,WIDTH,HEIGHT);


  drawCtx.strokeStyle = "black";
  //draw all links...
  enviro.constraints.forEach(function(constraint,i){
		if(constraint.visable){
			drawCtx.beginPath();
	    drawCtx.moveTo(constraint.from.x[0],constraint.from.x[1]);
	    drawCtx.lineTo(constraint.to.x[0],constraint.to.x[1]);
	    drawCtx.stroke();
		}
  });

  drawCtx.strokeStyle = "white";
	enviro.graphics.forEach(function(graphic){
    if(graphic instanceof Line){
      if(graphic.visable){
  			drawCtx.beginPath();
  	    drawCtx.moveTo(graphic.from.x[0],graphic.from.x[1]);
  	    drawCtx.lineTo(graphic.to.x[0],graphic.to.x[1]);
  	    drawCtx.stroke();
  		}
    }else if(graphic instanceof Particle){
      drawCtx.beginPath();
      drawCtx.arc(graphic.x[0],graphic.x[1],1,0,2*Math.PI);
      drawCtx.stroke();
    }
  });
}
