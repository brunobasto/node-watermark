#!/usr/bin/env node

var optimist = require('optimist');
var rc = require('rc');
var WaterMarker = require('./index.js');

var argv = rc(
	'node-watermark', {}, optimist
	.usage('Usage: $0 video_file -w watermark_file [options]')
	.alias('o', 'output').describe('o', 'The path of the output video file.').boolean('a')
	.alias('v', 'version').describe('version', 'Prints current version.').boolean('boolean')
	.alias('w', 'watermark').describe('w', '[Required] The watermark image path.').boolean('a')
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

new WaterMarker(
	{
		outputFilePath: outputFilePath,
		videoFilePath: videoFilePath,
		watermarkFilePath: watermarkFilePath
	}
);