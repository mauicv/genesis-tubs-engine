const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');

exports.jointTest= function(joint){
  //check see if joint is fully extended and if so constrain/bounce
}

exports.convexTest= function(A,B){
  //computes collision between two convex sets each given as an array of there edge links.
  //shuffle the order of A in order to ensure flat edge sliding infractions don't occur

  A=gm.shuffleStart(A);
  B=gm.shuffleStart(B);

  var report1=XgivenW(A,B);
  var report2=XgivenW(B,A);

  if(report1.depth<report2.depth){
    return report1;
  }else{
    return report2;
  }
}

function W_max(pointInB,edgesInA){
  var temp=0;

  var wReport ={
    "type":"c2c",
    "collision":null,
    "link":null,
    "point":pointInB,
    "depth":-10000
  }

  edgesInA.forEach(function(edge){
    temp=edge.perpDistance(pointInB.x);
    if(temp>wReport.depth){
      wReport.link=edge;
      wReport.depth=temp;
    }
  });

  if(wReport.depth<0){
    wReport.collision=true;
  }

  return wReport;
}

function Xgivenw(pointsInB,edgeInA){

  var eReport={
    "type":"c2c",
    "collision":null,
    "link":edgeInA,
    "points":pointsInB,
    "depth":10
  }

  eReport.points=eReport.points.filter(point=>edgeInA.perpDistance(point.from.x)<0);

  return eReport;
}

function XgivenW(pointsInB,edgesInA){
  var wReport=W_max(pointsInB[0].from,edgesInA);
  var eReport;
  if(wReport.collision){
    return wReport;
  }else{
    eReport=Xgivenw(pointsInB,wReport.link);
    if(eReport.points.length==0){
      if(!wReport.collision){
        wReport.collision=false;
      }
      return wReport;
    }else{
      return XgivenW(eReport.points,edgesInA);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.xInB= function(x,B){
  var d_max=-10000;
  var d=0;
  B.forEach(function(link){
    d=link.perpDistance(x);
    if(d>d_max){
      d_max=d;
    }
  });

  return d_max;
}

exports.xToB= function(point,B){

  var report ={
    "link":null,
    "point":point,
    "depth":-10000
  }

  var d=0;
  B.forEach(function(link){
    d=link.perpDistance(point.x);
    if(d>report.depth){
      report.depth=d;
      report.link=link;
    }
  });
  report.type="p2c"
  return report;
}
