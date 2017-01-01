const Async = require('async');
const Cron = require('node-cron');
const Debug = require('debug');
const Handlers = require('shortstop-handlers');
const Joi = require('joi');
const Shortstop = require('shortstop');

const { EventEmitter } = require('events');

class Afterhours extends EventEmitter {
  constructor(options = {}) {
    super(options);

    this.cron = null;
    this.services = {};

    this.resolver = Shortstop.create();
    this.resolver.use('require', Handlers.require(process.cwd()));

    this.on('config:loaded', this._start);
  }

  load(json, callback) {
    this.resolver.resolve(json, (err, config) => {
      if (err) {
        return callback(err);
      }

      this._load(config, callback);
    });
  }

  _load(config, callback) {
    this.cron = config.cron;

    Object.keys(config.services).forEach(service => {
      const options = { name: service };

      Object.keys(config.services[service]).forEach(key => {
        options[key] = config.services[service][key];
      });

      this.services[options.name] = options;
    });

    this.config = config;
    this._start(callback);
  }

  _cronify(fn) {
    Cron.schedule(this.cron, () => {
      return fn.call(null);
    });
  }

  _start(done) {
    const MAIN = 'main';

    const run = () => {
      const services = Object.keys(this.services);

      Async.eachSeries(services, (service, callback) => {
        const {script} = this.services[service];

        this._validate(script, (err) => {
          if (err) {
            return callback(err);
          }
          script[MAIN](callback);
        });
      },
      (err) => {
        if (err) {
          return done(new Error('Error running cron!', err));
        }
        if (!this.cron) {
          done(null, this.config);
        }
      });
    }

    if (this.cron) {
      this._cronify(run);
    } else {
      run();
    }
  }

  _validate(script, callback) {
    const schema = Joi.object().keys({
      main: Joi.any().required()
    });

    Joi.validate(script, schema, (err, value) => {
      if (err) {
        return callback(err);
      }
      callback();
    });
  }
}

module.exports = Afterhours;
