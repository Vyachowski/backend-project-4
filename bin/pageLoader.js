#!/usr/bin/env node
import { program } from 'commander';
import pageLoader from '../src/index.js';

const app = (url, { output }) => {
  try {
    pageLoader(url, output).then((message) => console.log(message));
  } catch (error) {
    console.error(`\x1b[33m ${error.message}\x1b[0m`);
  }
};

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>', 'An url of a website to save')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action(app)
  .parse(process.argv);
