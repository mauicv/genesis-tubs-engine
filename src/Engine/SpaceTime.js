const modules = require('../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');

//factor out this module. It appears here incorrectly should be at the level of laws?
const cr = modules.getModule('CollisionResponse');

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//rename components
module.exports=class Grid{

	constructor(name,builder){
		this.name=name;
		this.points=[];
		this.constraints=[]
		this.convexSets=[];
		this.structures=[];
		this.relPoints=[];
		this.graphics=[];
		this.laws={};
		this.builder=builder;
		this.time=0;

		this.realCenter=null;
		this.relativeCenter=[];

		this.constraintsRunOrder=[];

		this.localRate=2;
		this.globalRate=2;
		this.totalRate=5;

		this.stuff={};
	}

	toJSON(){
		var data={
			"points":this.points,
			"relPoints":this.relPoints,
			"graphics":this.graphics,
			"constraints":this.constraints,
			"convexSets":this.convexSets,
			"structures":this.structures,
			"laws":Object.keys(this.laws).map(law=>law.name)
		}
		return data;
	};

	//Location methods

	shiftScene(xd){
		this.points.forEach(function(point){
			point.move(xd);
			point.move(xd);
		})

		this.relPoints.forEach(function(point){
			point.update_x();
		})
	}



	///////////////////
	//Physics Methods//
	///////////////////

	wallEffects(leftWall,rightWall,upWall,downWall){
		cr.wallCollisionTest(this.points,leftWall,rightWall,upWall,downWall);
	}

	constraintEffects(n){
		for(var l=0;l<n;l++){
			this.constraintsRunOrder=gm.shuffle(this.constraintsRunOrder);
			this.constraintsRunOrder.forEach(function(index){
				this[index].effect();
			},this.constraints);
		}
	}

	interactionEffects(){
		var finish=false;
		this.structures.forEach(function(thisStructure,thisIndex){
			this.structures.forEach(function(thatStructure,thatIndex){
				if(thisIndex>thatIndex){
					thisStructure.interaction(thatStructure);
				}
			});
		},this);
	}

	step(){
		Object.keys(this.laws).forEach(function(law){
			if(law!=="null"){
				this.laws[law].effects();
			}
		},this)

		this.points.forEach(function(point){
			point.update_v();
		});
	}

	timeStep(){

		for(var j=0;j<this.totalRate;j++){
			for(var i=0;i<this.globalRate;i++){
				this.interactionEffects();
			}
			for(var i=0;i<this.localRate;i++){
				this.step();
				this.constraintEffects(1);
				if(this.realCenter!==null){
					var toCenter=gm.minus(this.realCenter,this.relativeCenter.findCenter());
					this.shiftScene(toCenter);
				}
			}
			this.time++;
		}
		this.relPoints.forEach(function(point){
			point.update_x();
		});
	}
}
