const Batchy = require('../lib');
const Test = require('tape');

Test('test batchy', t => {

  t.test('create batchy object', t => {
    const batchy = new Batchy();

    t.ok(batchy, 'new batchy');
    t.equal(typeof batchy, 'object');
    t.end();
  });

  t.test('test load json success', t => {
    const batchy = new Batchy();

    const json = require('./fixtures/config/good.json');

    const config = batchy.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
      }

      t.ok(config, 'config created');
      t.equal(config.services.cal.priority, json.services.cal.priority);
      t.equal(typeof config.services.cal.script.main, 'function');

      t.test('test validation', t => {
        t.ok(batchy._validate(config), 'config is valid');
        t.end();
      });
    });
  });

  t.test('test load json failure', t => {
    const batchy = new Batchy();

    const json = require('./fixtures/config/bad.json');

    const config = batchy.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
      }

      t.test('test validation failure', t => {
        try {
          batchy._validate(config);
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
