// Karma configuration
// Nutzt Edge (Chromium-basiert) wenn Chrome nicht installiert ist.
const os = require('os');

if (!process.env.CHROME_BIN && os.platform() === 'win32') {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const fs = require('fs');
  if (fs.existsSync(edgePath)) {
    process.env.CHROME_BIN = edgePath;
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: { jasmine: { random: true } },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/tour-planner'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  });
};
