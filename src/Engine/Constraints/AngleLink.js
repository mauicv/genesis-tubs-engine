const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const Link = modules.getModule('Link');
const constraint = modules.getModule('Constraint');


module.exports=class angleLink extends constraint{
  constructor(link1,link2,index){
    super(true,false,"angleLink",index);
    this.link1=link1;
    this.link2=link2;

    this.angle=this.getAngle();
    this.rigidityConstant=0.1;
  }

  getAngle(){
    return gm.clockwiseAngleBetween(this.link1.vector(),gm.neg(this.link2.vector()))
  }

  bend(deg){
    this.link1.rotAroundToBy(deg*(this.link2.length/(this.link1.length+this.link2.length)));
    this.link1.rotAroundFromBy(deg*(this.link2.length/(this.link1.length+this.link2.length)));
    this.link2.rotAroundToBy(-deg*(this.link1.length/(this.link1.length+this.link2.length)));
    this.link2.rotAroundFromBy(-deg*(this.link1.length/(this.link1.length+this.link2.length)));
  }

  effect(){
    if(this.active&&this.alive){
      this.bend(this.rigidityConstant*(this.getAngle()-this.angle));
    }
  }
}
