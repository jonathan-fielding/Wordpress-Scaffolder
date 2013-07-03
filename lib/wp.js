#! /usr/bin/env node
/*
 * Wordpress Scaffolder
 * https://github.com/jonathan-fielding/Wordpress-Scaffolder
 *
 * Copyright (c) 2013 Jonathan Fielding
 * Licensed under the MIT license.
 */

'use strict';

//Setup dependencies
var shell = require('shelljs');
var prompt = require('prompt');
var exec = require('child_process').exec;

//Setup prompts
var promptInit = {
	properties: {
		name: {
			description: "Project name",
			pattern: /^[a-zA-Z\s\-]+$/,
			message: 'Name must be only letters, spaces, or dashes',
			default: 'Wordpress Site',
			required: true
		},
		mysqlusername: {
			description: "MySQL Username",
			default: 'temp',
			required: true
		},
		mysqlpassword: {
			description: "MySQL Password",
			default: 'temp',
			hidden: true,
			required: true
		}
	}
};

var promptRepoLink = {
	properties: {
		name: {
			description: "GIT Repo name",
			default: 'origin',
			required: true
		},
		url: {
			description: "GIT Repo URI",
			required: true
		}
	}
};


var Scaffolder = function(options){
	this.options = options;
};

Scaffolder.prototype.start = function(userArgs){
	var self = this;
	var child = null;

	if (!shell.which('git')) {
		console.log('WordPress Scaffolder requires the GIT CLI tools be installed');
		return false;
	}

	child = exec('git ls-remote --tags git://github.com/WordPress/WordPress.git | tail -n 1', function(err, stdout, stderr) {
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
	var self = this;

	if (shell.test('-e', 'wp-config.php')) {
		console.log('Files will be overwritten if we proceed');
	}
	else{

		//
		// Get two properties from the user: email, password
		//
		prompt.get(promptInit, function (err, result) {
			console.log('Getting Wordpress, this may take a few minutes')

			var init = exec('git init', function(err, stdout, stderr) {
				var addOrigin = null;

				if (err){
					throw err;
				}
				else{
					addOrigin = exec('git remote add wordpress git@github.com:WordPress/WordPress.git',function(err, stdout, stderr) {
						var fetch = null;

						if (err){
							throw err;
						}
						else{
							fetch = exec('git fetch wordpress -t',function(err, stdout, stderr) {
								var gettag = null;

								if (err){
									throw err;
								}
								else{
									gettag = exec('git checkout '+self.latestVersion,function(err, stdout, stderr) {
										var branch = null;

										if (err){
											throw err;
										}
										else{
											branch = exec('git checkout -b master',function(err, stdout, stderr) {
												if (err){
													throw err;
												}
												else{

												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		});
	}
};

Scaffolder.prototype.update = function(userArgs){
	
};

//Link to your own git repository for source control
Scaffolder.prototype.link = function(userArgs){
	console.log('Link allows you to link your GIT remote repository and intialises it');

	prompt.get(promptRepoLink, function (err, result) {
		var setupLink = exec('git remote add '+ result.name +' ' + result.url,function(err, stdout, stderr) {
			var push = null;
			if (err){
				throw err;
			}
			else{

			}

			push = exec('git push ' + result.name + ' master',function(err, stdout, stderr) {
				if (err){
					throw err;
				}
				else{

				}
			});
		});
	});
};

Scaffolder.prototype.help = function () {
	console.log();
	console.log('  Usage: wp <command>');
	console.log();
	console.log('  Commands:');
	console.log();
	console.log('    wp init             # Initialises a new project');
	console.log('    wp update           # Updates wordpress and all supported plugins');
	console.log();
};

// let's kick this thing off
if(require.main === module) {
  var pulldown = new Scaffolder();
  pulldown.start(process.argv.slice(2));
}

// export for testing
module.exports = Scaffolder;