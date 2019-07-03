var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

var paths = {
    pages: ['src/*.html'],
    assets: ['src/assets/*.png']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-assets", function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest("dist"));
});


function bundle() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series(gulp.parallel('copy-html'),gulp.parallel('copy-assets'), bundle));