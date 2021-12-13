const {src, dest, watch, parallel, series} = require('gulp');
const scss  															 = require('gulp-sass')(require('sass'));
const prefixer 														 = require('gulp-autoprefixer');
const clean 															 = require('gulp-clean-css');
const concat 														   = require('gulp-concat');
const browserSync 												 = require('browser-sync').create();
const terser 															 = require('gulp-terser');
const babel 															 = require('gulp-babel');
const imagemin 														 = require('gulp-imagemin');
const recompress 													 = require('imagemin-jpeg-recompress');
const pngquant 														 = require('imagemin-pngquant');
const webpConv 														 = require('gulp-webp');
const plumber 														 = require('gulp-plumber');

// Обновление Html в папке билд
function copyHtml() {
	return src('src/**/*.html')
		.pipe(dest('build/'))
		.pipe(browserSync.stream())
}

// Минификация стилей
function minStyle() {
	return src('src/scss/**/*.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(prefixer({
			overrideBrowserslist: ['last 8 versions'],
			browsers: [
				'Android >= 4',
				'Chrome >= 20',
				'Firefox >= 24',
				'Explorer >= 11',
				'iOS >= 6',
				'Opera >= 12',
				'Safari >= 6',
			],
		}))
		.pipe(clean({level: 2}))
		.pipe(concat('style.min.css'))
		.pipe(dest('build/css/'))
		.pipe(browserSync.stream())
}

// Минификация JavaScript
function minJs() {
	return src('src/js/script.js')
		.pipe(terser())
		.pipe(babel({presets: ['@babel/env']}))
		.pipe(concat('script.min.js'))
		.pipe(dest('build/js'))
		.pipe(browserSync.stream())
}

// Обновление изображений в папке билд
function copyImg() {
	return src('src/img/content/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(dest('build/img/content'))
		.pipe(browserSync.stream())
}

// Минификация изображений - не работает ¯\_(ツ)_/¯
function minImg() {
	return src('src/img/content/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(plumber())
		.pipe(imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
			},
			[
				recompress({
					loops: 6,
					min: 50,
					max: 90,
					quality: 'high',
					use: [pngquant({
						quality: [0.8, 1],
						strip: true,
						speed: 1
					})],
				}),
				imagemin.gifsicle(),
				imagemin.optipng(),
				imagemin.svgo()
			], ), )
		.pipe(dest('build/img/content'))
		.pipe(browserSync.stream())
}

// Конвертация изображений в Webp
function imgToWebp() {
	return src('build/img/content/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(webpConv())
		.pipe(dest('build/img/content'))
}

// Слежение за проектом
function watching() {
	watch('src/**/*.html').on('change', copyHtml);
	watch('src/scss/**/*.scss', minStyle);
	watch('src/js/**/*.js', minJs);
	watch('src/img/content/*.+(png|jpg|jpeg|gif|svg|ico)').on('add', copyImg);
}

// Обновление браузера
function syncBrowser() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
}

exports.default = parallel(copyHtml, minStyle, minJs, copyImg, watching, syncBrowser);
exports.build 	= series(copyHtml, minStyle, minJs, minImg, imgToWebp);
