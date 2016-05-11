// Bring in individual gulp configs

require('./config/gulp/styles');
require('./config/gulp/scripts');
require('./config/gulp/images');
require('./config/gulp/fonts');
var build = require('./config/gulp/build');

// This gulp asset pipeline supports linting of scss and js files along with
// compiling and bundling css and js files into static/assets/ directories to
// be used by Hugo.

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var filter = require('gulp-filter');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var sassFiles = filter([ '**/*.scss' ], { restore: true });
var jsFiles = filter([ '**/*.js' ], { restore: true });
var spawn = require('child_process').spawn;

global.cFlags = {
  production: false,
  test: true,
};

//gulp.task('no-test', function (done) {
  //gutil.log(gutil.colors.cyan('no-test'), 'Disabling tests');
  //cFlags.test = false;
  //done();
//});

//gulp.task('production', function (done) {
  //gutil.log(gutil.colors.cyan('production'), 'Enabling production tasks');
  //cFlags.production = true;
  //done();
//});

gulp.task('watch', function () {
  gutil.log(gutil.colors.cyan('watch'), 'Watching assets for changes');
  gulp.watch('./assets/styles/**/*.scss', [ 'styles:homepage' ]);
  //gulp.watch('./assets/scripts/**/*.js', [ 'scripts' ]);
  gulp.watch('./assets/images/**/*', [ 'images' ]);
});

gulp.task('website', [ 'build', 'watch' ], function (done) {

  var buildDrafts = '--buildDrafts';

  if (cFlags.production) {
    buildDrafts = '';
  }

  var hugo = spawn('hugo', [ 'server', buildDrafts ]);

  hugo.stdout.on('data', function (data) {
    gutil.log(gutil.colors.blue('website'), '\n' + data);
  });

  hugo.on('error', done);
  hugo.on('close', done);

});

gulp.task('default', function (done) {
  build.printPackageInfo();
  gutil.log('Available tasks');
  gutil.log('$', gutil.colors.magenta('gulp watch'));
  gutil.log('Watch for changes and build the asset-pipeline');
  gutil.log('$', gutil.colors.magenta('gulp [ production, no-test ] build'));
  gutil.log('Build the asset-pipeline with optional production and no-test flags');
  gutil.log('$', gutil.colors.magenta('gulp clean-all'));
  gutil.log('Removes files and directories generated by gulp');
  gutil.log('$', gutil.colors.magenta('gulp [ production ] website'));
  gutil.log('Runs the gulp watch and hugo serve');
  gutil.log('$', gutil.colors.magenta('gulp [ production ] build:website'));
  gutil.log('Build the asset-pipeline and the website using Hugo');
  done();
});

//function setBranchBaseUrl() {
  //if (process.env.SITE_BASEURL) {
    //gutil.log(gutil.colors.yellow('set-baseurl'), "Found pre-set SITE_BASEURL: " + process.env.SITE_BASEURL);
    //gutil.log(gutil.colors.yellow('set-baseurl'), "(If you see this in a Travis log, things are happening in the wrong order.");
  //} else
    //if (process.env.TRAVIS_BRANCH == "master" &&
        //checkBranchBaseUrl('master', 'production', 'SITE_BASEURL_PRODUCTION')) {
      //process.env.SITE_BASEURL = process.env.SITE_BASEURL_PRODUCTION;
    //} else
    //if (process.env.TRAVIS_BRANCH == "staging" &&
        //checkBranchBaseUrl('staging', 'staging', 'SITE_BASEURL_STAGING')) {
      //process.env.SITE_BASEURL = process.env.SITE_BASEURL_STAGING;
    //} else {
    //gutil.log(gutil.colors.yellow('set-baseurl'), 'No environmental config found; using BaseUrl from config file.');
  //}
//}

//function checkBranchBaseUrl(branch, environmentName, baseUrlVarName) {
  //if (process.env[baseUrlVarName]) {
    //gutil.log(gutil.colors.cyan('set-baseurl'), 'Using '+environmentName+' site BaseUrl: ' + process.env[baseUrlVarName]);
    //return true;
  //} else {
    //gutil.log(gutil.colors.red('set-baseurl'), 'ERROR: '+environmentName+' build ('+branch+' branch) lacking a '+baseUrlVarName+' env var. Check the Travis configuration?');
    //process.exit(1);
  //}
//}
