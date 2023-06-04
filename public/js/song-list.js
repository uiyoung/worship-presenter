const ITEMS_PER_PAGE = 10;

let selectedSongs = [];

const songDetailModal = new bootstrap.Modal(document.querySelector('#songDetailModal'));

// songDetailModal.addEventListener('show.bs.modal', (e) => {
//   // Button that triggered the modal
//   const button = e.relatedTarget;
//   // Extract info from data-bs-* attributes
//   const recipient = button.getAttribute('data-bs-whatever');
//   // If necessary, you could initiate an Ajax request here
//   // and then do the updating in a callback.

//   // Update the modal's content.
//   const modalTitle = songDetailModal.querySelector('.modal-title');
//   const modalBodyInput = songDetailModal.querySelector('.modal-body input');

//   modalTitle.textContent = `New message to ${recipient}`;
//   modalBodyInput.value = recipient;
// });

// 새로 등록하기
const newBtn = document.querySelector('#new-button');
if (newBtn) {
  newBtn.addEventListener('click', () => {
    showSongDetailModal(null);
    songDetailModal.show();
  });
}

const modalTitle = document.querySelector('#modal-title');
const modalLyrics = document.querySelector('#modal-lyrics');
const modalMemo = document.querySelector('#modal-memo');
const modalSaveBtn = document.querySelector('#modal-save-btn');
const modalModifyBtn = document.querySelector('#modal-modify-btn');

// 등록, 수정 modal
async function showSongDetailModal(id) {
  const modalHeader = document.querySelector('#songDetailModalLabel');
  const modalSongTypes = document.querySelectorAll('input[name=song-type]');
  const deleteButton = document.querySelector('#song-delete-btn');

  modalHeader.innerHTML = '새로 등록하기';
  deleteButton.hidden = true;
  modalTitle.value = '';
  modalLyrics.value = '';
  modalLyrics.rows = 14;
  modalSongTypes.forEach((e) => (e.checked = false));
  modalMemo.value = '';
  modalSaveBtn.hidden = false;
  modalModifyBtn.hidden = true;

  if (!id) {
    return;
  }

  try {
    const { type, title, lyrics, memo } = await getSongById(id);
    modalHeader.innerHTML = title;
    deleteButton.onclick = async () => {
      if (!confirm(`${title} 삭제 하시겠습니까?`)) {
        return;
      }

      try {
        const response = await fetch(`/song/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!result.success && result.redirectURL) {
          if (!confirm('로그인이 필요합니다.')) {
            return;
          }

          window.location.href = result.redirectURL;
          return;
        }

        alert('삭제 성공');
        render('%', 1);
        songDetailModal.hide();
      } catch (error) {
        alert('삭제 실패');
        console.error(error);
      }
    };
    deleteButton.hidden = false;
    modalSaveBtn.hidden = true;
    modalModifyBtn.hidden = false;

    modalTitle.value = title;
    modalLyrics.value = lyrics;
    modalLyrics.rows = lyrics.split('\n').length;
    Array.from(modalSongTypes).find((e) => e.value === type).checked = true;
    modalMemo.value = memo;
    modalModifyBtn.onclick = () => modifySong(id);

    songDetailModal.show();
  } catch (error) {
    alert('error getSongById');
    console.error(error);
  }
}

// 저장
modalSaveBtn.addEventListener('click', async () => {
  const title = modalTitle.value.trim();
  if (title === '') {
    alert('제목을 입력해주세요.');
    modalTitle.focus();
    return;
  }
  const lyrics = modalLyrics.value.trim();
  if (lyrics === '') {
    alert('가사를 입력해주세요.');
    modalLyrics.focus();
    return;
  }
  const type = document.querySelector('input[name=song-type]:checked')?.value;
  if (type === undefined) {
    alert('타입을 선택해주세요.');
    return;
  }
  const memo = modalMemo.value.trim();

  const newSong = {
    title,
    lyrics,
    type,
    memo,
  };

  try {
    const response = await fetch(`/song`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSong),
    });
    const result = await response.json();

    if (!result.success && result.redirectURL) {
      if (!confirm('로그인이 필요합니다.')) {
        return;
      }

      window.location.href = result.redirectURL;
      return;
    }

    alert(`${title}이(가) 등록되었습니다.`);
    render('%', 1);
    songDetailModal.hide();
  } catch (error) {
    alert('등록 실패');
    console.error(error);
  }
});

// 수정
async function modifySong(id) {
  const title = modalTitle.value.trim();
  if (title === '') {
    alert('제목을 입력해주세요.');
    modalTitle.focus();
    return;
  }
  const lyrics = modalLyrics.value.trim();
  if (lyrics === '') {
    alert('가사를 입력해주세요.');
    modalLyrics.focus();
    return;
  }
  const type = document.querySelector('input[name=song-type]:checked')?.value;
  if (type === undefined) {
    alert('타입을 선택해주세요.');
    return;
  }
  const memo = modalMemo.value.trim();

  const newSong = {
    title,
    lyrics,
    type,
    memo,
  };

  try {
    const response = await fetch(`/song/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSong),
    });
    const result = await response.json();

    if (!result.success && result.redirectURL) {
      if (!confirm('로그인이 필요합니다.')) {
        return;
      }
      window.location.href = result.redirectURL;
      return;
    }

    alert(`${title}이(가) 수정되었습니다.`);
    songDetailModal.hide();

    // setlist에 선택되어있는 경우 selectedSongs 값 업데이트
    selectedSongs = selectedSongs.map((song) => (song.id === id ? { ...song, title, lyrics, type, memo } : song));

    renderSetlistTable();
  } catch (error) {
    alert('등록 실패');
    console.error(error);
  }
}

// todo : select에서 선택한 줄 수로 정렬
function autoAlign() {
  const lyricsTextArea = document.querySelector('#modal-lyrics');

  const lines = lyricsTextArea.value
    .split('\n')
    .filter((e) => e != '')
    .map((e) => e.trim().replace(/\s+/g, ' '));

  if (lines.length <= 0) {
    alert('가사를 입력해주세요.');
    lyricsTextArea.focus();
    return;
  }

  const LINES_PER_SLIDE = 2;
  let result = [];
  const temp = [...lines];
  const cnt = Math.ceil(temp.length / LINES_PER_SLIDE);
  for (let i = 0; i < cnt; i++) {
    result.push(temp.splice(0, LINES_PER_SLIDE));
  }
  result = result.map((e) => e.join('\n')).join('\n\n');

  lyricsTextArea.value = result;
  lyricsTextArea.focus();
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
  // span.className = 'small col-auto';
  resultInfo.appendChild(span);

  const button = document.createElement('button');
  button.innerHTML = 'x';
  button.className = 'btn btn-danger btn-sm';
  button.onclick = () => {
    searchInput.value = '';
    render('%', 1);
  };

  span.appendChild(button);
  resultInfo.hidden = false;
}

async function getSongById(id) {
  try {
    const res = await fetch(`/song/${id}`);
    const song = await res.json();
    return song;
  } catch (error) {
    console.error(error);
  }
}

function renderSearchTable(songs) {
  const tbody = document.querySelector('#search-table tbody');
  tbody.innerHTML = '';

  if (songs.length <= 0) {
    let tr = document.createElement('tr');
    tr.className = 'text-center';
    let td = document.createElement('td');
    td.colSpan = 4;
    const span = document.createElement('span');
    span.innerHTML = '검색된 곡이 없습니다. ';
    td.appendChild(span);
    const a = document.createElement('a');
    a.href = '#';
    a.onclick = (e) => {
      e.preventDefault();
      showSongDetailModal(null);
      songDetailModal.show();
    };
    a.innerHTML = '새로 등록하기';
    td.appendChild(a);
    tr.appendChild(td);
    tbody.append(tr);
    return;
  }

  songs.forEach((song, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'text-center';
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
    titleLink.className = 'title';
    titleLink.innerHTML = song.title;
    titleLink.onclick = () => showSongDetailModal(song.id);
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

  // first
  li = document.createElement('li');
  li.className = `page-item ${1 === currentPage ? 'active' : ''}`;
  a = document.createElement('a');
  a.className = 'page-link';
  a.innerHTML = 1;
  a.href = '#';
  a.onclick = (e) => {
    e.preventDefault();
    render(title, 1);
  };
  li.appendChild(a);
  paginationElement.appendChild(li);

  const pageStart = currentPage >= totalPage - 4 ? Math.max(totalPage - 7, 2) : Math.max(currentPage - 3, 2);
  const pageEnd = currentPage <= 5 && totalPage > 8 ? 8 : Math.min(currentPage + 3, totalPage - 1);
  console.log(pageStart);
  console.log(pageEnd);

  // ...
  if (pageStart > 2) {
    li = document.createElement('li');
    li.className = `page-item`;
    a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = '...';
    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // currentPage-3 ~ currentPage+3
  for (let i = pageStart; i <= pageEnd; i++) {
    li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = i;
    a.href = '#';
    a.onclick = (e) => {
      e.preventDefault();
      render(title, i);
    };
    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // ...
  if (currentPage + 4 < totalPage) {
    li = document.createElement('li');
    li.className = `page-item`;
    a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = '...';
    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // last
  if (totalPage > 1) {
    li = document.createElement('li');
    li.className = `page-item ${totalPage === currentPage ? 'active' : ''}`;
    a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = totalPage;
    a.href = '#';
    a.onclick = (e) => {
      e.preventDefault();
      render(title, totalPage);
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

  const selectedSong = await getSongById(id);
  selectedSongs.push(selectedSong);
  renderSetlistTable();
}

function renderSetlistTable() {
  const tbody = document.querySelector('#setlist-table tbody');
  tbody.innerHTML = '';

  if (selectedSongs.length <= 0) {
    const tr = document.createElement('tr');
    tr.className = 'text-center';
    const td = document.createElement('td');
    td.colSpan = 4;
    td.innerHTML = '선택된 곡이 없습니다.';
    tr.appendChild(td);
    tbody.append(tr);
    return;
  }

  selectedSongs.forEach((song, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'text-center';
    // no
    let td = document.createElement('td');
    td.innerHTML = idx + 1;
    tr.appendChild(td);
    // title
    td = document.createElement('td');
    td.className = 'text-start';
    const titleLink = document.createElement('a');
    titleLink.innerHTML = song.title;
    titleLink.href = '#';
    titleLink.className = 'title';
    titleLink.onclick = () => showSongDetailModal(song.id);
    td.appendChild(titleLink);
    tr.appendChild(td);

    td = document.createElement('td');
    const upButton = document.createElement('button');
    upButton.innerHTML = '↑';
    upButton.className = 'btn btn-sm btn-outline-primary mx-1';
    upButton.disabled = idx === 0 ? true : false;
    upButton.onclick = () => {
      const idx = selectedSongs.findIndex((e) => e.id === song.id);
      if (idx === 0) {
        return;
      }
      [selectedSongs[idx], selectedSongs[idx - 1]] = [selectedSongs[idx - 1], selectedSongs[idx]];
      renderSetlistTable();
    };
    td.appendChild(upButton);
    tr.appendChild(td);

    const downButton = document.createElement('button');
    downButton.innerHTML = '↓';
    downButton.className = 'btn btn-sm btn-outline-secondary';
    downButton.disabled = idx === selectedSongs.length - 1 ? true : false;
    downButton.onclick = () => {
      const idx = selectedSongs.findIndex((e) => e.id === song.id);
      if (idx === selectedSongs.length - 1) {
        return;
      }
      [selectedSongs[idx], selectedSongs[idx + 1]] = [selectedSongs[idx + 1], selectedSongs[idx]];
      renderSetlistTable();
    };
    td.appendChild(downButton);
    tr.appendChild(td);

    // removeBtn
    td = document.createElement('td');
    const removeBtn = document.createElement('a');
    removeBtn.href = '#';
    removeBtn.innerHTML = '🗑️';
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
  e.target.innerHTML = '';
  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm mx-2';
  spinner.role = 'status';
  spinner.ariaHidden = true;
  e.target.appendChild(spinner);
  e.target.innerHTML += 'PPT 생성 중... ';
  e.target.disabled = true;

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
