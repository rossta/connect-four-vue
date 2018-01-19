import Phoenix from './core';

const phoenix = new Phoenix({
  host: process.env.SOCKET_URL,
});

export default phoenix;
