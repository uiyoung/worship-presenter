const ITEMS_PER_PAGE = 10;

let selectedSongs = [];

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', (e) => {
    // Button that triggered the modal
    const button = e.relatedTarget;
    // Extract info from data-bs-* attributes

    const recipient = button.getAttribute('data-bs-whatever');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title');
    const modalBodyInput = exampleModal.querySelector('.modal-body input');

    modalTitle.textContent = `New message to ${recipient}`;
    modalBodyInput.value = recipient;
  });
}

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchSong();
  }
});

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
  searchSong();
});

function searchSong() {
  if (searchInput.value.trim() === '') {
    alert('검색어를 입력해주세요.');
    searchInput.focus();
    return;
  }

  render(searchInput.value.trim(), 1);
}

async function getSongsByPage(title, page) {
  try {
    const res = await fetch(`/song?title=${title}&page=${page}`);
    const songs = await res.json();
    return songs;
  } catch (error) {
    console.error(error);
  }
}

async function getTotalSongCount(title) {
  try {
    const res = await fetch(`/song/count?title=${title}`);
    const { count } = await res.json();
    return count;
  } catch (error) {
    console.error(error);
  }
}

async function render(title, pageNum) {
  const songs = await getSongsByPage(title, pageNum);
  renderSearchTable(songs);

  const totalCount = await getTotalSongCount(title);
  renderPagination(totalCount, pageNum, title);

  renderSearchInfo(title, totalCount);
}

function renderSearchInfo(title, totalCount) {
  const resultInfo = document.querySelector('#search-info');
  resultInfo.innerHTML = '';

  if (title === '%' || title === '') {
    resultInfo.hidden = true;
    return;
  }

  const span = document.createElement('span');
  span.innerHTML = `'${title}' 검색결과 : 총 ${totalCount} 건`;
  span.className = 'small col-auto';
  resultInfo.appendChild(span);

  const button = document.createElement('button');
  button.innerHTML = 'x';
  button.className = 'btn btn-danger btn-sm col-auto';
  button.onclick = () => {
    searchInput.value = '';
    render('%', 1);
  };

  span.appendChild(button);
  resultInfo.hidden = false;
}

function renderSearchTable(songs) {
  const tbody = document.querySelector('#search-table tbody');
  tbody.innerHTML = '';

  if (songs.length <= 0) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.colSpan = 4;
    const span = document.createElement('span');
    span.innerHTML = '검색된 곡이 없습니다. ';
    td.appendChild(span);
    const a = document.createElement('a');
    a.href = '/song/new';
    a.innerHTML = '새로 등록하기';
    td.appendChild(a);
    tr.appendChild(td);
    tbody.append(tr);
    return;
  }

  songs.forEach((song, idx) => {
    const tr = document.createElement('tr');
    // no
    let td = document.createElement('td');
    td.innerHTML = idx + 1;
    tr.appendChild(td);
    // type
    td = document.createElement('td');
    const span = document.createElement('span');
    span.className = `badge rounded-pill ${song.type === 'HYMN' ? 'text-bg-warning' : 'text-bg-info'}`;
    span.innerHTML = song.type;
    td.appendChild(span);
    tr.appendChild(td);
    // title
    td = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.href = '#';
    titleLink.innerHTML = song.title;
    // todo open modal
    titleLink.onclick = () => {
      alert(song.id);
    };
    td.className = 'text-start';
    td.appendChild(titleLink);
    tr.appendChild(td);
    // select btn
    td = document.createElement('td');
    const selectBtn = document.createElement('a');
    selectBtn.href = '#';
    selectBtn.innerHTML = '선택';
    selectBtn.onclick = (e) => {
      e.preventDefault();
      selectSong(song.id);
    };
    td.appendChild(selectBtn);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function renderPagination(totalCount, currentPage, title) {
  const paginationElement = document.querySelector('#search-pagination');
  paginationElement.innerHTML = '';

  if (totalCount <= 0) {
    return;
  }

  const totalPage = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // prev
  let li = document.createElement('li');
  li.className = `page-item ${currentPage == 1 ? 'disabled' : ''}`;
  let a = document.createElement('a');
  a.className = 'page-link';
  a.innerHTML = '이전';
  a.href = '#';
  a.onclick = (e) => {
    e.preventDefault();
    render(title, currentPage - 1);
  };
  li.appendChild(a);
  paginationElement.appendChild(li);

  // page numbers
  for (let i = 0; i < totalPage; i++) {
    li = document.createElement('li');
    li.className = `page-item ${i + 1 === currentPage ? 'active' : ''}`;
    a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = i + 1;
    a.href = '#';
    a.onclick = (e) => {
      e.preventDefault();
      render(title, i + 1);
    };
    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // next
  li = document.createElement('li');
  li.className = `page-item ${currentPage + 1 > totalPage ? 'disabled' : ''}`;
  a = document.createElement('a');
  a.className = 'page-link';
  a.innerHTML = '다음';
  a.href = '#';
  a.onclick = (e) => {
    e.preventDefault();
    render(title, currentPage + 1);
  };
  li.appendChild(a);
  paginationElement.appendChild(li);
}

async function selectSong(id) {
  const result = selectedSongs.some((song) => song.id === id);
  if (result) {
    alert('이미 선택된 곡입니다.');
    return;
  }

  try {
    const res = await fetch(`/song/${id}`);
    const song = await res.json();
    selectedSongs.push(song);
    console.log(selectedSongs);

    renderSetlistTable();
  } catch (error) {
    console.error(error);
  }
}

function renderSetlistTable() {
  const tbody = document.querySelector('#setlist-table tbody');
  tbody.innerHTML = '';

  if (selectedSongs.length <= 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.innerHTML = '선택된 곡이 없습니다.';
    tr.appendChild(td);
    tbody.append(tr);
    return;
  }

  selectedSongs.forEach((song, idx) => {
    const tr = document.createElement('tr');
    // no
    let td = document.createElement('td');
    td.innerHTML = idx + 1;
    tr.appendChild(td);
    // title
    td = document.createElement('td');
    td.innerHTML = song.title;
    td.className = 'text-start';
    tr.appendChild(td);
    // removeBtn
    td = document.createElement('td');
    const removeBtn = document.createElement('a');
    removeBtn.href = '#';
    removeBtn.innerHTML = '취소';
    removeBtn.onclick = (e) => {
      e.preventDefault();
      selectedSongs = selectedSongs.filter((e) => e.id !== song.id);
      renderSetlistTable();
    };
    td.appendChild(removeBtn);
    tr.appendChild(td);

    tbody.append(tr);
  });
}

const initBtn = document.querySelector('#init-button');
initBtn.addEventListener('click', () => {
  if (selectedSongs.length <= 0) {
    alert('선택된 곡이 없습니다.');
    return;
  }
  if (!confirm('선택된 곡 목록을 초기화하시겠습니까?')) {
    return;
  }

  selectedSongs = [];
  renderSetlistTable();
});

// PPT 생성
const generateBtn = document.querySelector('#generate-btn');
generateBtn.addEventListener('click', (e) => {
  if (selectedSongs.length <= 0) {
    alert('곡을 먼저 선택해 주세요.');
    return;
  }

  // add loading spinner to button
  const originalBtnText = e.target.innerHTML;
  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm';
  spinner.role = 'status';
  spinner.ariaHidden = true;
  e.target.innerHTML = 'ppt 생성 중... ';
  e.target.disabled = true;
  e.target.appendChild(spinner);

  // align(left, center, right, justify)
  const align = 'center';

  // vertical align(top, middle, bottom)
  const valign = 'bottom';

  // 1. Create a new Presentation
  const pptx = new PptxGenJS();

  // font style
  // const fontFace = '나눔스퀘어라운드 Bold';
  //const fontFace = '나눔고딕 Bold';
  const fontFace = '다음_SemiBold';
  const fontSize = 36;
  const fontBold = false;
  const fontItalic = false;
  const fontUnderline = false;
  const fontColor = 'FFFFFF';
  const fontOutline = {
    size: 1.0,
    color: '000000',
  };
  const fontGlow = {
    size: 2,
    opacity: 1.0,
    color: '#000000',
  };

  const CM_1 = 28.346; // 1cm = 28.346pt

  selectedSongs.forEach((song) => {
    // sections by song
    pptx.addSection({ title: song.title });

    // title slide master
    pptx.defineSlideMaster({
      title: 'TITLE_SLIDE',
      background: {
        color: '009933',
      },
      objects: [
        {
          placeholder: {
            options: {
              name: 'song-title',
              type: 'title',
              w: '100%',
              h: '20%',
              autoFit: true,
              align: 'left',
              valign: 'top',
              fontSize: 24,
              fontFace,
              color: fontColor,
              outline: fontOutline,
              glow: fontGlow,
              margin: [CM_1, CM_1, CM_1, CM_1],
            },
            text: '(title here!)',
          },
        },
      ],
    });

    // lyrics slide master
    pptx.defineSlideMaster({
      title: 'LYRICS_SLIDE',
      background: {
        color: '009933',
      },
      objects: [
        {
          placeholder: {
            options: {
              name: 'lyrics-body',
              type: 'body',
              w: '100%',
              h: '100%',
              autoFit: true,
              align,
              valign,
              bold: fontBold,
              italic: fontItalic,
              underline: fontUnderline,
              fontSize,
              fontFace,
              color: fontColor,
              outline: fontOutline,
              glow: fontGlow,
              lineSpacing: fontSize * 1.025,
              margin: [1, 1, CM_1, CM_1],
            },
            text: '(lyrics here!)',
          },
        },
      ],
    });

    // add title slide
    const slide = pptx.addSlide({ masterName: 'TITLE_SLIDE', sectionTitle: song.title });
    slide.addText(song.title, { placeholder: 'song-title' });

    const lyricsPerSlideArr = song.lyrics.split('\n\n');

    // Add Lyrics Slide
    lyricsPerSlideArr.forEach((lyrics) => {
      const slide = pptx.addSlide({ masterName: 'LYRICS_SLIDE', sectionTitle: song.title });

      // Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
      slide.addText(lyrics, { placeholder: 'lyrics-body' });
    });

    console.log(song);
  });

  // 4. Save the Presentation
  const worshipName = prompt('워십의 이름을 적어주세요.');

  pptx.writeFile({ fileName: `${worshipName}.pptx` }).then((fileName) => {
    console.log(`created file: ${fileName}`);
    generateBtn.innerHTML = originalBtnText;
    generateBtn.disabled = false;
  });
});

render('%', 1);
searchInput.focus();
