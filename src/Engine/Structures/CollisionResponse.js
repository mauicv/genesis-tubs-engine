const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');

exports.wallCollisionTest=function(A,leftWall,rightWall,upWall,downWall){
  A.forEach(function(item){
    if(item.x[0]<leftWall){
      item.update_x_xd([-item.x[0]+leftWall,0]);
      item.update_x_old_xd([item.x[0]-leftWall,0]);
      return;
    }else if(item.x[0]>rightWall){
      item.update_x_xd([-item.x[0]+rightWall,0]);
      item.update_x_old_xd([item.x[0]-rightWall,0]);
      return;
    }else if(item.x[1]<upWall){
      item.update_x_xd([0,-item.x[1]+upWall]);
      item.update_x_old_xd([0,item.x[1]-upWall]);
      return;
    }else if(item.x[1]>downWall){
      item.update_x_xd([0,-item.x[1]+downWall]);
      item.update_x_old_xd([0,item.x[1]-downWall]);
      return;
    }
  });
}

exports.particleResponse= function(collisionReport,r){
    var x=collisionReport.point1.x;
    var y=collisionReport.point2.x;
    var colVector = gm.norm(gm.minus(x,y));
    //update x & y:
    var depth = Math.abs(collisionReport.depth/2)
    collisionReport.point1.update_x_xd(gm.mult(colVector,depth));
    collisionReport.point2.update_x_xd(gm.mult(colVector,-depth));
}

exports.classicalResponse= function(collisionReport){
    var x=collisionReport.point.x;
    var y=collisionReport.link.from.x;
    var z=collisionReport.link.to.x;
    var d_2=collisionReport.link.length;
    var normal = gm.perp(gm.dev(gm.minus(z,y),d_2));
    var d_1=gm.dot(gm.minus(x,y),gm.dev(gm.minus(z,y),d_2));

    //update x:
    collisionReport.point.update_x_xd(gm.mult(normal,gm.upperBound(-collisionReport.depth/2)));
    collisionReport.point.update_x_old_xd(gm.mult(normal,gm.upperBound(collisionReport.depth/2)));

    //update edge points: y,z:
    collisionReport.link.from.update_x_xd(gm.mult(normal,gm.upperBound(d_2*collisionReport.depth/gm.lowerBound(4*(d_2-d_1)))));
    collisionReport.link.from.update_x_old_xd(gm.mult(normal,gm.upperBound(-d_2*collisionReport.depth/gm.lowerBound(4*(d_2-d_1)))));
    collisionReport.link.to.update_x_xd(gm.mult(normal,gm.upperBound(collisionReport.depth*d_2/gm.lowerBound(4*d_1))));
    collisionReport.link.to.update_x_old_xd(gm.mult(normal,gm.upperBound(-collisionReport.depth*d_2/gm.lowerBound(4*d_1))));
}

exports.SCR=function(collisionReport){
  //SCR stands for Space collision repsonse
  var x=collisionReport.point.x;
  var y=collisionReport.link.from.x;
  var z=collisionReport.link.to.x;
  var d_2=collisionReport.link.length;
  var normal = gm.perp(gm.dev(gm.minus(z,y),d_2));
  var d_1=gm.dot(gm.minus(x,y),gm.dev(gm.minus(z,y),d_2));

  var vx=gm.minus(collisionReport.point.x,collisionReport.point.x_old);
  var vy=gm.minus(collisionReport.link.from.x,collisionReport.link.from.x_old);
  var vz=gm.minus(collisionReport.link.to.x,collisionReport.link.to.x_old);

  var v_incident=gm.add(gm.mult(vy,(d_1/d_2)),gm.mult(vz,(1-(d_1/d_2))));
  var vDiff=gm.add(v_incident,vx);

  return vDiff
}

exports.destroy=function(structure){
  structure.elements.forEach(function(element){
    element.glues.forEach(function(glue){
      if(Math.random()>0.5){
        glue.active=false
      }
    })
  })
  structure.environment.builder.addExplodeStucture(3,5,10,1,[0,0],0,structure.findCenter(),2,[],false)

}

exports.responseWithRisistance= function(collisionReport,resistance){
    var x=collisionReport.point.x;
    var y=collisionReport.link.from.x;
    var z=collisionReport.link.to.x;

    var d_2=collisionReport.link.length;
    var tan=gm.dev(gm.minus(z,y),d_2);
    var normal = gm.perp(tan);
    var d_1=gm.dot(gm.minus(x,y),tan);

    var vx=gm.minus(collisionReport.point.x,collisionReport.point.x_old);
    var vy=gm.minus(collisionReport.link.from.x,collisionReport.link.from.x_old);
    var vz=gm.minus(collisionReport.link.to.x,collisionReport.link.to.x_old);

    //update x:
    collisionReport.point.update_x_xd(gm.mult(normal,gm.upperBound(-collisionReport.depth/2)));
    collisionReport.point.update_x_old_xd(gm.mult(normal,gm.upperBound(collisionReport.depth/2)));
    collisionReport.point.update_x_xd(gm.mult(tan,gm.dot(vx,tan)*(-resistance)));

    //update edge points: y,z:
    collisionReport.link.from.update_x_xd(gm.mult(normal,gm.upperBound(d_2*collisionReport.depth/gm.lowerBound(4*(d_2-d_1)))));
    collisionReport.link.from.update_x_xd(gm.mult(tan,gm.dot(vy,tan)*(-resistance)));
    collisionReport.link.from.update_x_old_xd(gm.mult(normal,gm.upperBound(-d_2*collisionReport.depth/gm.lowerBound(4*(d_2-d_1)))));
    collisionReport.link.to.update_x_xd(gm.mult(normal,gm.upperBound(collisionReport.depth*d_2/gm.lowerBound(4*d_1))));
    collisionReport.link.to.update_x_xd(gm.mult(tan,gm.dot(vz,tan)*(-resistance)));
    collisionReport.link.to.update_x_old_xd(gm.mult(normal,gm.upperBound(-collisionReport.depth*d_2/gm.lowerBound(4*d_1))));
}

exports.responseWithStickyRisistance= function(collisionReport,resistance,stickyness){
  /////FOR STICkyness...
    var x=collisionReport.point.x;
    var y=collisionReport.link.from.x;
    var z=collisionReport.link.to.x;

    var d_2=collisionReport.link.length;
    var tan=gm.dev(gm.minus(z,y),d_2);
    var normal = gm.perp(tan);
    var d_1=gm.dot(gm.minus(x,y),tan);

    var vx=gm.minus(collisionReport.point.x,collisionReport.point.x_old);
    var vy=gm.minus(collisionReport.link.from.x,collisionReport.link.from.x_old);
    var vz=gm.minus(collisionReport.link.to.x,collisionReport.link.to.x_old);

    //var v_incident=gm.dot(normal,vx)+gm.dot(normal,vy)*d_2/gm.lowerBound(4*(d_2-d_1))+
    //        gm.dot(normal,vz)*d_2/gm.lowerBound(4*d_1);

    var v_incident=gm.add(gm.mult(vy,(d_1/d_2)),gm.mult(vz,(1-(d_1/d_2))));

    if(collisionReport.depth<0){
      //update x:
      collisionReport.point.update_x_xd(gm.mult(tan,gm.dot(vx,tan)*(-resistance)));

      //update edge points: y,z:
      collisionReport.link.from.update_x_xd(gm.mult(tan,gm.dot(vy,tan)*(-resistance)));
      collisionReport.link.to.update_x_xd(gm.mult(tan,gm.dot(vz,tan)*(-resistance)));


      collisionReport.point.update_x_xd(gm.mult(normal,gm.upperBound(-collisionReport.depth/4)));
      //collisionReport.point.update_x_old_xd(gm.mult(normal,gm.upperBound(collisionReport.depth/2)));
      collisionReport.link.to.update_x_xd(gm.mult(normal,gm.upperBound(d_2*collisionReport.depth/(4*gm.lowerBound(2*(d_2-d_1))))));
      //collisionReport.link.from.update_x_old_xd(gm.mult(normal,gm.upperBound(-d_2*collisionReport.depth/(2*gm.lowerBound(2*(d_2-d_1))))));
      collisionReport.link.from.update_x_xd(gm.mult(normal,gm.upperBound(d_2*collisionReport.depth/(4*gm.lowerBound(2*d_1)))));
      //collisionReport.link.to.update_x_old_xd(gm.mult(normal,gm.upperBound(-d_2*collisionReport.depth/(2*gm.lowerBound(2*d_1)))));
    }

    var vDiff=gm.len(gm.add(v_incident,vx));

    if(vDiff<0.25){
      collisionReport.point.update_x_xd(gm.mult(vx,gm.dot(vx,normal)*(-stickyness)));

      v_incident=gm.norm(v_incident);

      collisionReport.link.from.update_x_xd(gm.mult(v_incident,gm.dot(vy,v_incident)*(-stickyness)));
      collisionReport.link.to.update_x_xd(gm.mult(v_incident,gm.dot(vz,v_incident)*(-stickyness)));
    }
}
