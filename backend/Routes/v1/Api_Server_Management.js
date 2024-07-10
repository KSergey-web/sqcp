const AuthMiddleware = require('../../Middleware/AuthMiddleware');

// On Windows Only...
const { spawn } = require('node:child_process');
const Config = require('../../Config');

let lastRestartServiceDate = null;
let lastUpdateServiceDate = null;

module.exports = (expressInstance) => {
  expressInstance.get(
    '/api/v1/server-management/statistics',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => {
      res.json({
        statistics: {
          lastRestartServiceDate,
          lastUpdateServiceDate,
        },
      });
    }
  );

  expressInstance.post(
    '/api/v1/server-management/restart',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => {
      try {
        const bat = spawn('cmd.exe', ['/c', Config.ScriptRestartServerPath]);
        await new Promise((resolve, reject) => {
          bat.stdout.on('data', (data) => {
            lastRestartServiceDate = new Date().toJSON();
            resolve();
          });

          bat.stderr.on('data', (data) => {
            console.error(data.toString());
            reject(data.toString());
          });
        });
        res.json({
          statistics: {
            lastRestartServiceDate,
            lastUpdateServiceDate,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  expressInstance.post(
    '/api/v1/server-management/update-and-restart',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => {
      try {
        const bat = spawn('cmd.exe', ['/c', Config.ScriptUpdateAndRestartServerPath]);
        await new Promise((resolve, reject) => {
          bat.stdout.on('data', (data) => {
            lastUpdateServiceDate = new Date().toJSON();
            resolve();
          });

          bat.stderr.on('data', (data) => {
            console.error(data.toString());
            reject(data.toString());
          });
        });
        res.json({
          statistics: {
            lastRestartServiceDate,
            lastUpdateServiceDate,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  );
};
