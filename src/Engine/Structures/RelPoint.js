const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const primative=modules.getModule('Primative');

module.exports= class relPoint extends primative{

	constructor(x,index,anchor){
		super(index);
		this.x=x.slice(0)
		this.anchor=anchor;
		this.xRelToAnchor=[-anchor.horiDistance(x),-anchor.perpDistance(x)];
	}

	toJSON(){
		var data={
				"type":"relPoint",
				"index":this.index,
				"x":this.x,
				"anchor":this.anchor.index
			};
			return data;
	}

	update_x(){
		var vector = gm.add(gm.mult(this.anchor.vectorNorm(),this.xRelToAnchor[0]),gm.mult(this.anchor.perpVectorNorm(),this.xRelToAnchor[1]));
		this.x=gm.add(this.anchor.from.x,vector);
	}

	update_x_xd(xd){
		this.x=gm.add(this.x,xd);
	}

	setLocation(to){
		this.x=to;
	}

	fixTo(structure){
		this.anchor=structure.elements[0].links[0];
		this.xRelToAnchor=[-this.anchor.horiDistance(this.x),-this.anchor.perpDistance(this.x)];
	}
}
