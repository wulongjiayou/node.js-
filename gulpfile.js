//严格模式 
'use strict';
//引入gulp模块
const gulp=require('gulp');
//定义任务,gulp默认执行名称为default的任务,以后执行gulp,gulp所有任务全部搞定
gulp.task('default',['es6toes5','mincss','imagemini','htmlmin','copyfile'],()=>{
	console.log('任务执行完毕')
});
//执行js代码的压缩和es6的语法转化为es5的语法
const babel =require('gulp-babel');
const uglify=require('gulp-uglify');
//uglify是不支持es6语法,先转换为es6语法,在压缩
//在gulp.src里面一定要加上第二个参数{base:'src'},
//就是为了保证在dist里面生成的文件和src里一样
gulp.task('es6toes5',()=>{
	gulp.src(['./src/control/*.js','./src/model/*.js','./src/routes/*.js',
		'./src/static/js/*.js'],
		{base:'src'})
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify())//压缩
	.pipe(rev())//生成MD5
	.pipe(gulp.dest('dist'))
	.pipe(rev.manifest({merge: true } ))//自动生成一个 manifest.json文件
    .pipe(gulp.dest('./src/rev')); // 输出json的文件路径
});

//css的压缩
const mincss = require('gulp-clean-css');
var rev = require('gulp-rev');
gulp.task('mincss', function() {
    gulp.src('./src/static/css/*.css',{base:'src'})
    .pipe(mincss({compatibility: 'ie8'}))
    .pipe(rev())//生成MD5
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest({merge: true }))//自动生成一个 manifest.json文件
    .pipe(gulp.dest('./src/rev'));// 输出json的文件路径
});

//图片的压缩
const imagemin = require('gulp-imagemin');
gulp.task('imagemini', () =>{
	gulp.src('src/static/images/*.*',{base:'src'})
	.pipe(imagemin())
	.pipe(gulp.dest('dist'));

});

//html的压缩,并且将md5的css和js自动生成到html里面
var revCollector = require('gulp-rev-collector');
var minifyHTML  = require('gulp-minify-html');
gulp.task('htmlmin', function () {
     gulp.src(['./src/rev/*.json', './src/view/*.html'],{base:'src'})
        .pipe( revCollector())
        .pipe( minifyHTML({collapseWhitespace: true}))
        .pipe( gulp.dest('dist') );
});

// 将static中的bowersrc文件夹全部拷贝到dist中
gulp.task('copyfile',()=>{
	gulp.src('./src/static/bowersrc/**/*.*',{base:'src'})
	.pipe(gulp.dest('dist'));
});
