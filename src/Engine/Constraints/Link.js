const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const constraint = modules.getModule('Constraint');

module.exports= class link extends constraint{
  constructor(from,to,active,visable,index){
    super(active,visable,"link",index);

    this.from=from;
    this.to=to;

    this.length=gm.size(from.x,to.x);
    this.springConstant=0.05; //set to 0.5 for max rigidity
  }

  toJSON(){
    var data={
      "index":this.index
    }
    return data;
  }

  perpDistance(x){
    return gm.dot(gm.minus(x,this.from.x),gm.dev(gm.perp(gm.minus(this.to.x,this.from.x)),this.length));
  }

  horiDistance(x){
    return gm.dot(gm.minus(x,this.from.x),gm.dev(gm.minus(this.to.x,this.from.x),this.length));
  }

  distanceFrom(x){
    return gm.len(this.perpDistance(x),this.horiDistance(x));
  }

  intersectAngleTo(link){
    var lenProduct=this.getLength()*link.getLength();
    var dotProduct= gm.dot(gm.minus(link.to.x,link.from.x),gm.minus(this.to.x,this.from.x));
    var ratio=dotProduct/lenProduct;


    //this is a hacky fix
    if(ratio>1){
      ratio=1;
    }else if(ratio<-1){
      ratio=-1;
    }

    if(this.perpDistance(link.from.x)>0){
      return Math.acos(ratio);
    }else{
      return 2*Math.PI-Math.acos(ratio);
    }
  }

  vectorNorm(){
    return gm.dev(gm.minus(this.from.x,this.to.x),this.length);
  }

  vector(){
    return gm.minus(this.to.x,this.from.x);
  }

  perpVectorNorm(){
    return gm.dev(gm.perp(gm.minus(this.from.x,this.to.x)),this.length);
  }

  rotAroundFromBy(deg){
    var v=gm.rot(deg,gm.minus(this.to.x,this.from.x));
    this.to.setLocation(gm.add(this.from.x,v));
  }

  rotAroundToBy(deg){
    var v=gm.rot(deg,gm.minus(this.from.x,this.to.x));
    this.from.setLocation(gm.add(this.to.x,v));
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

  stressMeasure(){
    var s=gm.minus(this.to.x,this.from.x);
    var d=0.5*(this.length-gm.len(s));
    s=gm.mult(gm.norm(s),d);
    return [d,s];
  }

  stressResponse(s){
    this.from.update_x_xd(gm.neg(s));
    this.to.update_x_xd(s);
  }

  getLength(){
    if(this.length>0){
      var delta=gm.minus(this.from.x,this.to.x)
      return 0.5*(this.length*this.length+gm.dot(delta,delta))/this.length;
    }else{
      return gm.size(this.from.x,this.to.x);
    }
  }

  setLength(){
    this.length=gm.size(this.from.x,this.to.x);
  }

  kill(){
    this.from.kill();
    this.to.kill();
    this.alive=false;
  }
}
