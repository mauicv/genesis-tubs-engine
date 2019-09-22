const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const Link = modules.getModule('Link');
const constraint = modules.getModule('Constraint');

module.exports=class joint extends constraint{
  constructor(link1,link2,degOfFreedom1,degOfFreedom2,index){
    //convention assumes that link1.to = zeroLink.to=zeroLink.from=link2.from
    //and zeroLink is of length zero.
    super(true,false,"joint",index);
    this.link1=link1;
    this.link2=link2;

    this.degOfFreedom1=degOfFreedom1;
    this.degOfFreedom2=degOfFreedom2;

    this.from=link1.belongsTo;
    this.to=link2.belongsTo;

    this.zeroLink=new Link(link1.to,link2.to,true,false);
    this.angle=this.getAngle();
    this.rigidityConstant=0.5;
  }

  getAngle(){
    return this.link2.intersectAngleTo(this.link1);
  }

  bend(deg){
    this.link1.rotAroundToBy(deg*(this.link2.length/(this.link1.length+this.link2.length)));
    this.link1.rotAroundFromBy(deg*(this.link2.length/(this.link1.length+this.link2.length)));
    this.link2.rotAroundToBy(-deg*(this.link1.length/(this.link1.length+this.link2.length)));
    this.link2.rotAroundFromBy(-deg*(this.link1.length/(this.link1.length+this.link2.length)));
  }

  effect(){
    if(this.active&&this.alive){
      this.zeroLink.effect();
      this.bend(this.rigidityConstant*(this.getAngle()-this.angle));
    }
  }
}
