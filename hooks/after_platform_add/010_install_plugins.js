#!/usr/bin/env node

require('shelljs/global');

var simplePlugins = [
  'com.ionic.keyboard'
]

process.stdout.write('\n >>> Installing plugins... \n');

simplePlugins.forEach(function(plugin) {
  exec("ionic plugin add " + plugin);
});
