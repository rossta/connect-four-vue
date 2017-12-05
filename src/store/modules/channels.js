import debug from 'debug';
import { Socket } from 'phoenix';

import * as types from '@/store/types';

const log = debug('app:store/modules/channels');

const defaultState = {
  sockel: null,
  isLoading: true,
  channels: {},
};

const getters = {
  lobbyChannel: state => state.channels.lobby,
};

const actions = {
  connectSocket({ commit }, { id }) {
    log('connecting...');
    const socket = new Socket(`${process.env.SOCKET_URL}/socket`, {
      params: { id },
    });
    socket.connect();
    commit(types.DID_CONNECT_SOCKET, { socket });

    return Promise.resolve(socket);
  },

  joinChannel({ commit, state }, { name }) {
    const socket = state.socket;
    const channel = socket.channel(name);

    channel.join()
      .receive('ok', response => commit(types.DID_JOIN_CHANNEL, {
        name,
        channel,
        response,
      }))
      .receive('error', error => commit(types.DID_FAIL_CHANNEL, {
        name,
        channel,
        error,
      }));

    return Promise.resolve(channel);
  },
};

const mutations = {
  [types.DID_CONNECT_SOCKET](state, { socket }) {
    state.socket = socket;
    state.isLoading = false;
  },

  [types.DID_JOIN_CHANNEL](state, { name, channel, response }) {
    log('Joined channel successfully', name, channel, response);
    state.channels = Object.assign({}, state.channels, { [name]: channel });
  },

  [types.DID_FAIL_CHANNEL](state, { name, channel, error }) {
    log('Unable to join channel', name, channel, error);
  },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
