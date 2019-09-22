const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const point=modules.getModule('Point');
const convexSet=modules.getModule('ConvexSet');

module.exports= class particle extends point{

	constructor(x,v,index,radius) {
		super(x,v,index);
		this.x=x.slice(0);
		this.x_old=gm.minus(x,v);
    this.radius=radius;
		this.belongsTo=[];
	}

	toJSON(){

	}

	checkProximityTo(primative){
		if(primative instanceof convexSet){
			return cc.xToB(primative.links,this);
		}else if(primative instanceof particle){
			return {
				"type":"p2p",
				"point1":this,
				"point2":primative,
				"depth":gm.size(this.x,primative.x)-this.radius-primative.radius
			}
		}
	}
}
