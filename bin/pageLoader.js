#!/usr/bin/env node
import { program } from 'commander';
import pageLoader from '../src/index.js';

const app = (url, { output }) => {
  try {
    pageLoader(url, output)
      .then((outputPath) => console.log(`Page was successfully downloaded into '${outputPath}'`));
  } catch (error) {
    console.error(`\x1b[33m ${error.message}\x1b[0m`);
  }
};

const workingFolderShortPath = process.cwd().split('/').at(-1);

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>', 'An url of a website to save')
  .option('-o, --output [dir]', 'output dir', workingFolderShortPath)
  .action(app)
  .parse(process.argv);
