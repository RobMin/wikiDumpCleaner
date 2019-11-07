const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function crawl(xml) {
  const selector = 'p';
  const JUNK_TAGS = ['script', 'style', 'svg', 'h', 'cell'];
  const rHTMLWithContent = /(<[^>]*>.*?<\/[^>]*>)?<[^>]*>/ig;
  return [].map.call(xml.querySelectorAll(selector),
    (item) => {
      JUNK_TAGS.forEach(tagName =>
        [].map.call(item.querySelectorAll(tagName),
          node => node.remove()));

      return item.innerHTML
        .replace(rHTMLWithContent, (tag) => tag === '</p>' ? '\n' : '' );

    }).join(' ');
}

function worker(chunk, cb) {
  const dom = new JSDOM(chunk);
  const arcDom = dom.window.document;
  cb(null, crawl(arcDom).split('\n').filter((a) => a.length > 3).join('\n'));
}

module.exports = worker;
