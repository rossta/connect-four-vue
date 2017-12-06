import Vue from 'vue';
import Phoenix from '@/plugins/vue-phoenix';

Vue.use(Phoenix);

export default new Phoenix({
  host: process.env.SOCKET_URL,
});
