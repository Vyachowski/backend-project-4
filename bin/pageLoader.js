#!/usr/bin/env node
import { program } from 'commander';
import pageLoader from '../src/index.js';

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>', 'An url of a website to save')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
  .action((url, { output }) => {
    console.log(pageLoader(url, output));
  })
  .parse(process.argv);
