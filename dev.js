const util = require('util');
const fs = require('fs');
const {exec} = require('child_process');

const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const run = util.promisify(exec);

class DeveloperEnvironment {
    async setup() {
        await this.installDependencies();
        await this.removeDocker();
        await this.addHosts();
        await this.addCertificates();
        await this.buildDocker();
        await this.startDocker();
    }

    async stop() {
        console.log('Stopping containers...');
        const res = await run('docker-compose -f docker-compose.dev.yml stop');
        console.log(res.stdout || res.stderr);
        console.log('Containers stopped!');
    }

    async start() {
        await this.startDocker();
    }

    async restart() {
        console.log('Restarting containers...');
        const res = await run('docker-compose -f docker-compose.dev.yml restart');
        console.log(res.stdout || res.stderr);
        console.log('Containers restarted!');
    }

    async removeDocker() {
        console.log('Removing containers...');
        const res = await run('docker-compose -f docker-compose.dev.yml down');
        console.log(res.stdout || res.stderr);
        console.log('Containers removed!');
    }

    async buildDocker() {
        try {
            await run('docker network create json-nginx-proxy');
        } catch (err) {
            //
        }

        console.log('Building containers... This will take a while...');
        const res = await run('docker-compose -f docker-compose.dev.yml build --no-cache');
        console.log(res.stdout || res.stderr);
        console.log('Containers built!');

    }

    async startDocker() {
        console.log('Starting up docker containers...');
        const res = await run('docker-compose -f docker-compose.dev.yml up -d');
        console.log(res.stdout || res.stderr);
        console.log('Everything is up and running! Hopefully...');
    }

    async addCertificates() {
        console.log('Setting up local certificates...');
        try {
            await access('./certs', fs.constants.F_OK);
            console.log('Already have certificates, skipping!');
        } catch (err) {
            await mkdir('./certs');
            await run('cd ./certs');
            await run('npm run ssl');
            await run('cd ./certs && mv ssl.crt stockswatcher.local.crt && mv ssl.key stockswatcher.local.key');
            console.log('Certificates added!');
        }
    }

    async addHosts() {
        await run('sudo chmod 777 /etc/hosts');
        console.log('Setting up hosts file...');
        const test = await readFile('/etc/hosts');

        // already set up.
        if (test.toString().includes('stockswatcher')) {
            return console.log('Hosts file already set up. Skipping...');
        }

        console.log('Writing hosts file...');
        await appendFile('/etc/hosts', '\n# Stocks Watcher\n127.0.0.1 stockswatcher.local');
        console.log('Hosts file setup!');
    }

    async installDependencies() {
        console.log('Installing base dependencies...');
        await run('npm i');
        console.log('Done!');
    }
}

const [, , cmd] = process.argv;

const validCommands = ['setup', 'start', 'restart', 'stop'];

if (!validCommands.includes(cmd)) {
    return console.log(`Invalid command!\nAvailable commands: ${validCommands.join(', ')}`)
}

(() => (new DeveloperEnvironment())[cmd]())();