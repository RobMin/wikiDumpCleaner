const fs = require('fs');
const rimraf = require('rimraf');

const [,, FILE_COUNT_INPUT] = process.argv;

const fileNames = fs.readdirSync('./dump');
if (fileNames.length < Number(FILE_COUNT_INPUT)) {
  throw new Error('There aren\'t that much files');
}
const FILE_COUNT = Number(FILE_COUNT_INPUT) || 40;

let rands = new Set();
while (rands.size < FILE_COUNT) {
	rands.add(Math.floor(Math.random() * fileNames.length));
}

rands = [...rands];
const fileNamesToCopy = rands.map(randI => fileNames[randI]);

if (fs.existsSync('./dump2')) {
  rimraf.sync("/some/directory");
}
fs.mkdirSync('./dump2');

fileNamesToCopy.forEach(fileName => {
  const chunk = fs.readFileSync(`./dump/${fileName}`, 'utf8');

  const fAo = chunk.indexOf('<article');
  const lAc = chunk.lastIndexOf('</article>');
  let cleanChunk = chunk.substr(fAo, lAc - fAo + 10);

  fs.writeFileSync(`./dump2/${fileName}`, cleanChunk);
});
