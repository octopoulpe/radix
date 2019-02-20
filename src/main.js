'use strict';

var Vue = require('vue');
var Vuex = require('vuex');
var Vuetify = require('vuetify');

Vue.use(Vuex);
Vue.use(Vuetify);

var RootComponent = require('./components/root.vue');
var rootStore = require('./store/root.js');


window.onload = function () {
  var GameRoot = Vue.component('bdcRoot', {
    render: function (createElement) {
      return createElement(RootComponent);
    },
    store: rootStore,
  });
  var gameRoot = new GameRoot();
  gameRoot.$mount('#game');
};
