// Update documents.json
const {
  readdirSync
} = require('fs');

var fs = require('fs')

const FOLDER = './src/assets/documents';
var docs = readdirSync(FOLDER);
var documents = [];

docs.forEach(process);

// console.log(documents);

fs.writeFileSync('src/documents.json', JSON.stringify(documents), {
  encoding: 'utf8',
  flag: 'w'
})

console.log('File documents.json updated!')

function process(item, index) {
  if (!item.startsWith(".")) {
    var doc = {};
    doc.file = 'assets/documents/' + item;
    doc.title = item.split("-")[1].slice(0, -5).replace('_', ' ');
    doc.chapter = Number(item.split("-")[0].split(".")[0]);
    doc.lesson = Number(item.split("-")[0].split(".")[1]);
    documents.push(doc);
  }
}
