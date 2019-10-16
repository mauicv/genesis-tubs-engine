//classes
const modules = require('../../moduleHandler.js');

const sl = modules.getModule('SL');
const gm = modules.getModule('GeneralMethods');

const pl = modules.getModule('SpaceTime');

const Point = modules.getModule('Point');
const Particle = modules.getModule('Particle');
const Joint = modules.getModule('Joint');
const Link = modules.getModule('Link');
const Beam = modules.getModule('Beam');
const AngleLink = modules.getModule('AngleLink');
const Glue = modules.getModule('Glue');
const ConvexSet = modules.getModule('ConvexSet');
const Structure = modules.getModule('Structure');

const Line = modules.getModule('Line');
const RelPoint = modules.getModule('RelPoint');


const LawInstances= modules.getModule('lawInstances');

module.exports =class build{
  constructor(environmentName){
    this.environment=new pl(environmentName, this);
    this.environment.laws.finite=LawInstances["finite"](this.environment);
    this.environment.laws.gravity=LawInstances["gravity"];
    this.environment.laws.airResistance=LawInstances["airResistance"];
  }

  returnEnviro(){
    return this.environment;
  }

//load
  load(fileName){
    this.environment=sl.load(fileName);
  }

  mergeLoad(filename){
    this.addEnvironment(this.environment,sl.load(fileName));
  }

//save
  save(fileName){
    sl.save(this.environment,fileName);
  }

//points
  addPoint(x){
    //x can be either a instance of point or just [x,y] co-ords
    //the added point inherits environmental laws
    if(x instanceof Point){
      x.index=this.environment.points.length;
      x.environment=this.environment;
      this.environment.points.push(x);
    }else{
      var newPoint=new Point(x,this.environment.points.length);
      newPoint.environment=this.environment;
      this.environment.points.push(newPoint);
    }
    return this.environment.points[this.environment.points.length-1];
  }

  addPoints(xList){
    xList.forEach(function(x){
      this.addPoint(x);
    },this);
  }

  copyPoint(point){
    var x=point.x.slice();
    var newPoint = this.addPoint(x);
    return newPoint;
  }

//graphics
  addRelPoint(x,anchor){
    var newRelPoint=new RelPoint(x,this.environment.relPoints.length,anchor);
    this.environment.relPoints.push(newRelPoint);
    return newRelPoint;
  }

  addLine(x,y){
    var newLine = new Line(x,y,this.environment.graphics.length);
    this.environment.graphics.push(newLine);
    newLine.from.anchor.belongsTo.graphics.push(newLine);
    return newLine;
  }

//particles
  addParticle(x,radius,v){
    var newParticle = new Particle(x,v,this.environment.points.length,radius);
    newParticle.environment=this.environment;
    //we think of particles as point but with associated strucutre capacity
    this.environment.points.push(newParticle);
    return newParticle;
  }

//links
  addVisableLink(from,to){
    var newLink = new Link(from,to,true,true,this.environment.constraints.length);
    this.environment.constraints.push(newLink);
    return newLink;
  }

  addInvisableLink(from,to){
    var newLink = new Link(from,to,true,false,this.environment.constraints.length);
    this.environment.constraints.push(newLink);
    return newLink;
  }
//Beams
  addBeam(from,to,forceUpperBound,forceLowerBound,compLowerBound,resistance){
    var newBeam= new Beam(from,to,forceUpperBound,forceLowerBound,compLowerBound,resistance,this.environment.constraints.length);
    this.environment.constraints.push(newBeam);
    return newBeam;
  }

//Glues
  addGlueBetweenLinkPairs(link1,link2){
    var newGlue = new Glue(link1,link2,this.environment.constraints.length);
    link1.belongsTo.glues.push(newGlue);
    link2.belongsTo.glues.push(newGlue);
    this.environment.constraints.push(newGlue);
    return newGlue;
  }

//Joints
  addAngleLink(link1,link2){
    var newAngleLink=new AngleLink(link1,link2,this.environment.constraints.length);
    this.environment.constraints.push(newAngleLink);
    return newAngleLink;

  }

  addJointBetweenLinkPairs(linkPair1,linkPair2){
		var link1=linkPair1[0];
		var link2=linkPair2[0];
		var degOfFreedom1=linkPair1[0].intersectAngleTo(linkPair1[1]);
		var degOfFreedom2=linkPair2[0].intersectAngleTo(linkPair2[1]);
		var newJoint= new Joint(link1,link2,degOfFreedom1,degOfFreedom2,this.environment.constraints.length);
		link1.belongsTo.joints.push(newJoint);
		link2.belongsTo.joints.push(newJoint);
		this.environment.constraints.push(newJoint);
    return newJoint
	}


//ConvexSets
  addConvexSet(points){

    var sizeOfConvexSet=points.length;
    var convexSetLinks=[];
    var convexSetAngleLinks=[];

    //build convex sets edges
    for(var i=0;i<points.length;i++){
      var nextLink=this.addVisableLink(points[i],points[(i+1)%sizeOfConvexSet]);
      convexSetLinks.push(nextLink);
    }

    //Add anglelinks
    var M=convexSetLinks.length;
    for(var i=0;i<M;i++){
      var newAngleLink =this.addAngleLink(convexSetLinks[i],convexSetLinks[(i+1)%M]);
      convexSetAngleLinks.push(newAngleLink);
    }

    //build Convex set instance that inherits environmental laws
    var nextConvexSet = new ConvexSet(convexSetLinks,convexSetAngleLinks,this.environment.convexSets.length);
    //nextConvexSet.laws=this.environment.laws;??
    this.environment.convexSets.push(nextConvexSet);

    //add convex set to each points belongsTo
    //Will require adapting the toJson files...
    for(var i=0;i<points.length;i++){
      points[i].belongsTo=nextConvexSet;
    }

    return nextConvexSet
  }

	addGlueBetweenConvexSets(convexSet1,convexSet2){
		var links=[];
		var minSum=1000;
		var temp=0;

	  convexSet1.links.forEach(function(link1){
	    convexSet2.links.forEach(function(link2){
				temp=gm.size(link1.from.x,link2.to.x)+gm.size(link1.to.x,link2.from.x);
	      if(temp<minSum){
						minSum=temp;
	          links=[link1,link2];
	      }
	    });
	  });
	  this.addGlueBetweenLinkPairs(links[0],links[1]);
	};

  addJointBetweenConvexSets(convexSet1,convexSet2){
		var indexPair=[];

		var min=1000;
		var temp=0;

	  convexSet1.links.forEach(function(link1,index1){
	    convexSet2.links.forEach(function(link2,index2){
				temp=gm.size(link1.to.x,link2.to.x);
	      if(temp<min){
	        min=temp;
					indexPair=[index1,index2];
	      }
	    });
	  });

		var numLinks1=convexSet1.links.length;
	  var numLinks2=convexSet2.links.length;

		var pair1=[convexSet1.links[indexPair[0]],convexSet1.links[(indexPair[0]+1)%numLinks1]];
		var pair2=[convexSet2.links[indexPair[1]],convexSet2.links[(indexPair[1]+1)%numLinks2]];

	  return this.addJointBetweenLinkPairs(pair1,pair2);
	};

  //structures and features
  addStructure(elements,features){
		var newStructure=new Structure(elements);
		newStructure.environment=this.environment;
    features.forEach(function(feature){
      newStructure.features.push(feature);
    })
		this.environment.structures.push(newStructure);
    elements.forEach(function(element){
      element.belongsTo.push(newStructure);
    })
    return newStructure;
	}

  addBoundingRect(structure){
    var rect=structure.findBoundingRect();
    structure.stuff.center=new RelPoint(rect[0],this.environment.relPoints.length,structure.elements[0].links[0]);
    structure.stuff.r=gm.add(rect[1],[10,10]);
    structure.stuff.hasBoundingRect=true;
    this.environment.relPoints.push(structure.stuff.center);
    this.buildOrderArrays();
  }

  namesAllStructures(name){
    this.environment.structures.forEach(function(structure){
      structure.name=name;
    })
  }

  addFeaturesTo(features,name){
    if(name=="all"){
      this.environment.structures.forEach(function(structure){
        structure.features.concat(features);
      })
    }else{
      var namedSet=this.environment.structures.filter(structure=>structure.name==name);
      namedSet.forEach(function(structure){
        structure.features.concat(features);
      })
    }
  }

  //laws

  addLawTo(law,name){
    if(name=="all"){
      law.structures.concat(this.environment.structures);
    }else {
      var namedSet=this.environment.structures.filter(structure=>structure.name==name);
      law.structures.concat(law);
    }
  }

  //merge environments

  addEnvironment(enviro){

		var numPoints=this.environment.points.length;
		enviro.points.forEach(function(point,i){
			point.index=numPoints+i;
			this.points.push(point);
		},this.environment)

		var numSets=this.environment.convexSets.length;
		enviro.convexSets.forEach(function(convexSet,j){
			convexSet.index=numSets+j;
			this.convexSets.push(convexSet);
		},this.environment)

		enviro.constraints.forEach(function(constraint){
			this.constraints.push(constraint);
		},this.environment)

    enviro.structures.forEach(function(structure){
      this.structures.push(structure);
    },this.environment)

    //merges law sets without including replicates.
    Object.keys(enviro.laws).forEach(function(thatLaw){
      Object.keys(this.laws).forEach(function(thisLaw){
        if(thisLaw!=="null" && thatLaw !=="null"){
          if(thisLaw==thatLaw){
              enviro.laws[thatLaw].structures.forEach(function(structure){
                this.laws[thisLaw].structures.push(structure);
              }, this)
          }else{
            this.laws[thatLaw]=enviro.laws[thatLaw];
          }
        }
      },this)
		},this.environment)

		this.buildOrderArrays();
	}

  // Remove methods
  removeStructureWithName(name){
    var structure = this.environment.structures
      .find(structure=>structure.name==name)
    this.removeStructure(structure)
  }

  removeStructure(structureToRemove){
    this.environment.structures = this.environment.structures
      .filter(structure=>structure != structureToRemove)

    var particlesToRemove = structureToRemove.elements
      .filter((ele)=>ele instanceof Particle)

    this.environment.constraints = this.environment.constraints
      .filter(c=>{
        if (c instanceof Link) return !particlesToRemove.includes(c.from)
        return true
      })

    this.environment.points = this.environment.points
      .filter(p=>!particlesToRemove.includes(p))

    var convexSetsToRemove = structureToRemove.elements
      .filter((ele)=>ele instanceof ConvexSet)

    var linksToRemove = convexSetsToRemove
      .reduce((acc, cur) => [...acc, ...cur.links],[])

    var jointsToRemove = convexSetsToRemove
      .reduce((acc, cur) => [...acc, ...cur.joints],[])

    var gluesToRemove = convexSetsToRemove
      .reduce((acc, cur) => [...acc, ...cur.glues],[])

    var angleLinksToRemove = convexSetsToRemove
      .reduce((acc, cur) => [...acc, ...cur.angleLinks],[])

    var pointsToRemove = linksToRemove
      .reduce((acc, cur) => [...acc, cur.from, cur.to],[])

    this.environment.points = this.environment.points
      .filter(p=>!pointsToRemove.includes(p))

    this.environment.constraints = this.environment.constraints
      .filter(c=>{
        if (c instanceof AngleLink) return !angleLinksToRemove.includes(c)
        if (c instanceof Joint) return !jointsToRemove.includes(c)
        if (c instanceof Glue) return !gluesToRemove.includes(c)
        if (c instanceof Link) return !linksToRemove.includes(c)
        return True
      })

    Object.values(this.environment.laws)
      .forEach(value=>value.structures = value.structures
        .filter(structure=>structure != structureToRemove))

    this.recalibrateIndexing();
    this.buildOrderArrays();
  }

  deleteStructure(structureA){
    this.environment.structures.forEach(function(structureB,index){
      if(structureB===structureA){
        this.structures.splice(index,1);
      }
    },this.environment);
  }

  //initialize order arrays//

	buildOrderArrays(){
    this.environment.constraintsRunOrder=[];
		for(var k=0;k<this.environment.constraints.length;k++){
			this.environment.constraintsRunOrder.push(k);
		}
	}

  //////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////Effects///////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  addExplodeStucture(components,n,size,strength,vel,lifeLength,at,connectedDensity,features,gravity){
    for(var k =0;k<components;k++){
      var pList=[];
      for(var i=0; i<n;i++){
        var x=gm.add([Math.floor((Math.random()-0.5)*size),Math.floor((Math.random()-0.5)*size)],at);
        var v=gm.add([(Math.random()-0.5)*strength,(Math.random()-0.5)*strength],vel);
        pList.push(this.addParticle(x,0,v));
      }

      var N=pList.length;

      pList.forEach(function(particle,i){
        var numOfLinks = Math.floor(Math.random()*connectedDensity);
        if(numOfLinks==0){numOfLinks++};
        var links=[];
        for(var j=0;j<numOfLinks;j++){
          var boolInLinks=false;
          var M=Math.floor(Math.random()*N);
          links.forEach(function(link){
            if(link==M){
              boolInLinks=true;
            }
          });
         if(!boolInLinks){
           this.addVisableLink(pList[i],pList[M]);
         }
        }
      },this);

      var newStructure=this.addStructure(pList,[]);
      newStructure.name="explosion";

      if(lifeLength>0){
        newStructure.stuff.lifeLength=lifeLength;
        newStructure.stuff.age=0;
        this.environment.laws.finite.structures.push(newStructure);
      }

      if(gravity){
        this.environment.laws["gravity"].structures.push(newStructure);
      }

      features.forEach(function(feature){
        newStructure.features.push(feature);
      });
    }

    this.buildOrderArrays();

  }

  recalibrateIndexing(){
    this.environment.points.forEach(function(point,index){
      point.index=index;
    });
    this.environment.constraints.forEach(function(constraint,index){
      constraint.index=index;
    });
    this.environment.convexSets.forEach(function(set,index){
      set.index=index;
    });
    this.environment.graphics.forEach(function(line,index){
      line.index=index;
    });
    this.environment.relPoints.forEach(function(point,index){
      point.index=index;
    });
  }

  cleanEnvironment(){
    this.environment.name=null;
    this.environment.points=[];
    this.environment.constraints=[]
    this.environment.convexSets=[];
    this.environment.structures=[];
    this.environment.relPoints=[];
    this.environment.graphics=[];
    this.environment.laws={};
    this.environment.builder=null;
    this.environment.time=0;
    this.environment.realCenter=null;
    this.environment.relativeCenter=[];
    this.environment.constraintsRunOrder=[];
    this.environment.localRate=2;
    this.environment.globalRate=2;
    this.environment.totalRate=5;
    this.environment.stuff={};
    this.environment.builder=this;
  };

}
