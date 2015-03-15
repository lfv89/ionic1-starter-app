#!/usr/bin/env node

require('shelljs/global');

process.stdout.write('\n >>> Running gulp prod:pipeline \n');

exec('gulp prod:pipeline');
