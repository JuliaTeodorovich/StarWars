import gulp from "gulp";
import minifyHtml from "gulp-minify-html";
import sass from "sass";
import gulpSass from "gulp-sass";
import babel from "gulp-babel-minify";
import livereload from "gulp-livereload";
import connect from "gulp-connect";

const scssCompiler = gulpSass(sass);

const SRC_FOLDER = "./src";
const BUILD_FOLDER = "./build";
const JS_FILES_PATH = SRC_FOLDER + "/js/**/*.js";
const SCSS_FILES_PATH = SRC_FOLDER + "/scss/**/*.scss";
const HTML_FILES_PATH = "index.html";

livereload({ start: true });

async function jsCompilation() {
  gulp
    .src(JS_FILES_PATH)
    .pipe(babel())
    .pipe(gulp.dest(BUILD_FOLDER))
    .pipe(livereload());
}

async function sassCompilation() {
  gulp
    .src(SCSS_FILES_PATH)
    .pipe(scssCompiler())
    .pipe(gulp.dest(BUILD_FOLDER))
    .pipe(livereload());
}

async function htmlCompilation() {
  return gulp
    .src(HTML_FILES_PATH)
    .pipe(minifyHtml())
    .pipe(gulp.dest(BUILD_FOLDER))
    .pipe(livereload());
}

gulp.task("sass-compile", sassCompilation);

gulp.task("js-compile", jsCompilation);

gulp.task("html-compile", htmlCompilation);

gulp.task("watch-scss", function () {
  gulp.watch(SCSS_FILES_PATH, sassCompilation);
});

gulp.task("watch-js", function () {
  gulp.watch(JS_FILES_PATH, jsCompilation);
});

gulp.task("watch-html", function () {
  gulp.watch(HTML_FILES_PATH, htmlCompilation);
});

gulp.task("connect", function () {
  connect.server({
    root:  ["build", "node_modules"],
    livereload: true,
  });
});

gulp.task(
  "watch",
  gulp.parallel("watch-js", "watch-scss", "watch-html", "connect")
);

gulp.task(
  "default",
  gulp.parallel("js-compile", "sass-compile", "html-compile")
);
