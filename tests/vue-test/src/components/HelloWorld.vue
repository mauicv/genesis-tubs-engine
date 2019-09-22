<template>
  <div>
    <h1>{{ msg }}</h1>
    <canvas id="TestCanvas"></canvas>
  </div>
</template>

<script>

import engine from '../sim/renderer.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'genesis-tubs-engine vue test'
    }
  },
  mounted(){
    engine.play()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
