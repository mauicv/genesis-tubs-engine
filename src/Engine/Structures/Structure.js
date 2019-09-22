const modules = require('../../moduleHandler.js');

const gm = modules.getModule('GeneralMethods');
const cc = modules.getModule('CollisionChecker');
const primative = modules.getModule('Primative');
const ConvexSet = modules.getModule('ConvexSet');
const Particle = modules.getModule('Particle');

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports=class structure extends primative{
	constructor(elements,index){
		super(index);
    this.elements=elements;
    this.features=[];
		this.stuff={
			"hasBoundingRect":false
		};
  }

	toJSON(){
		var data={
			"elements":this.elements.map(element=>element.index),
			"features":this.features.map(feature=>feature.name)
		}
		return data;
	}

  addElement(element){
    this.elements.push(element);
    element.belongsTo=this;
  }

  interaction(structure){
    this.features.forEach(function(featureA){
			structure.features.forEach(function(featureB){
				if(featureA.name==featureB.name){
					featureA.interaction(structure,this);
				}
			},this)
		},this)
  }

	getElementIndices(){
		var indices=this.elements.map(element=>element.index);
		return indices;
	}
	//

	fix(){
		this.elements.forEach(function(element){
			element.fix();
		})
	}

	kill(){
		this.elements.forEach(function(element){
			element.kill();
		})
	}

	findCenter(){
		var xAv=[0,0];
    this.elements.forEach(function(element){
      if(element instanceof ConvexSet){
        xAv=gm.add(xAv,element.findCenter());
      }
    });
    return gm.dev(xAv,this.elements.length);
	}

	findBoundingRect(){
		var center=this.findCenter();
		var r=0;
		var rNew=[0,0];
    this.elements.forEach(function(element){
      if(element instanceof ConvexSet){
				element.links.forEach(function(link){
					rNew = gm.size(link.from.x,center);
					if(rNew>r){
						r=rNew;
					}
				})
      }
    });
    return [center,[r,r]];
	}

	checkProximityTo(structure,depth){
		var reports=[]
		if(this.CheckBoundingRect(structure)){
			this.elements.forEach(function(thisElement){
				structure.elements.forEach(function(thatElement){
					var report=thisElement.checkProximityTo(thatElement)
					if(report.depth<depth){
						report.collisionPair=[thisElement,thatElement]
						reports.push(report)
					}
				})
			})
		}
		return reports
	}

	CheckBoundingRect(structure){
		if(this.stuff.hasBoundingRect&&structure.stuff.hasBoundingRect){
			if(gm.pos(this.stuff.center.x[0]-structure.stuff.center.x[0])-this.stuff.r[0]-structure.stuff.r[0]>0){
				return false;
			}else{
				if(gm.pos(this.stuff.center.x[1]-structure.stuff.center.x[1])-this.stuff.r[1]-structure.stuff.r[1]>0){
					return false;
				}else{
					return true;
				}
			}
		}else{
			return true;
		}
	}

	nudge(v){
		this.elements.forEach(function(element){
			if(element instanceof ConvexSet){
				element.nudge(v)
			}else if(element instanceof Particle){
				element.update_x_xd(v)
			}
		})
	}

	randomNudges(force){
		var v=[]
		this.elements.forEach(function(element){
			if(element instanceof ConvexSet){
				v=[(Math.random()-0.5)*force,(Math.random()-0.5)*force]
				element.nudge(v)
			}else if(element instanceof Particle){
				element.update_x_xd(v)
			}
		})
	}
}
