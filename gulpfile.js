const {src, dest, watch, parallel, series} = require('gulp');
const scss  															 = require('gulp-sass')(require('sass'));
const prefixer 														 = require('gulp-autoprefixer');
const clean 															 = require('gulp-clean-css');
const concat 														   = require('gulp-concat');
const terser 															 = require('gulp-terser');
const babel 															 = require('gulp-babel');
const gulpSquoosh 												 = require('gulp-squoosh');
const path 																 = require('path');
const svgmin 															 = require('gulp-svgmin');
const sprite 															 = require('gulp-svg-sprite');
const plumber 														 = require('gulp-plumber');
const browserSync 												 = require('browser-sync').create();
const del 																 = require('del');

// Обновление Html в папке билд
function copyHtml() {
	return src('src/**/*.html')
		.pipe(dest('build/'))
		.pipe(browserSync.stream())
}

// Обновление изображений в папке билд
function copyImg() {
	return src('src/img/content/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(dest('build/img/content'))
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

// Минификация изображений, конвертация в webp
function minImg() {
	return src('src/img/content/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(gulpSquoosh(({ filePath }) => {
			const imageExtension = path.extname(filePath);
			const isPng = imageExtension === ".png";
			const optionsForPng = {
				oxipng: {}
			};
			const optionsForJpg = {
				mozjpeg: {}
			};
			const options = isPng ? optionsForPng : optionsForJpg;
			return {
				encodeOptions: {
					...options,
					webp: {},
				},
			};
		}))
		.pipe(dest('build/img/content'))
		.pipe(browserSync.stream())
}

// Минификация svg-изображений
function minSvg() {
	return src('src/img/content/*.+(svg)')
		.pipe(svgmin({
			plugins: [
				'removeComments',
				'removeEmptyContainers',
			]
		}))
		.pipe(dest('build/img/content'))
		.pipe(browserSync.stream())
}

// Создание svg-спрайта
function svgSprite() {
	return src('src/img/icon/**/*.svg')
		.pipe(svgmin({
			plugins: [
				'removeComments',
				'removeEmptyContainers',
			]
		}))
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('build/img/icon'))
		.pipe(browserSync.stream())
}

// Обновление favicon в папке билд
function copyFavicon() {
	return src('src/img/favicon/*.+(png|svg|ico)')
		.pipe(dest('build/img/favicon/'))
		.pipe(browserSync.stream())
}

// Слежение за проектом
function watching() {
	watch('src/**/*.html').on('change', copyHtml);
	watch('src/scss/**/*.scss', minStyle);
	watch('src/js/**/*.js', minJs);
	watch('src/img/content/*.+(png|jpg|jpeg|gif|svg|ico)').on('add', copyImg);
	watch('src/img/favicon/**/*').on('add', copyFavicon)
}

// Обновление браузера
function syncBrowser() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
}

// Удаление предыдущей версии билда
function deleteBuild() {
	return del('build')
}

exports.default = series(parallel(copyHtml, minStyle, minJs, copyImg, copyFavicon, watching, syncBrowser), browserSync.reload);
exports.build 	= series(deleteBuild, copyHtml, minStyle, minJs, minImg, minSvg, svgSprite);
