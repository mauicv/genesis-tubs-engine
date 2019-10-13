
const engine = require('../../src/index.js')
const gm = engine.GeneralMethods;

module.exports = {
  moveSet: function(set, v){
    let points = set.getPoints()
    points.forEach(point=>point.x = gm.add(point.x, v))
    points.forEach(point=>point.x_old = gm.add(point.x_old, v))
  },

  moveTo: function(set, x){
    let points = set.getPoints()
    let center = set.findCenter()
    let v = gm.minus(x, center)
    points.forEach(point=>point.x = gm.add(point.x, v))
    points.forEach(point=>point.x_old = gm.add(point.x_old, v))
  },

  scale: function(set, v){
    let currentLocation = set.findCenter()
    this.moveTo(set, [0,0])
    let points = set.getPoints()
    points.forEach(point=>point.x = gm.multVec(point.x, v))
    points.forEach(point=>point.x_old = gm.multVec(point.x_old, v))
    this.moveTo(set, currentLocation)
  },

  rotate: function(set, deg){
    let currentLocation = set.findCenter()
    this.moveTo(set, [0,0])
    let points = set.getPoints()
    points.forEach(point=>point.x = gm.rot(deg, point.x))
    points.forEach(point=>point.x_old = gm.rot(deg, point.x_old))
    this.moveTo(set, currentLocation)
  }
}
