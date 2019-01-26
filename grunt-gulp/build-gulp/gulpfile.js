/*
 * Create references
 */
var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./common.js');

/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();

/*
 * Load common utilities for gulp
 */
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/*
 * Create comments for minified files
 */
var commentHeader = common.createComments(gutil);

/*
 * Could use a product/development switch.
 * Run `gulp --production`
 */
var type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for', gutil.colors.magenta(type) );
gutil.beep();

/*
 * Lint the code
 */
gulp.task('jshint', function () {
    return gulp.src(pkg.paths.source.js)
        .pipe(plug.jshint('jshintrc.json'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});

/*
 * Minify and bundle the JavaScript
 */
gulp.task('bundlejs', ['jshint'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = {newLine: ';'};

    return gulp.src(pkg.paths.source.js)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.uglify())
        .pipe(plug.concat(bundlefile, opt))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.js))
        .pipe(plug.size({showFiles: true}));
});


/*
 * Minify and bundle the CSS
 */
gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.source.css)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.minifyCss({}))
        .pipe(plug.concat(pkg.name + ".min.css"))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.css))
        .pipe(plug.size({showFiles: true}));
});

/*
 * Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.source.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dest.images));
});

/*
 * Bundle the JS, CSS, and compress images.
 * Then copy files to production and show a toast.
 */
gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
    // Copy the CSS to prod
    return gulp.src(pkg.paths.dest.css + '/**/*')
        .pipe(gulp.dest(pkg.paths.production + '/content/'))

        // Copy the js files to prod
        .pipe(gulp.src(pkg.paths.dest.js + '/*.js'))
        .pipe(gulp.dest(pkg.paths.production + '/app/'))

        // Notify we are done
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});

/*
 * Remove all files from the output folder
 */
gulp.task('cleanOutput', function(){
    return gulp.src([
            pkg.paths.dest.base,
            pkg.paths.production])
        .pipe(plug.clean({force: true}))
});
/*
 * Watch file and re-run the linter
 */
gulp.task('build-watcher', function() {
    var jsWatcher = gulp.watch(pkg.paths.source.js, ['jshint']);

    /*
     * Rebuild when any files changes
     */
//    gulp.watch([pkg.paths.source.css,
//        pkg.paths.source.js,
//        pkg.paths.source.images], ['default']);

    jsWatcher.on('change', function(event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

