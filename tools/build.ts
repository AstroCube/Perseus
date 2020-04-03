import shell from 'shelljs';

const buildFolder = './build/';

const folders = new Set(['./src/services/templates']);

folders.forEach((folder) => {
    const folderFinal = folder.replace('./src/', '');
    shell.cp('-R', folder, buildFolder + folderFinal);
});
