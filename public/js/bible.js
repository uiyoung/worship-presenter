let bibleInfo;

const bookSelect = document.querySelector('#book');
const chapterSelect = document.querySelector('#chapter');
const verseSelect = document.querySelector('#verse');

bookSelect.addEventListener('change', (e) => {
  const bookIndex = e.target.value;
  setChapter(bookIndex);
  getBible(bookIndex, 1, 1);
});

chapterSelect.addEventListener('change', (e) => {
  const bookIndex = bookSelect.value;
  const chapterIndex = Number(chapterSelect.value);
  setVerse(bookIndex, chapterIndex);
  getBible(bookIndex, chapterIndex, 1);
});

verseSelect.addEventListener('change', (e) => {
  const bookIndex = bookSelect.value;
  const chapterIndex = chapterSelect.value;
  const verseIndex = e.target.value;
  getBible(bookIndex, chapterIndex, verseIndex);
  location.href = `#verse${verseIndex}`;
});

async function setChapter(bookIndex) {
  // const response = await fetch('/bibles/NKRV/index.json');
  // const result = await response.json();
  // const maxChapterNo = result.books.filter((book) => book.no === bookIndex)[0].chapterNo;

  const maxChapterNo = bibleInfo.books.filter((book) => book.no === bookIndex)[0].chapterNo;

  chapterSelect.innerHTML = '';
  for (let i = 1; i <= maxChapterNo; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = `${i}장`;
    chapterSelect.appendChild(option);
  }
}

async function setVerse(bookIndex, chapterIndex) {
  // const response = await fetch('/bibles/NKRV/index.json');
  // const result = await response.json();
  // const verseNo = result.books.filter((book) => book.no === bookIndex)[0].verseNos[chapterIndex - 1];

  const verseNo = bibleInfo.books.filter((book) => book.no === bookIndex)[0].verseNos[chapterIndex - 1];

  verseSelect.innerHTML = '';
  for (let i = 1; i <= verseNo; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = `${i}절`;
    verseSelect.appendChild(option);
  }
}

async function getBible(bookIndex, chapterIndex, verseIndex) {
  const response = await fetch(`/bibles/NKRV/${bookIndex}/${chapterIndex}.json`);
  const result = await response.json();
  // console.log(result.verses[verseIndex]);
  // console.log(result);
  // console.log(Object.keys(result.verses).length);

  const bibleTitle = document.querySelector('#bible-title');
  bibleTitle.innerHTML = result.title;

  const bibleList = document.querySelector('#bible-list');
  bibleList.innerHTML = '';
  for (let i = 1; i <= Object.keys(result.verses).length; i++) {
    const li = document.createElement('li');
    li.classList = 'list-group-item d-flex justify-content-between';
    li.id = `verse${i}`;

    const span = document.createElement('span');
    span.classList = 'me-1';

    const verseNo = document.createElement('span');
    verseNo.classList = 'small me-2 opacity-75 text-success-emphasis';
    verseNo.innerHTML = i;
    span.appendChild(verseNo);

    const verse = document.createElement('span');
    verse.classList = i === Number(verseIndex) ? 'fw-bold' : '';
    verse.innerHTML = result.verses[i];
    span.appendChild(verse);

    li.appendChild(span);

    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.classList = 'btn btn-primary btn-sm text-nowrap align-self-center disabled';
    selectBtn.innerHTML = '선택';
    li.appendChild(selectBtn);

    // li.innerHTML = result.verses[i];
    bibleList.appendChild(li);
  }
}

async function init() {
  try {
    const response = await fetch('/bibles/NKRV/index.json');
    bibleInfo = await response.json();
    setChapter('1');
    setVerse('1', 1);
    getBible(1, 1, 1);
  } catch (error) {
    console.error(error);
  }
}

init();