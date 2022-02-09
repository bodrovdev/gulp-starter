const {src, dest, watch, parallel, series} = require('gulp');
const autoprefixer 												 = require('autoprefixer');
const babel 															 = require('gulp-babel');
const browserSync 												 = require('browser-sync').create();
const clean 															 = require('gulp-clean-css');
const concat 														   = require('gulp-concat');
const del 																 = require('del');
const gulpSquoosh 												 = require('gulp-squoosh');
const plumber 														 = require('gulp-plumber');
const postcss 														 = require('gulp-postcss');
const postcssColorMod 										 = require('@alexlafroscia/postcss-color-mod-function');
const postcssPresetEnv 										 = require('postcss-preset-env');
const scss  															 = require('gulp-sass')(require('sass'));
const sprite 															 = require('gulp-svg-sprite');
const terser 															 = require('gulp-terser');
const path 																 = require('path');
const svgmin 															 = require('gulp-svgmin');

// TASKS
const taskRefreshHtml1 = require('./tasks/refreshHtml')

const refreshHtml = function () {
	return taskRefreshHtml1(browserSync)
}

// Обновление изображений в папке билд
function copyImg() {
	return src('src/img/image/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(dest('build/img/image'))
		.pipe(browserSync.stream())
}

// Обновление favicon в папке билд
function copyFavicon() {
	return src('src/img/favicon/*.+(png|svg|ico)')
		.pipe(dest('build/img/favicon/'))
		.pipe(browserSync.stream())
}

// Обновление шрифтов в папке билд
function copyFont() {
	return src('src/fonts/**/*')
		.pipe(dest('build/fonts/'))
		.pipe(browserSync.stream())
}

// Минификация стилей
function minStyle() {
	const plugins = [
		postcssPresetEnv(),
		postcssColorMod({
			unresolved: 'warn',
		}),
		autoprefixer(),
	];

	return src('src/scss/**/*.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(postcss(plugins))
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

// Минификация изображений
function minImg() {
	return src('src/img/image/**/*.+(png|jpg|jpeg)')
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
					...options
				},
			};
		}))
		.pipe(dest('build/img/image'))
		.pipe(browserSync.stream())
}

// Конвертация контентных изображений в webp
function imgToWebp() {
	return src('src/img/image/content/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(gulpSquoosh({
			encodeOptions: {
				webp: {}
			},
		}))
		.pipe(dest('build/img/image/content'))
		.pipe(browserSync.stream())
}

// Минификация svg-изображений
function minSvg() {
	return src('src/img/image/**/*.+(svg)')
		.pipe(svgmin({
			plugins: [
				'removeComments',
				'removeEmptyContainers',
			]
		}))
		.pipe(dest('build/img/image/'))
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

// Слежение за проектом
function watching() {
	watch('src/**/*.html').on('change', refreshHtml);
	watch(['src/img/image/**/*.+(png|jpg|jpeg|gif|svg|ico)']).on('add', copyImg);
	watch('src/img/favicon/**/*').on('add', copyFavicon);
	watch('src/fonts/**/*').on('add', copyFont);
	watch('src/scss/**/*.scss', minStyle);
	watch('src/js/**/*.js', minJs);
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

exports.default = series(parallel(refreshHtml, copyImg, copyFavicon, copyFont, minStyle, minJs, watching, syncBrowser), browserSync.reload);
exports.build 	= series(deleteBuild, refreshHtml, copyFont, minStyle, minJs, minImg, imgToWebp, minSvg, svgSprite);
