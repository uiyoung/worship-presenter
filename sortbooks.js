const fs = require('fs');

// 전각괄호 포함된 verse 스캔
function scanChars() {
  const result = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/index.json`));
  for (const book of result.books) {
    for (let i = 1; i <= book.chapterNo; i++) {
      const chapter = JSON.parse(fs.readFileSync(`./public/bibles/NKRV/${book.no}/${i}.json`));
      for (const no in chapter.verses) {
        if (chapter.verses[no].includes('（')) {
          console.log(`${book.no}  ${i}장 ${no}절 - ${chapter.verses[no]}`);
        }
      }
    }
  }
}

scanChars();

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
