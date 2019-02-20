'use strict';

var Vuex = require('vuex');
var player = require('./player');
var swarm = require('./swarm');
var deck = require('./deck');
var rules = require('./rules');
// var world = require('./world');

var store = new Vuex.Store({
  modules: {player, swarm, deck, rules, },
  actions: {
    wield: function (context, {hand, artifact}) {
      context.dispatch('deck/pick', artifact);
      context.dispatch('player/wield', {hand, artifact});
    },
    apply: function (context, {hand, evil}) {
      var artifact = context.state.player.hands[hand];
      if (evil) {
        context.dispatch('player/approach', {evil, artifact});
        context.dispatch('swarm/apply', {evil, artifact});
      } else {
        context.dispatch('player/apply', artifact);
      }
      context.dispatch('deck/decrement', artifact);
    },
    // feed: function (context, cyclesCount) {
    //   context.dispatch('badguy/feed', cyclesCount);
    //   context.dispatch('badguy/activate');
    // },
    // stash: function (context, hand) {
    //   context.dispatch('player/stash', hand);
    // },
    // unstash: function (context, hand) {
    //   context.dispatch('player/unstash', hand);
    // },
  },
});

module.exports = store;
