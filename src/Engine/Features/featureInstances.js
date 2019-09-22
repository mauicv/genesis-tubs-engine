//rule between two strutures...(Interaction rule...)

const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const cc = modules.getModule('CollisionChecker');
const cr = modules.getModule('CollisionResponse');
const Feature = modules.getModule('Feature');

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
var features = module.exports = {
	mass: (function(){
			var mass = new Feature("mass");
	    mass.interaction= function(structure1,structure2){
				//var reports = mass.multiScan(structure1,structure2,0);
				var reports = structure1.checkProximityTo(structure2,0)
				reports.forEach(function(report){
					if(report.type=="c2c"||report.type=="p2c"){
						cr.responseWithStickyRisistance(report,0.1,0.1);
					}else if(report.type="p2p"){
						cr.particleResponse(report);
					}
				});
			}
		return mass;
	})(),

	earthed: (function(){
			var earthed = new Feature("earthed");
	    earthed.interaction= function(structure1,structure2){
				if(structure1.name=="earth"||structure2.name=="earth"){
					var reports = earthed.multiScan(structure1,structure2,0);
					reports.forEach(function(report){
						if(report.type=="c2c"||report.type=="p2c"){
							cr.classicalResponse(report);
						}else if(report.type="p2p"){
							cr.particleResponse(report);
						}
					});
				}
			}
		return earthed;
	})(),

	resistantMass: (function(){
			var mass = new Feature("resistantMass");
			mass.interaction= function(structure1,structure2){
				var reports = mass.multiScan(structure1,structure2,0);
				reports.forEach(function(report){
					if(report.type=="c2c"||report.type=="p2c"){
						cr.responseWithRisistance(report,0.1);
					}else if(report.type="p2p"){
						cr.particleResponse(report);
					}
				});
			}
		return mass;
	})(),

	stickyResistantMass: (function(){
			var mass = new Feature("resistantMass");
			mass.interaction= function(structure1,structure2){
				var reports = mass.multiScan(structure1,structure2,1);
				reports.forEach(function(report){
					if(report.type=="c2c"||report.type=="p2c"){
						cr.responseWithStickyRisistance(report,0.01,0.01);
					}else if(report.type=="p2p"){
						cr.particleResponse(report);
					}
				});
			}
		return mass;
	})(),

	exploding: (function(){
			var fragile = new Feature("exploding");
			fragile.interaction= function(structure1,structure2){
				var reports = fragile.multiScan(structure1,structure2,1);
				reports.forEach(function(report){
						if(report.depth<-6){
							[structure1,structure2].forEach(function(structure){
								var builder=structure.environment.builder;
								structure.elements.forEach(function(element){
									element.glues.forEach(function(glue){
										glue.off();
									})
									var features= [];
									structure.features.forEach(function(feature){
										if(feature.name!="exploding"){
											features.push(feature);
										}
									})
									builder.addStructure([element],features);
								})
								builder.deleteStructure(structure);
							})
						}
				});

			}
		return fragile;
	})()
}
