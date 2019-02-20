'use strict';

module.exports = {
  namespaced: true,
  state: {
    life: 100,
    position: 256,
    sight: 3,
    hands: {
      left: null,
      right: null,
    },
    buffs: {
      power: 1,
    },
  },
  mutations: {
    hurt: function (state, qty) {
      state.life -= qty;
    },
    heal: function (state, qty) {
      state.life += qty;
    },
    wield: function (state, {hand, artifact}) {
      state.hands[hand] = artifact;
    },
    move: function (state, to) {
      state.position = to;
    },
  },
  actions: {
    wield: function (context, {hand, artifact}) {
      context.commit('wield', {hand, artifact});
    },
    approach: function (ctx, {evil, artifact}) {
      let to = ctx.rootGetters['rules/playerApproachDest'](evil, artifact);
      var cost = ctx.rootGetters['rules/playerApproachCost'](to);
      ctx.commit('move', to);
      ctx.dispatch('swarm/feed', cost, {root: true, });
    },
    apply: function (ctx, artifact) {
      let effects = ctx.rootGetters['rules/playerEffect'](artifact);
      for (let [effectType, effectValue] of Object.entries(effects)) {
        ctx.commit(effectType, effectValue);
      }

      ctx.dispatch(
        'feed',
        ctx.rootGetters['rules/applyCost'](artifact),
        {root: true, }
      );
    },
  },
};
