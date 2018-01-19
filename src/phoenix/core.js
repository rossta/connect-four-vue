import { Socket } from 'phoenix';
import debug from 'debug';

const log = debug('app:phoenix/phoenix');

export default class Phoenix {
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
    let ch = this.channels.get(name);
    if (!ch) {
      log('opening new channel', name);
      ch = this.socket.channel(name);
      this.channels.set(name, ch);
    }
    return ch;
  }
}
