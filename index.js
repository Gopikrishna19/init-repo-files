const fs = require('fs');
const path = require('path');

const files = [
    '.editorconfig',
    '.gitignore',
];

files.forEach(file => {
    const destination = path.join(process.cwd(), file);

    fs.stat(destination, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                const source = path.join(__dirname, file);
                const writeStream = fs.createWriteStream(destination);

                fs.createReadStream(source)
                    .pipe(writeStream);

                writeStream.on('finish', () => {
                    console.log(`Wrote ${file} successfully.`);
                });
            } else {
                console.log(`Something went wrong when writing ${file}.`);
                console.error(err);
                process.exitCode = 1;
            }
        } else {
            console.log(`Skipped ${file} as it already exists.`);
        }
    });
});
