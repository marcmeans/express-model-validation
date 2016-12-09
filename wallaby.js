module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      '!src/**/*.spec.ts',
      { pattern: 'src/bootstraplib/**/*.ts', instrument: false },
      { pattern: 'src/config/**/*.ts', instrument: false },
      { pattern: 'src/utilities/**/*.ts', instrument: false }
    ],

    tests: [
      'src/**/*.spec.ts'
    ],

    filesWithNoCoverageCalculated: [
      'src/bootstraplib/**/*.ts',
      'src/config/**/*.ts',
      'src/utilities/**/*.ts'
    ],

    env: {
      type: 'node',

    },

    testFramework: 'mocha',
    compilers: { '**/*.ts': wallaby.compilers.typeScript() },
    workers: { recycle: true }
  };
};
