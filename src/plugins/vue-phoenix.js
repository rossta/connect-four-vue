import { Socket } from 'phoenix';
import debug from 'debug';

const log = debug('app:plugins/vue-phoenix');

let Vue;

export default class VuePhoenix {
  constructor({ host } = {}) {
    this.host = host;
    this.vm = new Vue({
      data() {
        return {
          sockets: {},
          channels: {},
        };
      },
    });
  }

  get state() {
    return this.vm.$data;
  }

  get sockets() {
    return this.state.sockets;
  }

  get socket() {
    return this.sockets.default;
  }

  get channels() {
    return this.state.channels;
  }

  connect(path, params = {}) {
    const name = path.replace(/^\//, '');
    if (this.sockets[name]) return this.sockets[name];

    log('connecting...', ...params);
    const socket = new Socket(`${this.host}${path}`, { params });
    socket.connect();
    socket.onOpen(() => log('socket open'));
    socket.onError(err => log('socket error', err));

    if (!this.sockets.default) Vue.set(this.sockets, 'default', socket);
    Vue.set(this.sockets, name, socket);

    return socket;
  }

  channel(name, socket = this.sockets.default) {
    const channel = socket.channel(name);

    Vue.set(this.channels, name, channel);

    return channel;
  }
}

function install(_Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.phoenix !== undefined) {
        this._phoenixRoot = this;
        this._phoenix = this.$options.phoenix;
      } else {
        this._phoenixRoot = (this.$parent && this.$parent._phoenixRoot) || this;
      }
    },
  });

  Object.defineProperty(Vue.prototype, '$phoenix', {
    get() {
      return this._phoenixRoot._phoenix;
    },
  });
}

VuePhoenix.install = install;
