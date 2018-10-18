<template>
  <div id="app">
    <keep-alive>
       <router-view v-if="$route.meta.keepAlive"> </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
  </div>
</template>

<script>
export default {
  name: "app",

  data() {
    return {

    };
  },

  mounted() {

  },

  created() {
    // this.data();
  },

  methods: {
    data() {
      this.$http.post('/bch/services/pub/login/index', {

      }).then(res => {
        console.log(res)
      }).catch(err => {

      })
    }
  }
};

</script>

<style lang="scss">
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // position: relative;
}

// h1, h2 {
//   font-weight: normal;
// }

// ul {
//   list-style-type: none;
//   padding: 0;
// }

// li {
//   display: inline-block;
//   margin: 0 10px;
// }

// a {
//   color: #42b983;
// }
</style>
