const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const cc = modules.getModule('CollisionChecker');
const cr = modules.getModule('CollisionResponse');
const Law = modules.getModule('Law');
const Features = modules.getModule('featureInstances');
const Link = modules.getModule('Link');

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
var law = module.exports = {
	gravity: (function(){
      var gravity = new Law("Gravity");
			gravity.effects= function(){
        this.applyToAllPoints(function(point){
          point.update_x_xd([0,0.001]);
        })
      }
      return gravity;
    })(),

  airResistance: (function(){
      var airResistance = new Law("AirResistance");
      //airResistance.frictionalConstant=0.001;
      airResistance.effects=function(){
        this.applyToAllPoints(function(point){
					point.update_x_xd(gm.mult(gm.minus(point.x_old,point.x),0.002));
        })
      }
    return airResistance;
  })(),

	finite: function(enviro){
		var finite = new Law("lifeTime");
		finite.environment = enviro
		finite.effects=function(){
			this.applyToStructures(function(structure){
				if(structure.alive){
					if(structure.stuff.age>structure.stuff.lifeLength){
						structure.kill();
						finite.environment.builder
							.removeStructure(structure)
					}else{
						structure.stuff.age++;
					}
				}
			})
		}
		return finite;
	},

	boundary: function(leftWall,rightWall,downWall,upWall){
		var boundary=new Law("boundary")
		boundary.effects=function(){
		 	this.applyToStructures(function(structure){
				var center = structure.findCenter()
				if(center[0]>rightWall){
					structure.elements.forEach(function(element){
						element.links.forEach(function(link){
							link.from.update_x_xd([-rightWall,0])
							link.from.update_x_old_xd([-rightWall,0])
						})
					})
				}else if(center[0]<leftWall){
					structure.elements.forEach(function(element){
						element.links.forEach(function(link){
							link.from.update_x_xd([rightWall,0])
							link.from.update_x_old_xd([rightWall,0])
						})
					})
				}else if(center[1]>upWall){
					structure.elements.forEach(function(element){
						element.links.forEach(function(link){
							link.from.update_x_xd([0,-upWall])
							link.from.update_x_old_xd([0,-upWall])
						})
					})
				}else if(center[1]<downWall){
					structure.elements.forEach(function(element){
						element.links.forEach(function(link){
							link.from.update_x_xd([0,upWall])
							link.from.update_x_old_xd([0,upWall])
						})
					})
				}
			})
		}
		return boundary
	},

}
