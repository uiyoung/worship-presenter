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

  const maxChapterNo = bibleInfo.books.find((book) => book.no === bookIndex).chapterNo;

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

  const verseNo = bibleInfo.books.find((book) => book.no === bookIndex).verseNos[chapterIndex - 1];

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

  const bibleTitle = document.querySelector('#bible-title');
  bibleTitle.innerHTML = `${result.title} ${result.chapter}${+bookIndex === 19 ? '편' : '장'}`;

  const bibleList = document.querySelector('#bible-list');
  bibleList.innerHTML = '';

  for (let i = 1; i <= Object.keys(result.verses).length; i++) {
    const li = document.createElement('li');
    li.classList = 'list-group-item d-flex justify-content-between';
    li.id = `verse${i}`;

    const span = document.createElement('span');
    span.classList = 'me-1 d-flex';

    const verseNo = document.createElement('a');
    verseNo.href = `#verse${i}`;
    verseNo.onclick = () => {
      verseSelect.value = i;
      verseSelect.dispatchEvent(new Event('change'));
    };
    verseNo.classList = 'me-2 opacity-75 text-success-emphasis';
    verseNo.innerHTML = i;
    span.appendChild(verseNo);

    const verse = document.createElement('span');
    verse.classList = i === Number(verseIndex) ? 'fw-bold' : '';
    verse.innerHTML = result.verses[i];
    span.appendChild(verse);
    li.appendChild(span);

    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.classList = 'btn btn-primary btn-sm text-nowrap align-self-center';
    selectBtn.innerHTML = '선택';
    selectBtn.onclick = () => {
      selectedList.push({
        no: selectedList.length + 1,
        type: 'bible',
        title: `${result.title} ${result.chapter}:${i}`,
        book: result.title,
        chapterNo: result.chapter,
        verseNo: i,
        verse: result.verses[i],
      });
      renderSetlist();
    };
    li.appendChild(selectBtn);

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
