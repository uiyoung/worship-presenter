let bibleInfo;

const bookSelect = document.querySelector('#book');
const chapterSelect = document.querySelector('#chapter');
const verseSelect = document.querySelector('#verse');
const bibleInput = document.querySelector('#bible-input');
const searchBibleBtn = document.querySelector('#search-bible-btn');

bookSelect.addEventListener('change', (e) => {
  const bookIndex = e.target.value;
  setChapterSelect(bookIndex);
});

chapterSelect.addEventListener('change', async (e) => {
  const bookIndex = bookSelect.value;
  const chapterIndex = e.target.value;
  setVerseSelect(bookIndex, chapterIndex);
  if (bookIndex === '' || chapterIndex === '') {
    return;
  }
  const bibleData = await getBible(bookIndex, chapterIndex);
  renderBible(bibleData);
});

verseSelect.addEventListener('change', async (e) => {
  const bookIndex = bookSelect.value;
  const chapterIndex = chapterSelect.value;
  const verseIndex = e.target.value;

  const bibleData = await getBible(bookIndex, chapterIndex);
  if (verseIndex === '') {
    renderBible(bibleData);
    return;
  }

  const selectedVerse = {};
  selectedVerse[verseIndex] = bibleData.verses[verseIndex];
  const filteredBibleData = { ...bibleData, verses: selectedVerse };

  renderBible(filteredBibleData, verseIndex);
});

bibleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBibleBtn.dispatchEvent(new Event('click'));
  }
});

searchBibleBtn.addEventListener('click', async () => {
  const search = bibleInput.value.trim();
  const inputRegex = /^.+ \d+(?::\d+(?:-\d+)?)?$/;

  if (!inputRegex.test(search)) {
    alert(
      '올바른 형식을 입력해주세요.\n\ne.g. 창 3, 창 3:4, 창 3:4-7\ne.g. 창세기 3, 창세기 3:4, 창세기 3:4-7'
    );
    bibleInput.focus();
    return;
  }

  // 1. book 분리
  const parts = search.split(' ');
  const bookName = parts[0];
  const { books } = bibleInfo;
  const book = books.find(
    (book) => book.abbrevTitle === bookName || book.title === bookName
  );
  if (!book) {
    alert(`${bookName}을(를) 찾을 수 없습니다.`);
    return;
  }
  const { no: bookIndex, chapterNo: maxChapterNo, verseNos } = book;

  // 2. chapter 분리
  const chapterVerse = parts[1].split(':');
  const chapter = chapterVerse[0];
  if (Number(chapter) > Number(maxChapterNo)) {
    alert(
      `${book.title} ${chapter}장을 찾을 수 없습니다.\n(${book.title}의 마지막 장 : ${maxChapterNo})`
    );
    return;
  }
  const maxVerseNo = verseNos[chapter - 1];

  // 3. verse 분리
  const verseRange = chapterVerse[1]?.split('-') || [1, maxVerseNo];
  const startVerse = verseRange[0];
  const endVerse = Math.min(verseRange[1], maxVerseNo) || startVerse;

  if (Number(startVerse) > Number(endVerse)) {
    alert('시작하는 절이 끝나는 절 보다 큽니다.');
    return;
  }
  const response = await fetch(`/bibles/NKRV/${bookIndex}/${chapter}.json`);
  const { verses } = await response.json();

  const result = {};
  for (let i = startVerse; i <= endVerse; i++) {
    result[i] = verses[i];
  }

  const bibleData = { title: book.title, chapter, verses: { ...result } };
  renderBible(bibleData);

  bookSelect.value = '';
  chapterSelect.value = '';
  verseSelect.value = '';
});

function setChapterSelect(bookIndex) {
  chapterSelect.innerHTML = '';
  const chapterOrSection = bookIndex === '19' ? '편' : '장';
  const option = document.createElement('option');
  option.label = `${chapterOrSection} 선택`;
  chapterSelect.appendChild(option);

  const maxChapterNo = bibleInfo.books.find(
    (book) => book.no === bookIndex
  ).chapterNo;

  for (let i = 1; i <= maxChapterNo; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = `${i}${chapterOrSection}`;
    chapterSelect.appendChild(option);
  }
}

function setVerseSelect(bookIndex, chapterIndex) {
  verseSelect.innerHTML = '';

  const option = document.createElement('option');
  option.label = '전체';
  verseSelect.appendChild(option);

  if (bookIndex === '' || chapterIndex === '') {
    return;
  }

  const verseNo = bibleInfo.books.find((book) => book.no === bookIndex)
    .verseNos[chapterIndex - 1];
  for (let i = 1; i <= verseNo; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = `${i}절`;
    verseSelect.appendChild(option);
  }
}

function renderBible(bibleData) {
  const { title: bookName, chapter, verses } = bibleData;

  const sortedKeys = Object.keys(verses).sort((a, b) => a - b);
  const startVerseNo = sortedKeys[0];
  const endVerseNo = sortedKeys[sortedKeys.length - 1];
  let verseInfo = `${startVerseNo}-${endVerseNo}`;
  if (sortedKeys.length === 1) {
    verseInfo = `${startVerseNo}`;
  }
  const title = `${bookName} ${chapter}${
    bookName === '시편' ? '편' : '장'
  } ${verseInfo}절`;

  const bibleTitle = document.querySelector('#bible-title');
  bibleTitle.innerHTML = title;
  const bibleSelectAllBtn = document.querySelector('#bible-select-all');
  bibleSelectAllBtn.hidden = false;
  bibleSelectAllBtn.onclick = () => {
    setList.push({
      no: setList.length + 1,
      type: 'bible',
      data: {
        title,
        bookName,
        chapter,
        verses,
      },
    });
    renderSetlist();
  };

  const bibleList = document.querySelector('#bible-list');
  bibleList.innerHTML = '';

  for (const key of sortedKeys) {
    const li = document.createElement('li');
    li.classList = 'list-group-item d-flex justify-content-between';
    li.id = `verse${key}`;

    const span = document.createElement('span');
    span.classList = 'me-1 d-flex';

    const verseNo = document.createElement('a');
    // verseNo.href = `#verse${key}`;
    // verseNo.onclick = () => {
    //   verseSelect.value = key;
    //   verseSelect.dispatchEvent(new Event('change'));
    // };
    verseNo.classList = 'me-2 opacity-75 text-success-emphasis';
    verseNo.innerHTML = key;
    span.appendChild(verseNo);

    const verse = document.createElement('span');
    verse.classList = 'keep-all';
    verse.innerHTML = verses[key];
    span.appendChild(verse);
    li.appendChild(span);

    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.classList =
      'btn btn-primary btn-sm text-nowrap align-self-center';
    selectBtn.innerHTML = '선택';
    selectBtn.onclick = () => {
      setList.push({
        no: setList.length + 1,
        type: 'bible',
        data: {
          title: `${bookName} ${chapter}${
            bookName === '시편' ? '편' : '장'
          } ${key}절`,
          bookName,
          chapter,
          verses: { [key]: verses[key] },
        },
      });
      renderSetlist();
    };

    li.appendChild(selectBtn);
    bibleList.appendChild(li);
  }
}

async function getBible(bookIndex, chapterIndex) {
  if (bookIndex === '') {
    alert('성경을 선택해주세요.');
    return;
  }

  if (chapterIndex === '') {
    alert('장을 선택해주세요.');
    return;
  }

  try {
    const response = await fetch(
      `/bibles/NKRV/${bookIndex}/${chapterIndex}.json`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function initBible() {
  try {
    const response = await fetch('/bibles/NKRV/index.json');
    bibleInfo = await response.json();

    // setChapterSelect('1');
    // setVerseSelect('1', 1);
    // const bible = await getBible(1, 1);
    // renderBible(bible, 1);
  } catch (error) {
    console.error(error);
  }
}

initBible();
