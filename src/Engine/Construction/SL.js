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

  load: function(fileName){

    const pl = modules.getModule('SpaceTime');
    const builder = modules.getModule('Builder');
    const Features = modules.getModule('featureInstances');
    const Laws = modules.getModule('lawInstances');

    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));

    var Data_string = fs.readFileSync(`${dir}/${fileName}`,  'utf8');
    data = JSON.parse(Data_string);
    console.log(data);
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
  }
}
