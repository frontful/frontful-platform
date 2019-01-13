/* eslint-disable no-unused-expressions */
require('yargs').command({
    command: 'build [pattern]',
    desc: 'Buid current or all [pattern] packages',
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
    desc: 'Deploy current or all [pattern] packages',
    builder: (yargs) => yargs.default('pattern', './'),
    handler: (argv) => {
      require('./deploy')({
        pattern: argv.pattern,
        transpile: argv.transpile,
      })
    }
  })
  .command({
    command: 'link [pattern]',
    desc: 'Link current or all [pattern] packages',
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
    desc: 'Unlink current or all [pattern] packages',
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
    desc: 'Clean current or all [pattern] packages',
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
    desc: 'Post install script for current or all [pattern] packages',
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
