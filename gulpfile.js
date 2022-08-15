const { watch, parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');

// Задача для обновления HTML в папке build
const taskRefreshHtml = require('./tasks/refreshHtml');
const refreshHtml = function () {
	return taskRefreshHtml(browserSync)
};

// Задача для обновления изображений в папке build
const taskRefreshImg = require('./tasks/refreshImg');
const refreshImg = function () {
	return taskRefreshImg(browserSync)
};

// Задача для обновления Favicon в папке build
const taskRefreshFavicon = require('./tasks/refreshFavicon');
const refreshFavicon = function () {
	return taskRefreshFavicon(browserSync)
};

// Задача для обновления шрифтов в папке build
const taskRefreshFont = require('./tasks/refreshFont');
const refreshFont = function () {
	return taskRefreshFont(browserSync)
};

// Задача для минификации CSS
const taskMinStyle = require('./tasks/minStyle');
const minStyle = function () {
	return taskMinStyle(browserSync);
};

// Задача для минификации JavaScript
const taskMinJs = require('./tasks/minJs');
const minJs = function () {
	return taskMinJs(browserSync);
};

// Задача для минификации изображений
const taskMinImg = require('./tasks/minImg');
const minImg = function () {
	return taskMinImg(browserSync);
};

// Задача для конвертации изображений в webp
const taskImgToWebp = require('./tasks/imgToWebp');
const imgToWebp = function () {
	return taskImgToWebp(browserSync);
};

// Задача для минификации svg-изображений
const taskMinSvg = require('./tasks/minSvg');
const minSvg = function () {
	return taskMinSvg(browserSync);
};

// Задача для создание svg-спрайта
const taskSvgSprite = require('./tasks/svgSprite');
const svgSprite = function () {
	return taskSvgSprite(browserSync);
};

// Слежение за проектом
function watching() {
	watch('src/**/*.html').on('change', refreshHtml);
	watch('src/scss/**/*.scss').on('change', minStyle);
	watch('src/js/**/*.js').on('change', minJs);
	watch(['src/img/image/**/*.+(png|jpg|jpeg|gif|svg|ico)']).on('add', refreshImg);
	watch('src/img/favicon/**/*').on('add', refreshFavicon);
	watch('src/fonts/**/*').on('add', refreshFont);
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

exports.default = series(
	parallel(refreshHtml,
		minStyle,
		minJs,
		refreshImg,
		refreshFavicon,
		refreshFont,
		watching,
		syncBrowser),
	browserSync.reload
);

exports.build = series(
	deleteBuild,
	refreshHtml,
	refreshFavicon,
	refreshFont,
	minStyle,
	minJs,
	minImg,
	imgToWebp,
	minSvg,
	svgSprite
);