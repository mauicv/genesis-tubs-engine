const modules = require('./moduleHandler.js')

const names=[
  'SpaceTime',
  'AngleLink',
  'Beam',
  'Constraint',
  'Glue',
  'Joint',
  'Link',
  'Builder',
  'SL',
  'Feature',
  'featureInstances',
  'GeneralMethods',
  'Law',
  'lawInstances',
  'CollisionChecker',
  'CollisionResponse',
  'ConvexSet',
  'Line',
  'Particle',
  'Point',
  'Primative',
  'RelPoint',
  'Structure',
]

names.forEach(function(name){
  module.exports[name] = modules.getModule(name)
})
