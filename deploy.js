const nodeSsh = require('node-ssh');
const chalk = require('chalk');

/**
 * @param {string} sshKeyPath - path to your ssh key
 */
const deploy = async sshKeyPath => {
    const sshClient = new nodeSsh();

    // SSH auth
    console.log(chalk.blue('Logging in ssh...'));
    await sshClient.connect({
        host: '',
        username: 'root',
        privateKey: sshKeyPath,
    });
    console.log(chalk.blue('Logged in!'));

    // Git pull
    console.log(chalk.green('Git pull...'));
    const gitRes = await sshClient.execCommand('cd stockswatcher && git pull');
    console.log(gitRes.stdout);
    console.log(gitRes.stderr);
    console.log(chalk.green('Git pull done!'));

    // Build docker containers
    console.log(chalk.yellow('Updating docker containers...'));
    const dockerRes = await sshClient.execCommand('cd stockswatcher && docker-compose up --build -d');
    console.log(dockerRes.stdout);
    console.log(dockerRes.stderr);
    console.log(chalk.yellow('Docker containers updated!'));
    console.log(chalk.blue.bold('Changes deployed!'));

    await sshClient.execCommand('exit');
    console.log(chalk.green.bold('Connection closed!'));

    process.exit(0);
};

const [, , sshKeyPath] = process.argv;
(async () => await deploy(sshKeyPath))();