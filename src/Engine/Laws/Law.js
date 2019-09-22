const modules = require('../../moduleHandler.js');
const ConvexSet = modules.getModule('ConvexSet');
const Particle = modules.getModule('Particle');

module.exports= class law{
  //A law is defined on a set of structures within the physical enviroment and on
  //each step will act on those specified structures. An example would be a gravitational
  //law which would effect all structures with mass.

	constructor(name){
      this.name=name;
      this.active=true;
      this.structures=[];
			this.environment=null;
  }

  toJSON(){
		var data={
      "name":this.name,
			"structures":this.structures
		};

		return data;
	}

  applyToAllPoints(applyLaw){
    //applyLaw should be a function that takes a point and updates it
    this.structures.forEach(function(structure){
      structure.elements.forEach(function(element){
        if(element instanceof ConvexSet){
          element.links.forEach(function(link){
            applyLaw(link.from)
          })
        }else if(element instanceof Particle){
          applyLaw(element);
        }
      })
    })
  }

	applyToStructures(applyLaw){
		this.structures.forEach(function(structure){
			applyLaw(structure);
		})
	}
}
