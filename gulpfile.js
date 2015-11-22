var fs          = require('fs');
var del         = require('del');
var gulp        = require('gulp');
var _           = require('lodash');
var sass        = require('gulp-sass');
var watch       = require('gulp-watch');
var minifyJS    = require('gulp-uglify');
var vinylPaths  = require('vinyl-paths');
var inject      = require('gulp-inject');
var concat      = require('gulp-concat');
var runSequence = require('run-sequence');
var minifyCss   = require('gulp-minify-css');
var replace     = require('gulp-replace-task');

var paths = {
  distFiles:  'www/**/**.*',
  gulpFile:   'gulpfile.js',
  distCSS:    'www/css',
  distJS:     'www/js',
  dist:       'www',

  src: {
    assetsFile: 'src/assets.json',
    index:      'src/index.html',
    fonts:      'src/lib/ionic/fonts/**.*',
    imgs:       'src/img/**/**.*',
    path:       'src/',
    css:        'src/css/**/**.*',
    js:         'src/js/**/**.*'
  },

  dest: {
    fonts: 'www/fonts',
    imgs:  'www/img'
  },

  configFiles: {
    dev:  "config/development.json",
    prod: "config/production.json"
  }
};

var port = 8100;

// ********
// GULP DEV
// ********

gulp.task('dev:pipeline', ['devTasks']);

gulp.task('devTasks', function (callback) {
  runSequence(
    'dev:clean',
    'dev:processFonts',
    'dev:processImgs',
    'dev:processCSS',
    'dev:processJS',
    'dev:inject',
    'dev:watch',
    callback
  );
});

gulp.task('dev:clean', function () {
  return gulp.src(paths.distFiles).pipe(vinylPaths(del));
});

gulp.task('dev:processFonts', function () {
  return gulp.src(paths.src.fonts)
             .pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('dev:processImgs', function () {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dest.imgs));
});

gulp.task('dev:processCSS', function (done) {
  var assetsCSS = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).css;

  var sources = _.map(assetsCSS, function (asset) {
    var css  = '.css';
    var sass = '.scss';
    var extension = '';

    var pathWithoutExtension = paths.src.path + asset;

    if (fs.existsSync(pathWithoutExtension + css)) {
      extension = css;
    } else if (fs.existsSync(pathWithoutExtension + sass)) {
      extension = sass;
    } else {
      return '';
    }

    return pathWithoutExtension + extension;
  });

  return gulp.src(sources)
             .pipe(sass({ errLogToConsole: true }))
             .pipe(gulp.dest(paths.distCSS))
});

gulp.task('dev:processJS', function () {
  var assetsJS = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;

  var sources  = _.map(assetsJS, function (asset) {
    return paths.src.path + asset + '.js';
  });

  var env     = 'dev';
  var configs = JSON.parse(fs.readFileSync(paths.configFiles[env], 'utf8'));

  var patterns = _.map(configs, function (value, key) {
    return { match: key, replacement: value };
  });

  return gulp.src(sources)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.distJS));
});

gulp.task('dev:inject', function () {
  var assetsCSS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).css;
  var sourcesCSS = _.map(assetsCSS, function (asset) {
    return paths.distCSS + '/' + _.last(asset.split('/')) + '.css';
  });

  var assetsJS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;
  var sourcesJS = _.map(assetsJS, function (asset) {
    return paths.distJS + '/' + _.last(asset.split('/')) + '.js';
  });

  srcOptions    = { base: paths.dist, read: false }
  injectOptions = { ignorePath: 'www/' }

  return gulp.src(paths.src.index)
             .pipe(inject(gulp.src(sourcesJS,  srcOptions), injectOptions))
             .pipe(inject(gulp.src(sourcesCSS, srcOptions), injectOptions))
             .pipe(gulp.dest(paths.dist))
});

gulp.task('dev:watch', function () {
  // FONTS
  watch(paths.src.fonts, function () {
    gulp.start('dev:processFonts');
  });

  // IMGS
  watch(paths.src.imgs, function () {
    gulp.start('dev:processImgs');
  });

  // CSS
  var cssSources = [
    paths.src.css,
    paths.src.assetsFile
  ];

  watch(cssSources, function () {
    gulp.start('dev:processCSS');
  });

  // JS
  var jsSources = [
    paths.src.js,
    paths.src.assetsFile
  ].concat(_.values(paths.configFiles));

  watch(jsSources, function () {
    gulp.start('dev:processJS');
  });

  // INJECT
  var injectSources = [
    paths.src.assetsFile,
    paths.src.index
  ];

  watch(injectSources, function () {
    gulp.start('dev:inject');
  });
});

// *********
// GULP PROD
// *********

gulp.task('prod:pipeline', ['prodTasks']);

gulp.task('prodTasks', function (callback) {
  runSequence(
    'prod:processFonts',
    'prod:processImgs',

    'prod:concatCSS',
    'prod:precompileCSS',
    'prod:minifyCSS',

    'prod:concatJS',
    'prod:minifyJS',
    'prod:replaceJS',

    'prod:inject',
    'prod:clean',
    callback
  );
})

gulp.task('prod:processFonts', function () {
  return gulp.src(paths.src.fonts)
             .pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('prod:processImgs', function () {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dest.imgs));
});

gulp.task('prod:concatCSS', function () {
  var assetsCSS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).css;

  var sources = _.map(assetsCSS, function (asset) {
    var css  = '.css';
    var sass = '.scss';
    var extension = '';

    var pathWithoutExtension = paths.src.path + asset;

    if (fs.existsSync(pathWithoutExtension + css)) {
      extension = css;
    } else if (fs.existsSync(pathWithoutExtension + sass)) {
      extension = sass;
    } else {
      return '';
    }

    return pathWithoutExtension + extension;
  });

  return gulp.src(sources)
             .pipe(concat('application.css'))
             .pipe(gulp.dest(paths.distCSS))
});

gulp.task('prod:precompileCSS', function (done) {
  return gulp.src('www/dist/css/application.css')
             .pipe(sass({ errLogToConsole: true }))
             .pipe(gulp.dest(paths.distCSS));
});

gulp.task('prod:minifyCSS', function (done) {
  return gulp.src('www/dist/css/application.css')
             .pipe(minifyCss())
             .pipe(gulp.dest(paths.distCSS));
});

gulp.task('prod:concatJS', function () {
  var assetsJS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;
  var sources = _.map(assetsJS, function (asset) {
    return paths.src.path + asset + '.js';
  });

  return gulp.src(sources)
             .pipe(concat('application.js'))
             .pipe(gulp.dest(paths.distJS))
});

gulp.task('prod:minifyJS', function (done) {
  return gulp.src('www/dist/js/application.js')
             .pipe(minifyJS({ mangle: false }))
             .pipe(gulp.dest(paths.distJS));
});

gulp.task('prod:replaceJS', function () {
  var env     = 'prod';
  var configs = JSON.parse(fs.readFileSync(paths.configFiles[env], 'utf8'));

  var patterns = _.map(configs, function (value, key) {
    return { match: key, replacement: value };
  });

  return gulp.src('www/dist/js/application.js')
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.distJS));
});

gulp.task('prod:inject', function () {
  var srcOptions    = { read: false }
  var injectOptions = { ignorePath: 'www/dist/', addRootSlash: false }

  return gulp.src(paths.src.index)
             .pipe(inject(gulp.src('www/dist/css/application.css', srcOptions), injectOptions))
             .pipe(inject(gulp.src('www/dist/js/application.js',   srcOptions), injectOptions))
             .pipe(gulp.dest(paths.dist));
});

gulp.task('prod:clean', function () {
  var sources = [
    'www/dist/css/*.css',
    '!www/dist/css/application.css',
    'www/dist/js/*.js',
    '!www/dist/js/application.js'
  ]

  return gulp.src(sources).pipe(vinylPaths(del));
});
