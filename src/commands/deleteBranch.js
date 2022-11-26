import fs from 'fs';
import readline from 'readline';
import ansiEscapes from 'ansi-escapes';
import { exec } from 'child_process';

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

const renderBranches = (branches, selectedIndexes, currentIndex) => {
  console.clear();
  branches.forEach((branch, index) => {
    const setColorYellow = selectedIndexes.includes(index) ? '\x1b[33m%s\x1b[0m' : '';

    if (index === currentIndex) {
      console.log(setColorYellow, `>>> ${branch}`);
    } else if (selectedIndexes.includes(index)) {
      console.log(setColorYellow, `    ${branch}`);
    } else {
      console.log(setColorYellow, `    ${branch}`);
    }
  });
};

const getBranchInfo = () => {
  const tempFilePath = new URL('../temp.branches.txt', import.meta.url);

  exec(`git branch > ${tempFilePath.pathname}`);
  const fileData = fs.readFileSync(tempFilePath, { encoding: 'utf-8' });

  const branches = fileData.split('\n').map((branch) => branch.trim()).filter(Boolean);
  const headBranchIndex = branches.findIndex((branch) => branch.startsWith('*'));

  return {
    branches: branches.map((branch) => branch.replace(/\* /, '')),
    headBranchIndex,
  };
};

const deleteBranch = () => {
  processInit();

  const { branches: _branches, headBranchIndex } = getBranchInfo();
  const branches = _branches.filter((_, index) => index !== headBranchIndex);

  const selectedBranchIndexSet = new Set();
  let currentBranchIndex = 0;

  renderBranches(branches, [...selectedBranchIndexSet.values()], currentBranchIndex);

  process.stdin.on('keypress', (_, key) => {
    const keyName = key.name;

    if (keyName === 'c' && key.ctrl) {
      processExit();
    }

    if (keyName === 'return') {
      if (selectedBranchIndexSet.size === 0) {
        processExit();
      }

      const selectedBranches = [...selectedBranchIndexSet.values()].map((index) => branches[index]);
      exec(`git branch -D ${selectedBranches.join(', ')}`);
      processExit();
    }

    if (keyName === 'space') {
      if (selectedBranchIndexSet.has(currentBranchIndex)) {
        selectedBranchIndexSet.delete(currentBranchIndex);
      } else {
        selectedBranchIndexSet.add(currentBranchIndex);
      }
    }

    if (keyName === 'down') {
      currentBranchIndex = (currentBranchIndex + branches.length + 1) % branches.length;
    }

    if (keyName === 'up') {
      currentBranchIndex = (currentBranchIndex + branches.length - 1) % branches.length;
    }

    renderBranches(branches, [...selectedBranchIndexSet.values()], currentBranchIndex);
  });
};

export default deleteBranch;
