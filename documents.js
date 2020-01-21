// Update document jsons
const {
  readdirSync
} = require('fs');

var fs = require('fs')

const FOLDER = './src/assets/documents';
var docs = readdirSync(FOLDER);
var topics = {};
var chapters = {};

docs.forEach(process);

write('chapters.json', chapters);
write('topics.json', topics);

console.log('File chapters.json and topics.json updated!')

function process(item, index) {
  if (!item.startsWith(".")) {

    // Prepare variables
    let file = 'assets/documents/' + item;
    let title = item.split("-")[1].replace('.html', '');
    let chapter = Number(item.split("-")[0].split(".")[0]);
    let order = Number(item.split("-")[0].split(".")[1]);
    var lesson = item.split("-")[2];
    lesson = lesson == null ? 0 : parseInt(lesson[0]);
    let fullTitle = lesson == 0 ? title : title + " " + lesson;
    let id = fullTitle.toLowerCase().replace(/[^a-z0-9_-]+/gi, '-')

    // Build a lesson for a chapter and a lesson for a topic
    var chapterLesson = {},
      topicLesson = {};
    chapterLesson.id = topicLesson.id = id;
    chapterLesson.file = topicLesson.file = file;
    chapterLesson.title = topicLesson.title = fullTitle;
    chapterLesson.lesson = order;
    if (lesson != 0) {
      topicLesson.lesson = lesson;
    }

    // Insert the lessons in chapters and topics
    insert(chapter, chapterLesson, chapters);
    insert(title, topicLesson, topics);
  }
}

function insert(id, item, list) {
  if (list[id]) {
    list[id].push(item)
  } else {
    list[id] = [item]
  }
}

function write(file, list) {
  fs.writeFileSync('src/assets/' + file, JSON.stringify(list), {
    encoding: 'utf8',
    flag: 'w'
  })
}
