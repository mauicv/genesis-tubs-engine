const modules = require('../../moduleHandler.js');

const fs = require('fs');


var SL = module.exports = {
  save: function(enviro,fileName){
    var Data = JSON.stringify(enviro,fileName);
    fs.writeFile(fileName, Data, (err) => {
  		// throws an error
  		if (err) throw err;

  		// success case, the file was saved
  		console.log('file saved!');
  	});
  },

  load: function(fileName) {
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    if (dir != '') {dir=`${dir}/`}
    var Data_string = fs.readFileSync(`${dir}${fileName}`,  'utf8');
    return this.parse(Data_string)
  },

  parse: function(Data_string){
    const pl = modules.getModule('SpaceTime');
    const builder = modules.getModule('Builder');
    const Features = modules.getModule('featureInstances');
    const Laws = modules.getModule('lawInstances');
    data = JSON.parse(Data_string);
    build = new builder();

    data.points.forEach(function(point){
      if(point.type=="point"){
        build.addPoint(point.x);
      }
    });

    data.convexSets.forEach(function(convexSet){
      var convexSetPoints=convexSet.pointIndices.map(pointIndex=>build.environment.points[pointIndex]);
      build.addConvexSet(convexSetPoints);
    });


    data.constraints.forEach(function(constraint){
       if(constraint.type=="glue"){
         var convexSet1=build.environment.convexSets[constraint.from];
         var convexSet2=build.environment.convexSets[constraint.to];
         build.addGlueBetweenConvexSets(convexSet1,convexSet2);
       }else if(constraint.type=="joint"){
         var convexSet1=build.environment.convexSets[constraint.from];
         var convexSet2=build.environment.convexSets[constraint.to];
         build.addJointBetweenConvexSets(convexSet1,convexSet2);
       }else if(constraint.type=="beam"){
         build.addBeam(build.environment.points[constraint.from],build.environment.points[constraint.to],
             constraint.forceUpperBound,constraint.forceLowerBound,
             constraint.compLowerBound,constraint.resistance);
       }
    })

    data.structures.forEach(function(structure){
      var elements=structure.elements.map(index=>build.environment.convexSets[index]);
      var newStructure=build.addStructure(elements,[]);
    })

    data.laws.forEach(function(law){
      build.environment.laws[law]=Laws[law];
    })

    data.relPoints.forEach(function(point){
        build.addRelPoint(point.x,build.environment.constraints[point.anchor]);
    });

    data.graphics.forEach(function(line){
      build.addLine(build.environment.relPoints[line.from],build.environment.relPoints[line.to]);
    });

    build.buildOrderArrays();

    return build.environment;
  },

  loadGTBFormat: function(fileName) {
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    if (dir != '') {dir=`${dir}/`}
    var Data_string = fs.readFileSync(`${dir}${fileName}`,  'utf8');
    return this.parseGTBFormat(Data_string)
  },

  parseGTBFormat(Data_string){
    const pl = modules.getModule('SpaceTime');
    const builder = modules.getModule('Builder');
    const Features = modules.getModule('featureInstances');
    const Laws = modules.getModule('lawInstances');
    data = JSON.parse(Data_string);
    build = new builder();
    var obj_dict = {}

    Object.values(data)
      .filter((obj)=>obj.type == 'Point')
      .forEach((obj)=>obj_dict[obj.uuid] = build.addPoint(obj.x))

    var convexSets = []
    Object.values(data)
      .filter((obj)=>obj.type == 'ConvexSet')
      .forEach((obj)=>{
        var convexSetPoints = obj.lines
          .map(line_key=>data[line_key])
          .map(line=>obj_dict[line.from])
        var convexSet = build.addConvexSet(convexSetPoints);
        obj_dict[obj.uuid] = convexSet
        convexSets.push(obj)
      })

    Object.values(data)
      .filter((obj)=>obj.type == 'Beam')
      .forEach((obj)=>{
        var from = obj_dict[obj.from]
        var to = obj_dict[obj.to]
        obj_dict[obj.uuid] = build.addBeam(from, to, null, null , null);
      })

    Object.values(data)
      .filter((obj)=>obj.type == 'Joint')
      .forEach((obj)=>{
        var convexSetPair = convexSets
          .filter(set=>set.joints.includes(obj.uuid))
          .map(set=>obj_dict[set.uuid])
        obj_dict[obj.uuid] = build.addJointBetweenConvexSets(...convexSetPair);
      })

    Object.values(data)
      .filter((obj)=>obj.type == 'Glue')
      .forEach(obj=>{
        var convexSetPair = convexSets
          .filter(set=>set.glues.includes(obj.uuid))
          .map(set=>obj_dict[set.uuid])
        build.addGlueBetweenConvexSets(...convexSetPair);
      })

    Object.values(data)
      .filter((obj)=>obj.type == 'Structure')
      .forEach(obj=>{
        var convexSets = obj.sets
          .map(set=>obj_dict[set])
        var newStructure=build.addStructure(convexSets,[]);
      })

    Object.values(data)
      .filter(obj=>obj.type == 'Graphic')
      .forEach(obj=>{
        var convexSet = convexSets
          .filter(set=>set.graphics.includes(obj.uuid))
          .map(set => obj_dict[set.uuid])[0]
        var anchor = convexSet.links[0]
        obj.lines.forEach((line)=>{
          var from = build.addRelPoint(data[data[line].from].x, anchor);
          var to = build.addRelPoint(data[data[line].to].x, anchor);
          build.addLine(from, to);
        })
      })

    return build.environment;
  }
}
