// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// const engine = require('genesis-tubs-engine')

const transform = require('./transform.js')
const Cover = require('./cover.js')

const engine = require('../../src/index.js')
const gm = engine.GeneralMethods;
const cr = engine.CollisionResponse;
const sl = engine.SL;
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



//load test
var enviro = sl.loadGTBFormat("./graphics/bigSquarePanel.txt");

var cover = new Cover({set: enviro.convexSets[0], size: 110})

// draw()
// var center = enviro.convexSets[0].findCenter()
//
// draw()

function drawRect(rect, color){
	drawCtx.strokeStyle = color;
	var path = rect.getBoundaryPath()
	path.forEach(function(point){
		drawCtx.beginPath();
		drawCtx.moveTo(...point.from);
		drawCtx.lineTo(...point.to);
		drawCtx.stroke();
	});
}

// drawRect(cover.boundary)

// p = 0.7
// r = 0.175
// size = 110
// rects = cover.generateCover()
//
// function recursiveGenerateCover({depth, selected, rects}){
// 	if (depth == 0) {
// 		// rects.forEach(aset=>{
// 		// 	drawRect(aset, 'black')
// 		// })
// 		selected.forEach(sset=>{
// 			drawRect(sset, 'black')
// 		})
// 		return [...selected]}
// 	selectedRects = []
//
// 	var rn = Math.floor(rects.length*p)
//
// 	for (var i=0; i<rn; i++){
// 		selectedRects.push(getRandomFromBucket(rects))
// 	}
// 	selected = [...selected, ...selectedRects]
//
//
// 	size = size * r
// 	var newRects = rects
// 		.reduce((acc, cur)=>{
// 			return [...acc, ...cur.convertToCover(size).generateCover()]
// 		}, [])
//
// 	return recursiveGenerateCover({
// 		depth: depth-1,
// 		selected: selected,
// 		rects: newRects
// 	})
// }
//
// function getRandomFromBucket(bucket) {
//    var randomIndex = Math.floor(Math.random()*bucket.length);
//    return bucket.splice(randomIndex, 1)[0];
// }

// var sets = recursiveGenerateCover({
// 	depth: 2,
// 	selected: [],
// 	rects: rects
// })

// sets.forEach(set=>{
// 	drawRect(set)
// })

// enviro.relPoints.forEach(function(point){
// 	point.update_x();
// });

// draw()


// window.main = function () {
//   window.requestAnimationFrame( main );
//   enviro.timeStep();
//   draw();
// };
// main(); //start Game

function draw(){
  // drawCtx.fillStyle="white";
  // drawCtx.fillRect(0,0,WIDTH,HEIGHT);


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

  drawCtx.strokeStyle = "red";
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
