const {src, dest, watch, parallel, series} = require('gulp');
const scss  															 = require('gulp-sass')(require('sass'));
const prefixer 														 = require('gulp-autoprefixer');
const clean 															 = require('gulp-clean-css');
const concat 														   = require('gulp-concat');
const browserSync 												 = require('browser-sync').create();
const terser 															 = require('gulp-terser');
const babel 															 = require('gulp-babel');
const plumber 														 = require('gulp-plumber');
const del 																 = require('del');
const gulpSquoosh 												 = require('gulp-squoosh');
const path = require('path')

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

// Минификация изображения, конвертация в webp
function processImages() {
	return src('src/img/content/**/*')
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
				encodeOptions: options,
			};
		}))
		.pipe(dest('build/img/content'))
		.pipe(browserSync.stream())
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

function deleteBuild() {
	return del('build')
}

exports.default = parallel(copyHtml, minStyle, minJs, copyImg, watching, syncBrowser);
exports.build 	= series(deleteBuild, copyHtml, minStyle, minJs, processImages);
