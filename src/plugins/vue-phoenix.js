import { Socket } from 'phoenix';
import debug from 'debug';

const log = debug('app:plugins/vue-phoenix');

let Vue;

export default class VuePhoenix {
  constructor({ host } = {}) {
    log('initializing VuePhoenix');
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

  get channels() {
    return this.state.channels;
  }

  get socket() {
    return this.sockets.default;
  }

  connect(path, params = {}) {
    return new Promise((resolve, reject) => {
      log('connecting...', ...params);
      const socket = new Socket(`${this.host}${path}`, { params });
      socket.connect();
      socket.onError(reject);

      const name = path.replace(/^\//, '');
      Vue.set(this.sockets, name, socket);
      if (!this.sockets.default) Vue.set(this.sockets, 'default', socket);

      resolve(socket);
    });
  }

  joinChannel({ name, socket = 'default' }) {
    return new Promise((resolve) => {
      const channel = this.sockets[socket].channel(name);

      channel.join()
        .receive('ok', response => log(`success: joined ${name}`, response))
        .receive('error', error => log('error:', error));

      Vue.set(this.channels, name, channel);

      resolve(channel);
    });
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
