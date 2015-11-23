var fs          = require('fs');
var del         = require('del');
var gulp        = require('gulp');
var open        = require('open');
var _           = require('lodash');
var express     = require('express');
var sass        = require('gulp-sass');
var watch       = require('gulp-watch');
var runSequence = require('run-sequence');
var minifyJS    = require('gulp-uglify');
var vinylPaths  = require('vinyl-paths');
var inject      = require('gulp-inject');
var concat      = require('gulp-concat');
var cssmin      = require('gulp-cssmin');
var livereload  = require('gulp-livereload');
var replace     = require('gulp-replace-task');
var connectLr   = require('connect-livereload');

var isRelease,
    args = require('yargs')
             .alias('e', 'env')
             .alias('l', 'live')
             .alias('v', 'version')
             .argv;

var port = 8100;

var paths = {
  gulpFile:   'gulpfile.js',

  src: {
    assetsFile: 'src/assets.json',
    index:      'src/index.html',
    fonts:      'src/lib/ionic/fonts/**.*',
    imgs:       'src/img/**/**.*',
    path:       'src/',
    css:        'src/css/**/**.*',
    js:         'src/js/**/**.*'
  },

  dist: {
    scssFiles: 'www/css/**/**.scss',
    cssFiles:  'www/css/**/**.*',
    cssFile:   'www/css/application.css',
    jsFiles:   'www/js/**/**.*',
    jsFile:    'www/js/application.js',
    files: 'www/**/**.*',
    fonts: 'www/fonts',
    path:  'www/',
    imgs:  'www/img',
    css:   'www/css',
    js:    'www/js'
  },

  configFiles: {
    development:  "config/development.json",
    production: "config/production.json"
  }
}

livereload.listen()

// ********
// GULP WEB
// ********

gulp.task('web:run', function (callback) {
  isRelease = false

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'replaceJS',

    'inject',

    'watch',
    'serve',

    callback
  )
})

// ************
// GULP RELEASE
// ************

gulp.task('device:release', function (callback) {
  isRelease = true

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveCSS',
    'concatCSS',
    'minifyCSS',

    'moveAndConcatJS',
    'minifyJS',
    'replaceJS',

    'inject',

    'clear',
    'serve',
    callback
  )
})

gulp.task('clean', function () {
  return gulp.src(paths.dist.files).pipe(vinylPaths(del));
});

gulp.task('clear', function () {
  var sources = [
    paths.dist.cssFiles,
    '!' + paths.dist.cssFile,

    paths.dist.jsFiles,
    '!' + paths.dist.jsFile
  ]

  return gulp.src(sources)
             .pipe(vinylPaths(del));
})

/*
 * IMGS
 */

gulp.task('moveImgs', function () {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dist.imgs));
});

/*
 * FONTS
 */

gulp.task('moveFonts', function () {
  return gulp.src(paths.src.fonts)
             .pipe(gulp.dest(paths.dist.fonts));
});

/*
 * STYLESHEETS
 */

gulp.task('moveCSS', function (done) {
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
             .pipe(gulp.dest(paths.dist.css))
             .pipe(sass({ errLogToConsole: true }))
             .pipe(gulp.dest(paths.dist.css))
             .pipe(livereload())
});

gulp.task('clearCSS', function () {
  return gulp.src(paths.dist.scssFiles)
             .pipe(vinylPaths(del));
})

gulp.task('concatCSS', function () {
  return gulp.src(paths.dist.cssFiles)
             .pipe(concat('application.css'))
             .pipe(gulp.dest(paths.dist.css))
});

gulp.task('minifyCSS', function () {
  return gulp.src(paths.dist.cssFiles)
             .pipe(cssmin())
             .pipe(gulp.dest(paths.dist.css));
});

/*
 * JAVASCRIPTS
 */

gulp.task('moveJS', function () {
  var assetsJS = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;

  var sources  = _.map(assetsJS, function (asset) {
    return paths.src.path + asset + '.js';
  });

  return gulp.src(sources)
             .pipe(gulp.dest(paths.dist.js))
             .pipe(livereload())
});

gulp.task('moveAndConcatJS', function () {
  var assetsJS = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;

  var sources  = _.map(assetsJS, function (asset) {
    return paths.src.path + asset + '.js';
  });

  return gulp.src(sources)
             .pipe(concat('application.js'))
             .pipe(gulp.dest(paths.dist.js))
});

gulp.task('minifyJS', function (done) {
  return gulp.src(paths.dist.jsFiles)
             .pipe(minifyJS({ mangle: false }))
             .pipe(gulp.dest(paths.dist.js));
});

gulp.task('replaceJS', function () {
  var configs = JSON.parse(fs.readFileSync(paths.configFiles[args.env], 'utf8'));

  var patterns = _.map(configs, function (value, key) {
    return { match: key, replacement: value };
  });

  return gulp.src(paths.dist.jsFiles)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.dist.js));
});

gulp.task('inject', function () {
  if (isRelease) {
    var srcOptions    = { read: false }
    var injectOptions = { ignorePath: paths.dist.path, addRootSlash: false }

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(paths.dist.jsFile,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(paths.dist.cssFile, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  } else {
    var assetsCSS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).css;
    var sourcesCSS = _.map(assetsCSS, function (asset) {
      return paths.dist.css + '/' + _.last(asset.split('/')) + '.css';
    });

    var assetsJS  = JSON.parse(fs.readFileSync(paths.src.assetsFile, 'utf8')).js;
    var sourcesJS = _.map(assetsJS, function (asset) {
      return paths.dist.js + '/' + _.last(asset.split('/')) + '.js';
    });

    srcOptions    = { base: paths.dist, read: false }
    injectOptions = { ignorePath: paths.dist.path }

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(sourcesJS,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(sourcesCSS, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
});

/*
 * OTHERS
 */

gulp.task('watch', function () {
  // FONTS
  gulp.watch(paths.src.fonts, function () {
    gulp.start('moveFonts');
  });

  // IMGS
  gulp.watch(paths.src.imgs, function () {
    gulp.start('moveImgs');
  });

  // CSS
  var cssSources = [
    paths.src.css,
    paths.src.assetsFile
  ];

  gulp.watch(cssSources, function () {
    gulp.start('moveCSS')
  })

  // JS
  var jsSources = [
    paths.src.js,
    paths.src.assetsFile
  ]

  gulp.watch(jsSources, function () {
    gulp.start('moveJS');
  });

  // INJECT
  var injectSources = [
    paths.src.assetsFile,
    paths.src.index
  ];

  gulp.watch(injectSources, function () {
    gulp.start('inject');
  });
});

gulp.task('serve', function() {
  express()
    .use(connectLr())
    .use(express.static(paths.dist.path))
    .listen('3100')

  open('http://localhost:' + 3100 + '/')
});

