const Afterhours = require('../lib');
const Test = require('tape');

Test('test afterhours', t => {

  t.test('create batchy object', t => {
    const afterhours = new Afterhours();

    t.ok(afterhours, 'new afterhours');
    t.equal(typeof afterhours, 'object');
    t.end();
  });

  t.test('validate config success', t => {
    const afterhours = new Afterhours();

    const script = require('./fixtures/lib/cal.js');

    afterhours._validate(script, err => {
      if (err) {
        t.fail(e, 'config is invalid');
        t.end()
      }
      t.ok(!err, 'config is valid');
      t.end();
    });
  });

  t.test('validate config failure no main', t => {
    const afterhours = new Afterhours();

    const script = require('./fixtures/lib/npm.js');

    afterhours._validate(script, err => {
      if (err) {
        t.ok(err, 'config is invalid');
      }
      t.end();
    });
  });

  t.test('load json success', t => {
    const afterhours = new Afterhours();

    const json = require('./fixtures/config/good.json');

    afterhours.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
        t.end();
      }

      t.ok(config, 'config created');
      t.equal(config.services.cal.priority, json.services.cal.priority);
      t.equal(typeof config.services.cal.script.main, 'function');

      t.end();
    });

  });


  t.test('load json failure', t => {
    const afterhours = new Afterhours();

    const json = require('./fixtures/config/bad.json');

    afterhours.load(json, (error, config) => {
      t.ok(error, 'validation failed');
      t.end();
    });
  });

  t.test('multi step config', t => {
    const afterhours = new Afterhours();

    const json = require('./fixtures/config/sample.json');

    afterhours.load(json, (error, config) => {
      t.ok(config, 'success loading');
      t.end();
    });
  });

  t.test('tear down', t => {
    t.end();
    process.exit(0);
  });
});
