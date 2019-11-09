const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const _ = require('lodash');

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
  cb(null, crawl(arcDom).split('\n').map(parse).filter(filterLine).join('\n'));
}

function parse(line) {
  line = _.unescape(line);
  const newL = line.replace(new RegExp('&nbsp;', 'g'), ' ');
  return newL.length < 8 ? '' : newL;
}

function filterLine(line) {
  const ll = line.length;
  if (ll < 8) return false;
  const JUNK = ['Wiki', 'wiki', '    ', '{|', 'http', 'File:', 'style=', 'bar:', 'fontsize:', 'text:', 'shift:'];
  if (JUNK.some(junk => line.includes(junk)) || new RegExp('&.{1,6};').test(line) || new RegExp('\\(right|left|top|bottom|math)').test(line)) {
    return false;
  }
  return true;
}

module.exports = worker;
