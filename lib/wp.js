#! /usr/bin/env node
/*
 * Wordpress Scaffolder
 * https://github.com/jonathan-fielding/Wordpress-Scaffolder
 *
 * Copyright (c) 2013 Jonathan Fielding
 * Licensed under the MIT license.
 */

'use strict';

var Scaffolder = function(options){
	this.options = options;
};

Scaffolder.prototype.start = function(userArgs){
	var self = this;

	var exec = require('child_process').exec;
	var child = exec('git ls-remote --tags git://github.com/WordPress/WordPress.git | tail -n 1', function(err, stdout, stderr) {
		if (err){
			throw err;
		}
		else{
			var pattern = /\d\.\d[\.\d]*/ig, match = pattern.exec(stdout);

			if (match !== null) {
				self.latestVersion = match[0];
			}
			
			if(typeof(self[userArgs[0]]) !== "undefined" && userArgs[0]  !== undefined){
				self[userArgs[0]](userArgs);
			}
			else if(userArgs[0] !== undefined){
			}
			else{
				console.log('Latest WordPress version: '+ self.latestVersion);
				console.log('Commands avaliable: init, update');
				console.log('Project Status: Unavaliable');
			}
		}
	});
};

Scaffolder.prototype.init = function(userArgs){
	
};

Scaffolder.prototype.update = function(userArgs){
	
};

// let's kick this thing off
if(require.main === module) {
  var pulldown = new Scaffolder();
  pulldown.start(process.argv.slice(2));
}

// export for testing
module.exports = Scaffolder;