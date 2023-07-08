#! /usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';

import { initCommand } from '../lib/index.js';

const program = new Command();
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// 名称，描述，版本号，用法提示。
program
  .name('lambda-cli')
  .description('物料、项目模板安装脚手架')
  .version(`lambda-cli ${packageJson.version}`)
  .usage('<command> [options]');

program
  .command('init [project-name]')
  .description('选择想要安装的模板类型')
  .option('-f, --force', '是否强制覆盖同名文件夹')
  .action(initCommand);

program.parse(process.argv);
