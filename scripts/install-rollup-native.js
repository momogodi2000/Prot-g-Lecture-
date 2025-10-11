import { platform, arch } from 'node:process'
import { execSync } from 'node:child_process'

const isLinux = platform === 'linux'
const isX64 = arch === 'x64'

if (isLinux && isX64) {
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu@4.52.4 --no-save', {
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_ignore_scripts: 'true',
      },
    })
  } catch (error) {
    console.error('Failed to install Rollup native binary, falling back to JS implementation.', error.message)
  }
} else {
  console.log('Skipping Rollup native binary installation on this platform.')
}
