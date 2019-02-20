'use strict';
const uuidv4 = require('uuid/v4');
const Vue = require('vue');


module.exports = {
  namespaced: true,
  state: {
    evils: {},
  },
  mutations: {
    spawn: function (state, {collection, id, position, payload}) {
      payload.position = position;
      payload.id = id;
      payload.collection = collection;
      payload.cycles = 0;
      Vue.set(state.evils, id, payload);
    },
    hurt: function (state, {evil, qty}) {
      state.evils[evil].life -= qty;
      console.log('hurted :', qty, state.evils[evil].life);
    },
    heal: function (state, {evil, qty}) {
      state.evils[evil].life += qty;
    },
    feed: function (state, {evil, cyclesCount}) {
      state.evils[evil].cycles += cyclesCount;
    },
  },
  actions: {
    apply: function (ctx, {evil, artifact}) {
      // fetch and apply artifact effects
      let effects = ctx.rootGetters['rules/evilEffect'](
        evil,
        artifact
      );
      for (let [effectType, qty] of Object.entries(effects)) {
        ctx.commit(effectType, {evil, qty});
      }

      let evilState = ctx.state.evils[evil];
      // if evil is dead try to drop a crate
      if (evilState.life <= 0) {
        ctx.dispatch('drop', evil);
      }

      // apply cost of action
      ctx.dispatch('feed', ctx.rootGetters['rules/applyCost'](artifact));
    },
    drop: function (ctx, evil) {
      let drop = ctx.rootGetters['rules/evilDrop'](evil);
      if (drop) {
        let evilState = ctx.state.evils[evil];
        ctx.commit(
          'spawn',
          {
            collection: 'crates',
            id: uuidv4(),
            position: evilState.position,
            payload: drop,
          }
        );
      }
    },
    feed: function (ctx, cycles) {
      for (let evil of Object.keys(ctx.getters.aliveEvils)) {
        let cyclesCount = ctx.rootGetters['rules/evilFeed'](
          evil,
          cycles
        );
        ctx.commit('feed', {evil, cyclesCount});
      }
      ctx.dispatch('activate');
    },
    activate: function (ctx) {
      for (let evil of Object.keys(ctx.getters.aliveEvils)) {
        let actions = ctx.rootGetters['rules/evilAction'](evil);
        for (let [actionType, actionValue] of Object.entries(actions)) {
          ctx.dispatch(actionType, {evil, actionValue});
        }
      }
    },
  },
  getters: {
    aliveEvils: function (state) {
      let res = {};
      for (let [evilUuid, evil] of Object.entries(state.evils)) {
        if (evil.life > 0 || evil.collection === 'crates') {
          res[evilUuid] = evil;
        }
      }
      return res;
    },
    closestThings: function (state, getters, rootState) {
      let evils = getters.aliveEvils;
      let playerPos = rootState.player.position;

      let things = Object.values(evils);
      things.sort(function (a, b) {
        let aDist = Math.abs(a.position - playerPos);
        let bDist = Math.abs(b.position - playerPos);
        if (aDist < bDist) {
          return -1;
        } else if (aDist > bDist) {
          return 1;
        } else {
          return 0;
        }
      });

      return things.map(el => el.id);
    },
  },
};
