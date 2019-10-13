const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const primative=modules.getModule('Primative');

module.exports= class point extends primative{

	constructor(x,index,active) {
		super(index);
		this.x=x.slice(0);
		this.x_old=x.slice(0);
	}

	toJSON(){
		var data={
				"type":"point",
				"x":this.x,
				"x_old":this.x_old,
				"active":this.active,
				"index":this.index,
			};
		return data;
	}

	copy(index){
		var pointCopy= new point(this.x,index,this.active);
		return pointCopy;
	}

	update_v(){
		if(this.active&&this.alive){
			var v=gm.minus(this.x,this.x_old);
			this.x=gm.add(this.x,v);
			this.x_old=gm.add(this.x_old,v);
		}
	}

	update_x_xd(d){
		if(this.active&&this.alive){
			this.x=gm.add(this.x,d);
		}
	}

	update_x_old_xd(d){
		if(this.active&&this.alive){
			this.x_old=gm.add(this.x_old,d);
		}
	}

	findCenter(){
		return this.x
	}

	move(d){
		this.x[0]=this.x[0]+d[0];
		this.x[1]=this.x[1]+d[1];
		this.x_old[0]=this.x_old[0]+d[0];
		this.x_old[1]=this.x_old[1]+d[1];
	}

	setLocation(to){
		this.x=to;
	}

	setLocationOld(to){
		this.x_old=to;
	}

	setStatic(){
		this.active=false;
	}

	setActive(){
		this.active=true;
	}

	rotAround(point,deg){
		//rotate around point
		if(this.active&&this.alive){
			var v=gm.rot(deg,gm.minus(this.x,point.x));
			this.setLocation(gm.add(point.x,v));
		}
	}

	distanceFrom(x){
		return gm.size(x,this.x);
	}

	kill(){
		this.alive=false;
	}
}
