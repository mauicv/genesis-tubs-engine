const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const cc = modules.getModule('CollisionChecker');
const Point = modules.getModule('Point');
const primative = modules.getModule('Primative');
const particle = modules.getModule('Particle');

module.exports= class convexSet extends primative{
	constructor(links,angleLinks,index){
		super(index);

		this.links=links;
		this.angleLinks=angleLinks;
    this.glues=[];
		this.joints=[];
		this.graphics=[];
		this.belongsTo=[];


		this.links.forEach(function(link){
			link.belongsTo=this;
		},this);

		this.fixAntiClockwiseOrientaion();
	}

	toJSON(){
		var data={
				"pointIndices":this.links.map(link=>link.from.index)
			};

			return data;
	}

	reverseOrient(){
		var temp=0;
		this.links.forEach(function(link){
			temp=link.from;
			link.from=link.to;
			link.to=temp;
		});

		var numLinks=this.links.length;
		var tempLinks=this.links.slice();

		tempLinks.forEach(function(link,index){
			this.links[numLinks-index-1]=link;
		},this);
	}

	findCenter(){
		var center=[0,0];
		this.links.forEach(function(link){
			center=gm.add(link.from.x,center);
		})
		return gm.dev(center,this.links.length);
	}

	distanceFrom(x){
		return cc.xInB(x,this.links);
	}

	fixAntiClockwiseOrientaion(){
		if(this.links[0].perpDistance(this.links[1].to.x)>0){
			this.reverseOrient();
		}
	}

	fix(){
		this.links.forEach(function(link){
			link.from.setStatic();
		})
	}

	kill(){
		//note that this method doesn't currently kill angleLinks associated to convex set...
		this.links.forEach(function(link){
			link.kill();
		})
		this.glues.forEach(function(glue){
			glue.kill();
		})
		this.joints.forEach(function(joint){
			joint.kill();
		})
	}

	getPointIndexBounds(){
		var MinMax = gm.getIntListBounds(this.links.map(link=>link.from.index));
		return MinMax
	}

	getLinkIndexBounds(){
		var MinMax = gm.getIntListBounds(this.links.map(link=>link.index));
		return MinMax
	}

	getAngleLinkIndexBounds(){
		var MinMax = gm.getIntListBounds(this.angleLinks.map(angleLink=>angleLink.index));
		return MinMax
	}

	checkProximityTo(primative){
		if(primative instanceof convexSet){
			return cc.convexTest(this.links,primative.links)
		}else if(primative instanceof particle){
			return cc.xToB(primative,this.links);
		}
	}

	nudge(v){
		this.links.forEach(function(link){
			link.from.update_x_xd(v)
		})
	}
}
