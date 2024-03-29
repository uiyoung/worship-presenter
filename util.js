const fs = require('fs');

// search bible
// 창 1:3-7
// 요일, 요1, 요이, 요2 전부 검색가능해야한다!
// 창 1로 검색했을 때 창세기 1장 1절부터 끝까지 나오기

// const search = '창 1:3-7';
// const search = '창 1:3-100'; // 끝절보다 큰 수 입력한 경우
// const search = '창 1:7-7'; // endVerse == startVerse 인 경우
// const search = '창 1:7-4'; // endVerse > startVerse 인 경우
// const search = '창 1:3'; // endVerse 없는 경우
const search = '창세기 1'; // verseRange 없는 경우
// const search = '창 1:'; // verseRange 없는 경우
// const search = '창 1:asdf'; // verseRange 없는 경우
// const inputRegex = /^.+ \d+:\d+(?:-\d+)?$/;
const inputRegex = /^.+ \d+(?::\d+(?:-\d+)?)?$/;

if (!inputRegex.test(search)) {
  console.log('올바른 형식을 입력해주세요.');
  return;
}

// 1. book 분리
const parts = search.split(' ');
const bookName = parts[0];

const { books } = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
const { no, verseNos } = books.find((book) => book.abbrevTitle === bookName || book.title === bookName);

// 2. chapter 분리
const chapterVerse = parts[1].split(':');
const chapter = chapterVerse[0];
const maxVerseNo = verseNos[chapter - 1];

// 3. verse 분리
const verseRange = chapterVerse[1]?.split('-') || [1, maxVerseNo];
const startVerse = verseRange[0];
const endVerse = Math.min(verseRange[1], maxVerseNo) || startVerse;

if (Number(startVerse) > Number(endVerse)) {
  console.log('시작절이 끝절 보다 큽니다.');
  return;
}

console.log('책:', bookName);
console.log('장:', chapter);
console.log('시작 절:', startVerse);
console.log('끝 절:', endVerse);

const { verses } = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${no}/${chapter}.json`));
const results = {};
for (let i = startVerse; i <= endVerse; i++) {
  results[i] = verses[i];
}
console.log(results);

// const song = JSON.parse(fs.readFileSync(`./public/hymn/lyrics/10.json`));
// for (let key in song.verses) {
//   console.log(key, song.verses[key]);
// }

// const songs = JSON.parse(fs.readFileSync(`./public/hymn/temp/temp.json`));
// songs.forEach((song) => {
//   const lyrics = song.lyrics.split(/\d+\./).filter(Boolean);
//   const verses = {};
//   for (let i = 0; i < lyrics.length; i++) {
//     verses[i + 1] = lyrics[i].trim();
//   }

//   const newObj = {
//     no: Number(song.no),
//     title: song.title,
//     verses,
//   };
//   console.log(newObj);
//   fs.writeFileSync(`./public/hymn/temp/${song.no}.json`, JSON.stringify(newObj));
// });

// console.log(songs);

// const lyrics = JSON.parse(fs.readFileSync(`./public/hymn/lyrics/200.json`));
// const verses = Object.keys(lyrics.verses)
//   .sort()
//   .reduce((newObj, key) => {
//     newObj[key] = lyrics.verses[key].trim();
//     return newObj;
//   }, {});
// console.log({ no: 200, title: lyrics.title.split('. ')[1], verses });

// for (let i = 1; i <= 645; i++) {
//   const lyrics = JSON.parse(fs.readFileSync(`./public/hymn/lyrics/${i}.json`));
//   const verses = Object.keys(lyrics.verses)
//     .sort()
//     .reduce((newObj, key) => {
//       newObj[key] = lyrics.verses[key].trim();
//       return newObj;
//     }, {});
//   console.log({ no: i, title: lyrics.title.split('. ')[1], verses });

//   fs.writeFileSync(
//     `./public/hymn/lyrics2/${i}.json`,
//     JSON.stringify({ no: i, title: lyrics.title.split('. ')[1], verses: { ...verses } })
//   );
// }

// genereate hymn index
// const hymn = [];
// for (let i = 1; i <= 645; i++) {
//   const lyrics = JSON.parse(fs.readFileSync(`./public/hymn/lyrics/${i}.json`));
//   hymn.push({ no: i, title: lyrics.title.split('. ')[1] });
// }
// fs.writeFileSync(`./public/hymn/index.json`, JSON.stringify({ version: '새찬송가', hymn: [...hymn] }));

// 전각괄호 포함된 verse 스캔
// function scanChars() {
//   const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
//   for (const book of result.books) {
//     for (let i = 1; i <= book.chapterNo; i++) {
//       const chapter = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${book.no}/${i}.json`));
//       for (const no in chapter.verses) {
//         if (chapter.verses[no].includes('（') || chapter.verses[no].includes('）')) {
//           console.log(`${book.no}  ${i}장 ${no}절 - ${chapter.verses[no]}`);
//         }
//       }
//     }
//   }
// }

// scanChars();

// const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
// // console.log([...result.books]);

// const titles = result.books.reduce((acc, cur) => {
//   const { title } = cur;
//   acc.push(title);
//   return acc;
// }, []);
// console.log(titles);

// const index = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
// for (let i = 0; i < 66; i++) {
//   fs.mkdirSync(`./public/bibles/NKRV/temp/${i + 1}`);
//   const { chapterNo } = index.books[i];
//   for (let j = 0; j < chapterNo; j++) {
//     const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${i + 1}/${j + 1}.json`));
//     // console.log({ title: result.title.split(' ')[0], chapter: 1, verses: result.verses });
//     const newObj = { title: result.title.split(' ')[0], chapter: j + 1, verses: result.verses };

//     fs.writeFileSync(`./public/bibles/NKRV/temp/${i + 1}/${j + 1}.json`, JSON.stringify({ ...newObj }));
//   }
// }

// const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${1}/${1}.json`));
// const newObj = Object.keys(result.verses).reduce((newObj, key) => {
//   newObj[key] = result.verses[key];
//   return newObj;
// }, {});
// console.log(newObj);

// function sortBooks() {
//   const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
//   for (const book of result.books) {
//     fs.mkdirSync(`./temp2/NKRV/${book.no}`);
//     for (let i = 1; i <= book.chapterNo; i++) {
//       const result = JSON.parse(fs.readFileSync(`./temp/NKRV/${book.no}/${i}.json`));
//       const newObj = Object.keys(result)
//         .sort()
//         .reduce((newObj, key) => {
//           newObj[key] = result[key];
//           return newObj;
//         }, {});
//       // console.log(newObj);

//       fs.writeFileSync(`./temp2/NKRV/${book.no}/${i}.json`, JSON.stringify({ ...newObj }));
//     }
//   }
// }

// sortBooks();

// function sortBooks() {
//   const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
//   for (const book of result.books) {
//     fs.mkdirSync(`./temp/NKRV/${book.no}`);
//     for (let i = 1; i <= book.chapterNo; i++) {
//       const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${book.no}/${i}.json`));
//       const newObj = Object.keys(result.verses)
//         .sort()
//         .reduce((newObj, key) => {
//           newObj[key] = result.verses[key];
//           return newObj;
//         }, {});

//       fs.writeFileSync(`./temp/NKRV/${book.no}/${i}.json`, JSON.stringify({ ...result, verses: { ...newObj } }));
//     }
//   }
// }

// sortBooks();

// const chapterNos = [
//   50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1,
//   4, 7, 3, 3, 3, 2, 14, 4, 28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22,
// ];
// const response = await fetch(`/bibles/NKRV/index.json`);
// const result = await response.json();
// for (let i = 0; i < result.books.length; i++) {
//   result.books[i].chapterNo = chapterNos[i];
// }
// console.log(result.books);

// async function appendChapters() {
//   const response = await fetch(`/bibles/NKRV/index.json`);
//   const result = await response.json();
//   for (const book of result.books) {
//     const verseNos = [];
//     for (let i = 1; i <= book.chapterNo; i++) {
//       const response = await fetch(`/bibles/NKRV/${book.no}/${i}.json`);
//       const result = await response.json();
//       verseNos.push(Object.keys(result.verses).length);
//     }
//     book.verseNos = verseNos;
//     console.log(book);
//   }
//   console.log(result.books);
// }

// appendChapters();
