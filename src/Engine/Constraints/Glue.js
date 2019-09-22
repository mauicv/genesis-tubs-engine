const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const Link = modules.getModule('Link');
const constraint = modules.getModule('Constraint');

module.exports=class glue extends constraint{
  constructor(linkA,linkB,index){
    super(true,false,"glue",index)
    //takes two oppositly oriented links and glues them
    this.link1=new Link(linkA.from,linkB.to,true,false);
		this.link2=new Link(linkA.to,linkB.from,true,false);

    this.from=linkA.belongsTo;
    this.to=linkB.belongsTo;

    this.fragilityConstant=0.5;
    this.fragile=true;
  }

  effect(){
    if(this.active&&this.alive){
      this.link1.effect();
      this.link2.effect();
    }
  }

  on(){}//overrides super on
}
