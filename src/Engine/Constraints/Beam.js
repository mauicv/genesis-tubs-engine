const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const link = modules.getModule('Link');

const BOUNDS=1;

module.exports= class beam extends link{
  constructor(from,to,forceUpperBound,forceLowerBound,compLowerBound,resistance,index){
    super(from,to,true,false,index);
    this.type="beam";
    this.forceUpperBound=4*BOUNDS;
    this.forceLowerBound=-BOUNDS;
    this.compLowerBound=this.length-100;
    this.resistance=0.025;
    this.springConstant=0.25;
  }

  toJSON(){
		var data={
        "type":"beam",
				"from":this.from.index,
        "to":this.to.index,
        "forceUpperBound":this.forceUpperBound,
        "forceLowerBound":this.forceLowerBound,
        "compLowerBound":this.compLowerBound,
        "resistance":this.resistance
			};
      return data;
	}

  effect(){
    if(this.active&&this.alive){
      var s=gm.minus(this.to.x,this.from.x);
      var dotProduct=gm.dot(s,s);
      if(dotProduct>0){
        s=gm.mult(s,0.5-(this.length*this.length/(dotProduct+this.length*this.length)));
        this.from.update_x_xd(s);
        this.to.update_x_xd(gm.neg(s));
      }
    }
  }
}
