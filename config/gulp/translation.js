var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var pkg = require('../../package.json');
var runSequence = require('run-sequence');
var spawn = require('cross-spawn');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var spanishStateNames = require('./lang/spanish/state-names.json');

gulp.task('clean-translation', function () {
  gutil.log(gutil.colors.cyan('clean-translation'), 'Removing generated register/ files');
  return del([
    './layouts/registrar',
    './content/registrar',
  ]);
});

gulp.task('copy-content-spanish', function (done) {

  return gulp.src('./content/register/*.md')
    .pipe(rename(function (path) {
      var file = spanishStateNames[path.basename].file;
      path.basename = file;
    }))
    .pipe(replace(/title = "(.+)"/, function (match, p1) {
      var name = p1.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
      var title = spanishStateNames[name].title;
      var file = spanishStateNames[name].file;
      return (
        'title = "' + title + '"' +
        "\n" +
        'slug = "' + file + '"'
      );
    }))
    .pipe(gulp.dest('./content/registrar'));

});

gulp.task('copy-layouts-spanish', function (done) {

  var copyLayout = spawn('cp', [
    '-rvf',
    './layouts/register',
    './layouts/registrar',
  ]);

  copyLayout.stdout.on('data', function (data) {
    gutil.log(gutil.colors.blue('copy-layouts-spanish'), '\n' + data);
  });

  copyLayout.on('error', done);
  copyLayout.on('close', done);


});

gulp.task('copy-translation', [ 'clean-translation' ], function (done) {

  gutil.log(
    gutil.colors.cyan('copy-translation'),
    'Copying files from content/ & layouts/ for translated URLs'
  );

  runSequence(
    'copy-content-spanish',
    'copy-layouts-spanish',
    done
  );

});
