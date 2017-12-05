import Vue from 'vue';
import Lobby from '@/components/Lobby';

describe('Lobby.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Lobby);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.hello h1').textContent)
    .toEqual('Welcome to Connect Four');
  });
});
