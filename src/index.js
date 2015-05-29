#!/usr/bin/env node

var ffmpeg = require('ffmpeg');
var optimist = require('optimist');
var path = require('path');
var rc = require('rc');

var argv = rc(
	'node-watermark', {}, optimist
	.usage('Usage: $0 video_file -w watermark_file [options]')
	.alias('o', 'output').describe('o', 'The path of the output video file').boolean('a')
	.alias('v', 'version').describe('version', 'Prints current version').boolean('boolean')
	.alias('w', 'watermark').describe('w', 'The watermark image path').boolean('a')
	.argv);

if (argv.version) {
	console.error(require('../package').version)
	process.exit(0)
}

var outputFilePath = argv.output;
var videoFilePath = argv._[0];
var watermarkFilePath = argv.watermark;

if (!videoFilePath || !watermarkFilePath) {
	optimist.showHelp();

	process.exit(1);
}

try {
	var ffmpegProcess = new ffmpeg(videoFilePath);

	console.log('Loading video...');

	ffmpegProcess.then(
		function(video) {
			console.log('Video ready! Processing now...');

			var settings = {
				position: 'SE',
				margin_nord: null,
				margin_sud: null,
				margin_east: null,
				margin_west: null
			};

			var callback = function(error) {
				if (error) {
					console.log('ERROR: ', error);

					process.exit(1);
				}
				else {
					console.log('Done.');

					process.exit(0);
				}
			};

			var extension = path.extname(videoFilePath);

			if (!outputFilePath) {
				outputFilePath = [
					'output-',
					(new Date()).getTime(),
					extension
				].join('');
			}

			video.fnAddWatermark(watermarkFilePath, outputFilePath, settings, callback);
		},
		function(err) {
			console.log('Error: ' + err);

			process.exit(1);
		}
	);
}
catch (e) {
	console.log(e);

	process.exit(1);
}