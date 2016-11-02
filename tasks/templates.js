import gulp from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import rigger from 'gulp-rigger';
import htmlLint from 'gulp-html-lint';
import prettify from 'gulp-jsbeautifier';
import cached from 'gulp-cached';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import errorHandler from 'gulp-plumber-error-handler';
import staticHash from 'gulp-static-hash';

gulp.task('templates', () => (
	gulp.src('app/pages/*.html')
		.pipe(plumber({errorHandler: errorHandler(`Error in \'templates\' task`)}))
		.pipe(cached('html'))
		.pipe(filter(file => /app[\\\/]pages/.test(file.path)))
		.pipe(rigger())
		.pipe(gulpIf(process.env.PRETTIFY !== false, prettify({
			braceStyle: 'expand',
			indentWithTabs: true,
			indentInnerHtml: true,
			preserveNewlines: true,
			endWithNewline: true,
			wrapLineLength: 120,
			maxPreserveNewlines: 50,
			wrapAttributesIndentSize: 1,
			unformatted: ['use']
		})))
		.pipe(gulpIf(process.env.NODE_ENV === 'production', staticHash({
			asset: 'dist',
			exts: ['js', 'css']
		})))
		.pipe(rename({dirname: '.'}))
		.pipe(gulp.dest('dist'))
));

gulp.task('templates:lint', () =>
	gulp
		.src('app/pages/*.html')
		.pipe(htmlLint())
);
