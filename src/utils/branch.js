import fs from 'fs';
import { execSync } from 'child_process';

export const getBranchInfo = () => {
  const tempFilePath = new URL('../temp.branches.txt', import.meta.url);

  execSync(`git branch > ${tempFilePath.pathname}`);
  const fileData = fs.readFileSync(tempFilePath, { encoding: 'utf-8' });

  const branches = fileData.split('\n').map((branch) => branch.trim()).filter(Boolean);
  const headBranchIndex = branches.findIndex((branch) => branch.startsWith('*'));

  return {
    branches: branches.map((branch) => branch.replace(/\* /, '')),
    headBranchIndex,
  };
};

export const xxx = 'xxx';
