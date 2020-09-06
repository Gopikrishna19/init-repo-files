const fs = require('fs');
const path = require('path');

const files = [];
const maps = files.reduce((map, file) => Object.assign(map, {
    [file]: file,
}), {
    '.editorconfig': 'editorconfig.ini',
    '.gitignore': 'gitignore.txt',
});

const handleError = (file, err) => {
    console.log(`Something went wrong when writing ${file}.`);
    console.error(err);
    process.exitCode = 1;
};

const createErrorHandler = file => error => handleError(file, error);

Object.entries(maps).forEach(([file, template]) => {
    const destination = path.join(process.cwd(), file);
    const source = path.join(__dirname, 'templates', template);

    fs.stat(destination, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                const readStream = fs.createReadStream(source);
                const writeStream = fs.createWriteStream(destination);
                const errorHandler = createErrorHandler(file);

                readStream.on('error', errorHandler);
                writeStream.on('error', errorHandler);

                readStream.pipe(writeStream);

                writeStream.on('finish', () => {
                    console.log(`Wrote ${file} successfully.`);
                });
            } else {
                handleError(file, err);
            }
        } else {
            console.log(`Skipped ${file} as it already exists.`);
        }
    });
});
