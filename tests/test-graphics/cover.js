
const engine = require('../../src/index.js')
const gm = engine.GeneralMethods;


class Cover {
  constructor({set, size}) {
    this.set = set

    var center = set.findCenter();
    var xAxisValues = this.set.getPoints()
      .map(point=>point.x[0] - center[0])
    var yAxisValues = this.set.getPoints()
      .map(point=>point.x[1] - center[1])

    this.boundary = new Rect(
      Math.max(...xAxisValues),
      Math.max(...yAxisValues),
      set.findCenter()
    )

    this.size = size
  }

  generateCover(){
    var nx = Math.floor((2*this.boundary.rx)/this.size)
    var ny = Math.floor((2*this.boundary.ry)/this.size)
    var cover = []
    var x_start = this.boundary.c[0] - this.boundary.rx + this.size
    var y_start = this.boundary.c[1] - this.boundary.ry + this.size

    for (var i = 0; i < nx; i++) {
      for (var j = 0; j < ny; j++) {
        cover.push(new Rect(
          this.size,
          this.size,
          [
            x_start + i * this.size,
            y_start + j * this.size
          ]
        ))
      }
    }
    return cover
  }

}

class Rect {
  constructor(rx,ry,c){
    this.c = c
    this.rx = rx
    this.ry = ry
  }

  convertToCover(size){
    return new Cover({set: this, size: size})
  }

  findCenter(){
    return this.c
  }

  getPoints(){
    return [
      {x: gm.add(this.c, [this.rx, this.ry])},
      {x: gm.add(this.c, [-this.rx, this.ry])},
      {x: gm.add(this.c, [-this.rx, -this.ry])},
      {x: gm.add(this.c, [this.rx, -this.ry])},
    ]
  }

  getBoundaryPath(){
    return  [
      {
        from: gm.add(this.c, [this.rx, this.ry]),
        to: gm.add(this.c, [-this.rx, this.ry])
      },
      {
        from: gm.add(this.c, [-this.rx, this.ry]),
        to: gm.add(this.c, [-this.rx, -this.ry])
      },
      {
        from: gm.add(this.c, [-this.rx, -this.ry]),
        to: gm.add(this.c, [this.rx, -this.ry])
      },
      {
        from: gm.add(this.c, [this.rx, -this.ry]),
        to: gm.add(this.c, [this.rx, this.ry])
      }
    ]
  }
}


module.exports = Cover
