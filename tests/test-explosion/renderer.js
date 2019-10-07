// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// const engine = require('genesis-tubs-engine')
const engine = require('../../src/index.js')
const builder = new engine.Builder()

const Line = engine.Line
const Particle = engine.Particle

var canvas = document.getElementById("TestCanvas");
var drawCtx = canvas.getContext("2d");
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight-60;
canvas.width = WIDTH;
canvas.height = HEIGHT;


var enviro = builder.returnEnviro()

function addBoom(){
  enviro.builder.addExplodeStucture(
    30,7,5,1,[0,0],3000,
    [WIDTH/2, HEIGHT/2],
    1,[],false
  );
}

addBoom()

window.main = function () {
  window.requestAnimationFrame( main );
  enviro.timeStep();
  draw();

};



main(); //start Game

function draw(){
  drawCtx.fillStyle="black";
  drawCtx.fillRect(0,0,WIDTH,HEIGHT);


	drawCtx.strokeStyle = "white";

	// enviro.points.forEach(function(point){
	// 	drawCtx.beginPath();
	// 	drawCtx.arc(point.x[0],point.x[1],1,0,2*Math.PI);
	// 	drawCtx.stroke();
	// })

	drawCtx.beginPath();
	drawCtx.arc(WIDTH/2,HEIGHT/2,1,0,2*Math.PI);
	drawCtx.stroke();

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
