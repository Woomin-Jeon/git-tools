import readline from 'readline';
import ansiEscapes from 'ansi-escapes';
import { execSync } from 'child_process';

import { getBranchInfo } from '../utils/branch.js';

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
      execSync(`git branch -D ${selectedBranches.join(', ')}`);
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
