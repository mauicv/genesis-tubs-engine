//library of general functions
var GM = module.exports = {
  sigma: function(x,d_1,y,d_2,z){
    return this.dot(this.dev(this.minus(x,y),d_1),this.dev(this.perp(this.minus(z,y)),d_2));
  },

  shift_mod: function(n){
    let j = function(i){
      if(i>n-1){
        return i-n;
      }else if(i<0){
        return i+n;
      }else{
        return i;
      }
    }
    return j;
  },

  lowerBound: function(d){
    return d;
    if(d<0.1){
      return 0.1;
    }else{
      return d;
    }
  },

  upperBound: function(d){

    const upperBound=1;
    if(d>upperBound){
      return upperBound;
    }else if(d<-upperBound){
      return -upperBound;
    }else{
      return d;
    }
  },

  norm: function(v){
		var d=this.size(v,[0,0]);
		if (d>0.1){
		    return [v[0]/d,v[1]/d];
		}else{
		    return [0,0];
		}
	},

	pos: function(x){
		if(x>0){
			return x;
		}else{
			return -x;
		}
	},

  vectPos: function(x){
    x.forEach(function(value,i){
      if(value>0){
        x[i]=value;
      }else{
        x[i]=-value;
      }
    });
    return x;
  },

	sign: function(x){
		if(x>0){
			return 1;
		}else if(x<0){
			return -1;
		}
		return 0;
	},

  dot: function(x,y){
    return x[0]*y[0]+x[1]*y[1];
  },

  add: function(x,y){
    return [x[0]+y[0],x[1]+y[1]];
  },

  perp: function(x){
    return [-x[1],x[0]];
  },

  minus: function(x,y){
    return [x[0]-y[0],x[1]-y[1]];
  },

  len: function(x){
    return Math.sqrt(this.dot(x,x));
  },

  size: function(x,y){
    var v= this.minus(x,y);
    return Math.sqrt(this.dot(v,v));
  },

  dev: function(x,d){
    return [x[0]/d,x[1]/d];
  },

  mult: function(x,d){
    return [x[0]*d,x[1]*d];
  },

  multVec: function(x,v){
    return [x[0]*v[0],x[1]*v[1]];
  },

  neg: function(x){
    return [-x[0],-x[1]];
  },

  mod: function(n, m){
      return ((n % m) + m) % m;
  },

  rot(deg,vector){
    return [Math.cos(deg)*vector[0]-Math.sin(deg)*vector[1],Math.sin(deg)*vector[0]+Math.cos(deg)*vector[1]]
  },

  clockwiseAngleBetween(v,w){
    //closwise angle from v to w.
    var lenProduct=this.len(v)*this.len(w);
    var dotProduct= this.dot(v,w);
    var angleBetween= Math.acos(dotProduct/lenProduct);
    if(this.dot(this.perp(v),w)<0){
      return 2*Math.PI- angleBetween;
    }else{
      return angleBetween;
    }
  },

  everySecond: function(list){
    var newList=[];
    for(var i=0;i<Math.ceil(list.length/2);i++){
      newList.push(list[2*i]);
    }
    return newList;
  },

  shuffle: function(a){
    //Fisher–Yates shuffle
    var temp;
    var j;
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*i);
      temp=a[j];
      a[j]=a[i];
      a[i]=temp;
    }

    return a;
  },

  shuffleStart: function(a){
    var j=Math.floor(Math.random()*a.length);
    var aNew=[];

    var temp;
    for(var i=0;i<a.length;i++){
      aNew[i]=a[j];
      j=(j+1)%a.length;
    }

    return aNew;
  },

  max: function(arr){
    var max;
    arr.forEach(function(a){
      if(max<a||max==undefined){
        max=a;
      }
    });
    return max;
  },

  min: function(arr){
    var min;
    arr.forEach(function(a){
      if(min>a||min==undefined){
        min=a;
      }
    });
    return min;
  },

  getIntListBounds: function(list){
    var max=list[0];
		var min=list[0];
		list.forEach(function(element){
			if(element>max){
				max=element;
			}else if(element<min){
				min=element;
			}
		})
    return [min,max];
  },

  getLineIntersections(p1,p2,p3,p4){

    var report={
      "p":[],
      "intersection":false,
      "t1":0,
      "t2":0
    }

    var t1Top=(p3[1]-p4[1])*(p1[0]-p3[0])+(p4[0]-p3[0])*(p1[1]-p3[1]);
    var t2Top=(p1[1]-p2[1])*(p1[0]-p3[0])+(p2[0]-p1[0])*(p1[1]-p3[1]);
    var denom=(p4[0]-p3[0])*(p1[1]-p2[1])-(p1[0]-p2[0])*(p4[1]-p3[1]);

    if(denom==0){
      report.intersection=false;
      return report;
    }else{
      var t1=t1Top/denom;
      var t2=t2Top/denom;
      report.t1=t1;
      report.t2=t2;
      report.p=this.add(p1,this.mult(this.minus(p2,p1),t1));
      if(t1>0&&t1<1&&t2>0&&t2<1){
        report.intersection=true;
        return report;
      }else{
        report.intersection=false;
        return report;
      }
    }
  }
}
