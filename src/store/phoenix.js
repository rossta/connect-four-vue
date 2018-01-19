import { Socket } from 'phoenix';
import debug from 'debug';

const log = debug('app:plugins/vue-phoenix');

class Phoenix {
  constructor({ host } = {}) {
    this.host = host;

    this.channels = new Map();
  }

  connect(path, params = {}) {
    log('connecting...', ...params);
    const socket = new Socket(`${this.host}${path}`, { params });

    return new Promise((resolve, reject) => {
      socket.connect();
      socket.onOpen(() => {
        log('socket open');
        this.socket = socket;
        resolve(socket);
      });
      socket.onError((err) => {
        log('socket error', err);
        reject();
      });
    });
  }

  channel(name) {
    return this.channels.get(name) || this.socket.channel(name);
  }
}

export default new Phoenix({
  host: process.env.SOCKET_URL,
});
