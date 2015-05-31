var exceptions = require('./exceptions');
var ffmpeg = require('ffmpeg');
var path = require('path');

var WaterMarker = function(options) {
	try {
		var ffmpegProcess = new ffmpeg(options.videoFilePath);

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
						throw new exceptions.WaterMarkException(error);
					}
					else {
						console.log('Done.');

						process.exit(0);
					}
				};

				var extension = path.extname(options.videoFilePath);

				if (!options.outputFilePath) {
					options.outputFilePath = [
						'output-',
						(new Date()).getTime(),
						extension
					].join('');
				}

				video.fnAddWatermark(
					options.watermarkFilePath,
					options.outputFilePath,
					settings,
					callback
				);
			},
			function(err) {
				throw new exceptions.WaterMarkException();
			}
		);
	}
	catch (e) {
		throw new exceptions.WaterMarkException(e);
	}
}

module.exports = WaterMarker;