import { getBranchInfo } from '../utils/branch.js';
import { stdin } from '../utils/stdio.js';
import { exec } from '../utils/exec.js';

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
  const { branches: _branches, headBranchIndex } = getBranchInfo();
  const branches = _branches.filter((_, index) => index !== headBranchIndex);

  const selectedBranchIndexSet = new Set();
  let currentBranchIndex = 0;

  renderBranches(branches, [...selectedBranchIndexSet.values()], currentBranchIndex);

  stdin(({ key, processExit }) => {
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
