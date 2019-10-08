module.exports = class constraint{
  constructor(active,visable,type,index){
    this.index=index;
    this.belongsTo=null;
    this.active=active;
    this.alive=true;
    this.visable=visable;
    this.type=type;

    this.from=null;
    this.to=null;
  }

  toJSON(){
    var data={
        "type": this.type,
        "from": null,
        "to": null
      };

    if( this.from !== null ){
      data.from=this.from.index;
      data.to=this.to.index;
    } else {
      data.from=this.from;
      data.from=this.to;
    }
    return data;
  }

  on(){
    this.active=true;
  }

  off(){
    this.active=false;
  }

  kill(){
    this.alive=false;
  }
}
