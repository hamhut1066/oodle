var gulp = require('gulp');
var uglifyjs = require('uglify-js')

var file_array = [
    'import',
    'ranges',
    'engq',
    'calc'
    ]

var parse_compile = function(arr) {
    var results = [];
    for (var i in arr) {
        results.push("build/ts/" + arr[i] + ".js")
    }
    console.log(results)
    return results;
}

gulp.task('default', function() {
    // place code for your default task here
    console.error('Not Implemented')
});

gulp.task('unify', function() {
    var unify = uglifyjs.minify(parse_compile(file_array));


})
