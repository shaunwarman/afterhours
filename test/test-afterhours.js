const Afterhours = require('../lib');
const Test = require('tape');

Test('test afterhours', t => {

  t.test('create batchy object', t => {
    const afterhours = new Afterhours();

    t.ok(afterhours, 'new afterhours');
    t.equal(typeof afterhours, 'object');
    t.end();
  });

  t.test('load json success', t => {
    const afterhours = new Afterhours();

    const json = require('./fixtures/config/good.json');

    const config = afterhours.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
      }

      t.ok(config, 'config created');
      t.equal(config.services.cal.priority, json.services.cal.priority);
      t.equal(typeof config.services.cal.script.main, 'function');

      t.test('test validation', t => {
        t.ok(afterhours._validate(config), 'config is valid');
        t.end();
      });
    });
  });

  t.test('load json failure', t => {
    const afterhours = new Afterhours();

    const json = require('./fixtures/config/bad.json');

    const config = afterhours.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
      }

      t.test('validation failure', t => {
        try {
          afterhours._validate(config);
        } catch (e) {
          t.ok(e, 'config is invalid');
          t.equal(e.message, `Services don't pass validation!`);
        }
        t.end();
      });
    });
  });

  t.test('tear down', t => {
    t.end();
    process.exit(0);
  });

});
