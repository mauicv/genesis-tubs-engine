const modules = require('../../moduleHandler.js');
const gm = modules.getModule('GeneralMethods');
const point=modules.getModule('Primative');

module.exports= class line{
	constructor(x,y,index) {
		this.from=x;
    this.to=y;
    this.visable=true;
	}

  toJSON(){
		var data={
				"from":this.from.index,
        "to":this.to.index,
				"index":this.index
			};
			return data;
	}
}
