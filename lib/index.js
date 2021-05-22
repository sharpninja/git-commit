const { exec } = require('@actions/exec');
const core = require('@actions/core');

async function main() {
  try {
    const USER_NAME = core.getInput('user-name');
    const USER_EMAIL = core.getInput('user-email');
    const MESSAGE = core.getInput('message');
    const TAG = core.getInput('tag');
    const GITHUB_TOKEN = core.getInput('github-token', { required: true });
    const REMOTE_REPO = `https://${process.env.GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

    const options = {
      cwd: process.env.GITHUB_WORKSPACE,
      listeners: {
        stdline: core.debug,
        debug: core.debug,
      },
    };

    await exec('git', ['config', 'user.name', `"${USER_NAME}"`], options);
    await exec('git', ['config', 'user.email', `"${USER_EMAIL}"`], options);

    await exec('git', ['remote', 'add', 'publisher', REMOTE_REPO], options);
    await exec('git', ['show-ref'], options);
    await exec('git', ['branch', '--verbose'], options);

    await exec('git', ['add', '-A'], options);
    
    try {
      await exec('git', ['commit', '-m', `${MESSAGE}`], options);
      await exec('git', ['tag', `${TAG}`], options);
    } catch (err) {
      core.debug('nothing to commit, working tree clean');
      return;
    }

    await exec('git', ['branch', 'tmp'], options);
    await exec('git', ['checkout', 'master'], options);
    await exec('git', ['merge', 'tmp'], options);
    await exec('git', ['push', 'publisher', 'master'], options);
  } catch (err) {
    core.setFailed(err.message);
    console.log(err);
  }
}

main();
