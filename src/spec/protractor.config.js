exports.config = {
  specs: [
    'e2e/facebook_login.spec.js',
    'e2e/movies.spec.js',
    'e2e/movie.spec.js'
  ],

  framework: 'jasmine',
  seleniumAddress: process.env.SELENIUM_ADDRESS || 'http://localhost:4444/wd/hub',
  // restartBrowserBetweenTests: true,

  capabilities: {
    browserName: 'chrome',
    platform: 'ANY',
    version: ''
  },

  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    defaultTimeoutInterval: 1200000
  }
};
