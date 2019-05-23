const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379
    }),
    secret: 'ggwp123',
    resave: true,
    saveUninitialized: true
  });