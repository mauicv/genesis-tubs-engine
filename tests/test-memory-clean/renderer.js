// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// const engine = require('genesis-tubs-engine')

function buildPhysEnv(){

	const engine = require('../../src/index.js')
	const gm = engine.GeneralMethods;
	const cr = engine.CollisionResponse;
	const sl1 = engine.SL;
	const sl2 = engine.SL;
	const Features = engine.featureInstances;
	const Laws = engine.lawInstances;
	const Beam = engine.Beam;
	const Line = engine.Line;
	const Particle = engine.Particle;

	var canvas = document.getElementById("TestCanvas");
	var drawCtx = canvas.getContext("2d");
	var WIDTH = document.documentElement.clientWidth;
	var HEIGHT = document.documentElement.clientHeight-60;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

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

	var enviro = sl1.load("ship.txt");

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
	var animationRef;

	var run = function () {
	  animationRef = window.requestAnimationFrame( run );
	  enviro.timeStep();
	  draw();
	};

	var stop = function(){
		window.cancelAnimationFrame(animationRef);
	}

	return {
		run: run,
		stop: stop,
		enviro: enviro
	}
}


var c = buildPhysEnv()
c.run();
setTimeout(()=>c.stop(), 100)
setTimeout(()=>c.enviro.builder.cleanEnvironment(), 200)
setTimeout(()=>console.log(c.enviro), 300)
