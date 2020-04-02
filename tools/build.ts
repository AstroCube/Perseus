import shell from 'shelljs';

const buildFolder = './build/';

const folders = new Set(['./src/services/templates']);

folders.forEach((folder) => {
    shell.cp('-R', folder, buildFolder);
});
