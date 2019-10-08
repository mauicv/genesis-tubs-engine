//
const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');

const ConvexSet = modules.getModule('ConvexSet');
const Particle = modules.getModule('Particle');

const cc = modules.getModule('CollisionChecker');
const cr = modules.getModule('CollisionResponse');

module.exports= class feature{
  //a Feature is an interaction rule which describes interactions between Structures
	constructor(name){
      this.name=name;
      this.active=true;
  }

  toJSON(){
		var data={
				"name":this.name
			};

			return data;
	}

	multiScan(structure1,structure2,depth){
		var reports=[];
		if(this.CheckBoundingRect(structure1,structure2)){
			var report;
			structure1.elements.forEach(function(thisElement){
	  		structure2.elements.forEach(function(thatElement){
	  				if(thisElement instanceof ConvexSet && thatElement instanceof ConvexSet){
	  					report=cc.convexTest(thisElement.links,thatElement.links);
	  				} else if (thisElement instanceof Particle && thatElement instanceof ConvexSet){
							report = cc.xToB(thisElement,thatElement.links);
							report.depth=report.depth-thisElement.radius;
						} else if (thisElement instanceof ConvexSet && thatElement instanceof Particle){
							report = cc.xToB(thatElement,thisElement.links);
							report.depth=report.depth-thatElement.radius;
	  				} else if (thisElement instanceof Particle && thatElement instanceof Particle){
							report ={
								"type":"p2p",
								"point1":thisElement,
								"point2":thatElement,
								"depth":gm.size(thisElement.x,thatElement.x)-thatElement.radius-thisElement.radius
							}
						}
						if(report.depth<depth){
							reports.push(report);
						}else{

						}
				})
	  	})
		}
		return reports;
	}

	CheckBoundingRect(structure1,structure2){
		if(structure1.stuff.hasBoundingRect&&structure2.stuff.hasBoundingRect){
			if(gm.pos(structure1.stuff.center.x[0]-structure2.stuff.center.x[0])-structure1.stuff.r[0]-structure2.stuff.r[0]>0){
				return false;
			}else{
				if(gm.pos(structure1.stuff.center.x[1]-structure2.stuff.center.x[1])-structure1.stuff.r[1]-structure2.stuff.r[1]>0){
					return false;
				}else{
					return true;
				}
			}
		}else{
			return true;
		}
	}
}
