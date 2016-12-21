const Async = require('async');
const Cron = require('node-cron');
const Debug = require('debug');
const Handlers = require('shortstop-handlers');
const Joi = require('joi');
const Shortstop = require('shortstop');

const { EventEmitter } = require('events');

class Afterhours extends EventEmitter {
  constructor() {
    super();

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

    callback(null, config);

    this.emit('config:loaded');
  }

  _start() {
    Cron.schedule(this.cron, () => {
      const services = Object.keys(this.services);

      const _startservice = (service, callback) => {
        this.services[service].script.main(callback);
      }

      Async.eachSeries(services, _startservice, (err) => {
        if (err) {
          throw new Error(`Error running services.. ${JSON.stringify(err)}`);
        }
        console.log('Success running cron!');
      });
    });
  }

  _validate(services) {
    const schema = Joi.object().keys({
      main: Joi.any().required()
    });

    Object.keys(this.services).forEach(service => {
      Joi.validate(this.services[service].script, schema, (err, value) => {
        if (err) {
          throw new Error('Services don\'t pass validation!', err);
        }
      });
    });

    return true;
  }
}

module.exports = Afterhours;
