const Cron = require('node-cron');
const Debug = require('debug');
const Handlers = require('shortstop-handlers');
const Shortstop = require('shortstop');

const { EventEmitter } = require('events');

class Batchy extends EventEmitter {
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
    console.log(this.cron);
    Cron.schedule(this.cron, () => {
      Object.keys(this.items).forEach(item => {
        this.items[item].script.main();
      });
    });
  }
}

module.exports = Batchy;
