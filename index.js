const workerFarm = require('worker-farm');
const workers = workerFarm({
  autoStart: true,
  maxConcurrentWorkers: 4,
}, require.resolve('./transform'));
const fs = require('fs');
const { Transform } = require('stream');

const [,, inpF, outF] = process.argv;

const wStream = fs.createWriteStream(outF);

let articleI = 0;
const parseText = (chunk, enc, cb) => {
  chunk = chunk.toString();
  const fAo = chunk.indexOf('<article');
  const lAc = chunk.lastIndexOf('</article>');
  let articles = chunk.substr(fAo, lAc - fAo + 10);

  articles = articles.split('</article>');
  articles.pop();
  articles.map(v => v + '</article>');

  let j = 0;
  for (let i = 0; i < articles.length; i++) {
    workers(articles[i], (err, outp) => {
      wStream.write(outp, () => {
        j++;
        if (j === articles.length) {
          articleI++;
          console.log('Articleset ' + articleI + ' parsed');
          cb(null);
        }
      });
    })
  }
}

const rStream = fs.createReadStream(inpF, { highWaterMark: 2 * 1024 * 1024 });

const stream = rStream
  .pipe(new Transform({ transform: parseText }))

stream.on('finish', () => {
  workerFarm.end(workers);
});
