
exports.getModule = function(name) {
  if(name=="Builder"||name=="SL"){
    return require(__dirname + '/Engine/Construction/' + name);
  }else if(name=="AngleLink"||name=="Beam"||name=="Constraint"||
    name=="Glue"||name=="Joint"||name=="Link"){
      return require(__dirname + '/Engine/Constraints/' + name);
  }else if(name=="Feature"||name=="featureInstances"){
    return require(__dirname + '/Engine/Features/' + name);
  }else if(name=="Law"||name=="lawInstances"){
    return require(__dirname + '/Engine/Laws/' + name);
  }else if(name=="ConvexSet"||name=="Point"||name=="Primative"||
    name=="Structure"||name=="Particle"||
    name=="CollisionChecker"||name=="CollisionResponse"||name=="RelPoint"||name=="Line"){
      return require(__dirname + '/Engine/Structures/' + name);
  }else if(name=="GeneralMethods"){
    return require(__dirname + '/Engine/General/' + name);
  }else if(name=="SpaceTime"){
    return require(__dirname + '/Engine/' + name);
  }else{
    console.log("module not found");
  }
}
