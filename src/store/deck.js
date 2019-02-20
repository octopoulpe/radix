'use strict';

var Vue = require('vue');

module.exports = {
  namespaced: true,
  state: {
    drawerMaxSize: 3,
    poolMaxSize: 3,
    artifacts: {},
    pool: [],
    drawer: [],
  },
  mutations: {
    draw: function (state) {
      if (!state.pool.length) {
        return;
      }
      let randIdx = Math.floor(Math.random() * state.pool.length);
      let itemToSwap = state.pool[randIdx];
      state.pool.splice(randIdx, 1);
      state.drawer.push(itemToSwap);
    },
    consume: function (state, idx) {
      // var itemToWield = state.drawer[idx];
      state.drawer.splice(idx, 1);
    },
    plant: function (state, {id, artifact}) {
      artifact.id = id;
      Vue.set(state.artifacts, id, artifact);
      state.pool.push(id);
    },
  },
  actions: {
    pick: function (context, id) {
      let idx = context.state.drawer.indexOf(id);
      if (idx === null) {
        console.log('no such artifact id:', id);
      }
      context.commit('consume', idx);
      if (context.state.drawer.length < context.state.drawerMaxSize) {
        context.commit('draw');
      }
    },
    spawn: function (context, artifact) {
      if (context.state.pool.length < context.state.poolMaxSize) {
        context.commit('plant', artifact);
      }
      if (context.state.drawer.length < context.state.drawerMaxSize) {
        context.commit('draw');
      }
    },
    decrement: function (context, artifact) {
      console.log('decrementing artifact:', artifact);
    },
  },
};
