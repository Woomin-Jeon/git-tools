import { getBranchInfo } from '../utils/branch.js';
import { stdin } from '../utils/stdio.js';
import { exec } from '../utils/exec.js';

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

const checkout = () => {
  const { branches, headBranchIndex } = getBranchInfo();

  let currentBranchIndex = headBranchIndex;

  renderBranches(branches, currentBranchIndex);

  stdin(({ key, processExit }) => {
    const keyName = key.name;

    if (keyName === 'c' && key.ctrl) {
      processExit();
    }

    if (keyName === 'return' || keyName === 'space') {
      const selectedBranch = branches[currentBranchIndex];
      exec(`git checkout ${selectedBranch}`);
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
