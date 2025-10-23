// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution order
        random: false
      }
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/healthcare-translation-web-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,

    // Custom configuration for healthcare translation app
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream'
        ]
      },
      ChromeDebugging: {
        base: 'Chrome',
        flags: [
          '--remote-debugging-port=9333',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream'
        ]
      }
    },

    // Files to load before tests
    files: [
      // Add any global test files here if needed
    ],

    // Exclude files from loading
    exclude: [
      // Add files to exclude if needed
    ],

    // Preprocessors
    preprocessors: {
      // Source files for coverage
      'src/**/*.ts': ['coverage']
    },

    // Browser configuration
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    captureTimeout: 60000,

    // Test execution configuration
    concurrency: Infinity,

    // Custom mime types for Angular
    mime: {
      'text/x-typescript': ['ts','tsx']
    }
  });

  // CI Configuration
  if (process.env['CI']) {
    config.browsers = ['ChromeHeadlessCI'];
    config.singleRun = true;
    config.autoWatch = false;
  }
};
