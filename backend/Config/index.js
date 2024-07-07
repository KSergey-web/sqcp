const Database = require('./database.json');

const MODE = 'production';

const Config = {
  MODE,

  RCON: {
    host: process.env.RCON_HOST || '',
    password: process.env.RCON_PASSWORD || '',
    port: process.env.RCON_PORT || 27028,
  },

  DATABASE: {
    host: Database[MODE].host,
    user: Database[MODE].username,
    password: Database[MODE].password,
    database: Database[MODE].database,
    dialect: Database[MODE].dialect,
    port: Database[MODE].port,
  },

  LOGGER_MODULES: {
    RCON: {
      verboseness: 1,
      color: 'yellowBright',
    },

    SquadRcon: {
      verboseness: 1,
      color: 'magenta',
    },

    Express: {
      verboseness: 1,
      color: 'blueBright',
    },

    DataBase: {
      verboseness: 1,
      color: 'green',
    },
  },

  JWT: {
    Secret: process.env.JWT_SECRET || 'SomeRandomSecret123',
    Algorithm: process.env.JWT_ALGORITHM || 'HS256',
    Expiration: process.env.JWT_EXPIRATION || '30d',
  },

  API_VERSIONS: ['v1'],
  EXPRESS_PORT: process.env.PORT || 3000,

  ScriptRestartServerPath: 'C:\\Users\\Serv-1\\Desktop\\Restart_service.bat',
  ScriptUpdateAndRestartServerPath: 'C:\\Users\\Serv-1\\Desktop\\Update_ restart.bat'
};

module.exports = Config;
