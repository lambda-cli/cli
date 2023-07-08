import path from 'path';
import fs from 'fs-extra';
import util from 'util';
import inquirer from 'inquirer';
import downloadGitRepo from 'download-git-repo';

import { loading } from './utils.js';

const downloadGitRepoPromise = util.promisify(downloadGitRepo);

const overwrite = async (name, options) => {
  const cwd = process.cwd();
  const targetDirectory = path.join(cwd, name);
  let isContinue = true;
  if (fs.existsSync(targetDirectory)) {
    if (options.force) {
      await fs.remove(targetDirectory);
    } else {
      let { isOverwrite } = await new inquirer.prompt([
        {
          name: 'isOverwrite',
          type: 'list',
          message: '是否强制覆盖同名文件夹',
          choices: [
            { name: 'Overwrite', value: true },
            { name: 'Cancel', value: false },
          ],
        },
      ]);
      // 选择 Cancel
      if (!isOverwrite) {
        isContinue = false;
      } else {
        console.log('Removing');
        await fs.remove(targetDirectory);
      }
    }
  }
  return isContinue;
};

export const initCommand = (name, options) => {
  new inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: '选择想要安装的模板类型',
      choices: [
        {
          name: '物料模板',
          value: 'material-template',
        },
        {
          name: '项目模板',
          value: 'project-template',
        },
      ],
    },
  ]).then(async (data) => {
    console.log(data, name);
    const target = name || data.template;
    const isContinue = await overwrite(target, options);
    if (isContinue) {
      const targetDirectory = path.join(process.cwd(), target);
      const templateURL = `lambda-cli/${data.template}`;
      await loading(
        '正在下载模板中',
        downloadGitRepoPromise,
        templateURL,
        path.resolve(process.cwd(), targetDirectory)
      );
    } else {
      return;
    }
  });
};
