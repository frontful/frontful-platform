/* eslint-disable no-unused-expressions */
require('yargs').command({
    command: 'build [pattern]',
    desc: 'Buid current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./build')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .command({
    command: 'deploy [pattern]',
    aliases: ['deploy-package', 'deploy-packages'],
    desc: 'Deploy current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./deployPackage')({
        pattern: argv.pattern,
        transpile: argv.transpile,
        path: 'build',
      })
    }
  })
  .command({
    command: 'deploy-app [pattern]',
    aliases: ['deploy-apps'],
    desc: 'Deploy current or all [pattern] app(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./deployApp')({
        pattern: argv.pattern,
        path: 'artifacts',
      })
    }
  })
  .command({
    command: 'link [pattern]',
    desc: 'Link current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./link')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .command({
    command: 'unlink [pattern]',
    desc: 'Unlink current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./unlink')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .command({
    command: 'clean [pattern]',
    desc: 'Clean current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./clean')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .command({
    command: 'install [pattern]',
    desc: 'Post install script for current or all [pattern] package(s)',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./install')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .option('t', {
    alias: 'transpile',
    demandOption: false,
    default: true,
    describe: 'Transpile source code',
    type: 'boolean'
  })
  .demandCommand()
  .help()
  .argv
