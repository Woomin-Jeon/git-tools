import fs from 'fs';
import readline from 'readline';
import ansiEscapes from 'ansi-escapes';
import { execSync } from 'child_process';

const processInit = () => {
  console.clear();
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdout.write(ansiEscapes.cursorHide);
};

const processExit = () => {
  console.clear();
  process.stdout.write(ansiEscapes.cursorShow);
  process.exit();
};

const renderBranches = (branches, currentIndex) => {
  console.clear();
  branches.forEach((branch, index) => {
    if (index === currentIndex) {
      const setColorYellow = '\x1b[33m%s\x1b[0m';
      console.log(setColorYellow, `>>> ${branch}`);
    } else {
      console.log(`    ${branch}`);
    }
  });
};

const getBranchInfo = () => {
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

const checkout = () => {
  processInit();

  const { branches, headBranchIndex } = getBranchInfo();

  let currentBranchIndex = headBranchIndex;

  renderBranches(branches, currentBranchIndex);

  process.stdin.on('keypress', (_, key) => {
    const keyName = key.name;

    if (keyName === 'c' && key.ctrl) {
      processExit();
    }

    if (keyName === 'return' || keyName === 'space') {
      const selectedBranch = branches[currentBranchIndex];
      execSync(`git checkout ${selectedBranch}`);
      processExit();
    }

    if (keyName === 'down') {
      currentBranchIndex = (currentBranchIndex + branches.length + 1) % branches.length;
    }

    if (keyName === 'up') {
      currentBranchIndex = (currentBranchIndex + branches.length - 1) % branches.length;
    }

    renderBranches(branches, currentBranchIndex);
  });
};

export default checkout;
