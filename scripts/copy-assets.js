const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

const isWin = os.platform() === 'win32';
const scriptPath = path.resolve(__dirname, isWin ? 'copy-assets-win.bat' : 'copy-assets.sh');

try {
  if (isWin) {
    execSync(`"${scriptPath}"`, { stdio: 'inherit' });
  } else {
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' });
  }
} catch (e) {
  process.exit(1);
}
