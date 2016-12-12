const Batchy = require('../lib');
const Test = require('tape');

const json = require('./fixtures/config.json');

Test('test batchy', t => {

  t.test('create batchy object', t => {
    const batchy = new Batchy();

    t.ok(batchy, 'new batchy');
    t.ok(typeof batchy === 'object', 'batchy is object');

    t.end();
  });

  t.test('test load', t => {
    const batchy = new Batchy();

    const config = batchy.load(json, (error, config) => {
      if (error) {
        t.fail(error, 'error loading config');
      }

      console.log(`Config: ${JSON.stringify(config)}`);

      t.ok(config, 'config created');
      t.ok(config.services.cal.priority === json.services.cal.priority, 'cal priority');
      t.ok(config.services.npm.priority === json.services.npm.priority, 'npm priority');
      t.ok(typeof config.services.cal.script.main === 'function', 'script is function');
      t.ok(typeof config.services.npm.script.main === 'function', 'script is function');

      t.test('test validation', t => {

        t.ok(batchy._validate(config), 'config is valid');

        t.end();
      });
    });
  });

  t.test('tear down', t => {
    t.end();
    process.exit(0);
  });

});
