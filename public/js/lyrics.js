const ITEMS_PER_PAGE = 10;

const songDetailModalEl = document.querySelector('#songDetailModal');
const songDetailModal = new bootstrap.Modal(songDetailModalEl);

songDetailModalEl.addEventListener('shown.bs.modal', (e) => {
  modalTitle.focus();
});

const newLyricsBtn = document.querySelector('#new-lyrics-button');

if (newLyricsBtn) {
  newLyricsBtn.addEventListener('click', () => showNewSongModal());
}

const modalTitle = document.querySelector('#modal-title');
modalTitle.addEventListener('keyup', (e) => {
  document.querySelector('#songDetailModalLabel').innerHTML = e.target.value;
});

const modalHeader = document.querySelector('#songDetailModalLabel');
const modalLyrics = document.querySelector('#modal-lyrics');
const modalMemo = document.querySelector('#modal-memo');
const modalSongDetails = document.querySelector('#modal-song-details');
const modalCreatedAt = document.querySelector('#modal-created-at');
const modalUpdatedAt = document.querySelector('#modal-updated-at');
const modalSaveBtn = document.querySelector('#modal-save-btn');
const modalModifyBtn = document.querySelector('#modal-modify-btn');
const modalSelectBtn = document.querySelector('#modal-select-btn');
const modalDeleteBtn = document.querySelector('#modal-delete-btn');

function handleSaveBtnClick(e) {
  const title = modalTitle.value.trim();
  if (title === '') {
    alert('제목을 입력해주세요.');
    modalTitle.focus();
    return;
  }

  const lyrics = cleanText(modalLyrics.value);

  if (lyrics === '') {
    alert('가사를 입력해주세요.');
    modalLyrics.focus();
    return;
  }

  const memo = modalMemo.value.trim();

  const song = { title, lyrics, memo };
  saveSong(song);
}

function handleModifyBtnClick(id) {
  const title = modalTitle.value.trim();
  if (title === '') {
    alert('제목을 입력해주세요.');
    modalTitle.focus();
    return;
  }
  const lyrics = cleanText(modalLyrics.value);
  if (lyrics === '') {
    alert('가사를 입력해주세요.');
    modalLyrics.focus();
    return;
  }

  const memo = modalMemo.value.trim();

  if (!confirm('수정 하시겠습니까?')) {
    return;
  }

  const song = { title, lyrics, memo };
  modifySong(id, song);
}

// modal : 등록
function showNewSongModal() {
  modalHeader.innerHTML = '가사 등록';
  modalTitle.value = '';
  modalLyrics.value = '';
  modalLyrics.style.height = '280px';
  modalMemo.value = '';
  modalSongDetails.hidden = true;
  modalCreatedAt.innerHTML = '';
  modalCreatedAt.hidden = true;
  modalUpdatedAt.innerHTML = '';
  modalUpdatedAt.hidden = true;

  modalSelectBtn.onclick = null;
  modalSelectBtn.hidden = true;
  modalDeleteBtn.onclick = null;
  modalDeleteBtn.hidden = true;
  modalSaveBtn.onclick = handleSaveBtnClick;
  modalSaveBtn.hidden = false;
  modalModifyBtn.onclick = null;
  modalModifyBtn.hidden = true;

  songDetailModal.show();
}

// lyrics modal : 조회, 수정, 삭제
async function showSongDetailModal(id) {
  try {
    const { title, lyrics, memo, createdAt, updatedAt, author, editor } =
      await getSongById(id);

    modalHeader.innerHTML = title;
    modalHeader.classList = 'modal-title fs-5 text-truncate';

    modalTitle.value = title;
    modalLyrics.value = lyrics;
    modalLyrics.style.height = `${Math.max(
      lyrics.split('\n').length * 20 + 38,
      280
    )}px`;
    modalMemo.value = memo;
    modalSongDetails.hidden = false;
    modalSongDetails.open = false;
    modalCreatedAt.innerHTML = `등록 : ${new Intl.DateTimeFormat('ko', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(createdAt))}, ${author.username}`;
    modalCreatedAt.hidden = false;
    modalUpdatedAt.innerHTML = `수정 : ${new Intl.DateTimeFormat('ko', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(updatedAt))}, ${editor?.username}`;
    modalUpdatedAt.hidden = false;

    modalSelectBtn.onclick = () => {
      selectLyrics(id);
      songDetailModal.hide();
    };
    modalSelectBtn.hidden = false;
    modalDeleteBtn.onclick = () => deleteSong(id);
    modalDeleteBtn.hidden = false;
    modalSaveBtn.onclick = null;
    modalSaveBtn.hidden = true;
    modalModifyBtn.onclick = () => handleModifyBtnClick(id);
    modalModifyBtn.hidden = false;

    songDetailModal.show();
  } catch (error) {
    alert('getSongById error');
    console.error(error);
  }
}

// lyrics modal : save
async function saveSong(newSong) {
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
      alert('로그인이 필요합니다.');
      return;
    }

    alert(`${newSong.title}이(가) 등록되었습니다.`);
    renderLyrics('%', 1);
    songDetailModal.hide();
  } catch (error) {
    alert('등록 실패');
    console.error(error);
  }
}

// lyrics modal : modify
async function modifySong(id, modifiedSong) {
  try {
    const response = await fetch(`/song/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedSong),
    });
    const result = await response.json();

    if (!result.success && result.redirectURL) {
      alert('로그인이 필요합니다.');
      return;
    }

    alert('수정되었습니다.');
    renderLyrics(lyricsSearchInput.value, 1);
    songDetailModal.hide();

    // setlist에 선택되어있는 경우 setList값 업데이트
    const itemInSetList = setList.find(
      (item) => item.type === 'lyrics' && item.data.id === id
    );
    if (itemInSetList) {
      itemInSetList.data.title = modifiedSong.title;
      itemInSetList.data.lyrics = modifiedSong.lyrics;
      renderSetlist();
    }
  } catch (error) {
    alert('등록 실패');
    console.error(error);
  }
}

// lyrics modal : delete
async function deleteSong(id) {
  if (!confirm('삭제 하시겠습니까?')) {
    return;
  }

  try {
    const response = await fetch(`/song/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();

    if (!result.success && result.redirectURL) {
      alert('로그인이 필요합니다.');
      return;
    }

    alert('삭제 성공');
    renderLyrics('%', 1);
    songDetailModal.hide();
  } catch (error) {
    alert('삭제 실패');
    console.error(error);
  }
}

const hymnDivideLinesBtn = document.querySelector(
  '#song-modal-divide-lines-btn'
);
if (hymnDivideLinesBtn) {
  hymnDivideLinesBtn.addEventListener('click', () => {
    if (modalLyrics.value.trim().length <= 0) {
      alert('가사를 입력해주세요.');
      modalLyrics.focus();
      return;
    }

    const linesPerSlide =
      Number(document.querySelector('#lines-per-slide').value) || 2;
    modalLyrics.value = divideTextByLines(modalLyrics.value, linesPerSlide);
    modalLyrics.style.height = `${Math.max(
      modalLyrics.value.split('\n').length * 20 + 38,
      280
    )}px`;
    modalLyrics.focus();
  });
}

const lyricsSearchInput = document.querySelector('#search-input');
lyricsSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.dispatchEvent(new Event('click'));
  }
});

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
  const query = lyricsSearchInput.value.trim();
  if (query === '') {
    alert('검색어를 입력해주세요.');
    lyricsSearchInput.focus();
    return;
  }

  renderLyrics(query, 1);
});

async function searchSong(query, searchBy, pageNum) {
  try {
    const response = await fetch(`/song?${searchBy}=${query}&page=${pageNum}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function renderLyricsTable(songs, pageNum) {
  const thead = document.querySelector('#lyrics-table thead');
  const tbody = document.querySelector('#lyrics-table tbody');

  thead.style.display = '';
  tbody.innerHTML = '';

  if (songs.length <= 0) {
    thead.style.display = 'none';
    return;
  }

  songs.forEach((song, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'text-center';
    // no
    let td = document.createElement('td');
    td.innerHTML = (pageNum - 1) * 10 + idx + 1;
    tr.appendChild(td);
    // type
    td = document.createElement('td');
    const span = document.createElement('span');
    span.className = `badge rounded-pill ${
      song.type === 'HYMN' ? 'text-bg-warning' : 'text-bg-info'
    }`;
    span.innerHTML = song.type;
    td.appendChild(span);
    tr.appendChild(td);
    // title
    td = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.href = '#';
    titleLink.className = 'title';
    titleLink.innerHTML = song.title;
    titleLink.onclick = (e) => {
      e.preventDefault();
      showSongDetailModal(song.id);
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
      selectLyrics(song.id);
    };
    td.appendChild(selectBtn);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

// TODO: DRY!
function renderPagination(totalCount, currentPage, query) {
  const paginationElement = document.querySelector('#search-pagination');
  paginationElement.innerHTML = '';

  if (totalCount <= 0) {
    return;
  }

  const totalPage = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // prev
  let li = document.createElement('li');
  li.className = `page-item text-nowrap ${currentPage == 1 ? 'disabled' : ''}`;
  let a = document.createElement('a');
  a.className = 'page-link';
  a.innerHTML = '이전';
  a.href = '#';
  a.onclick = (e) => {
    e.preventDefault();
    renderLyrics(query, currentPage - 1);
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
    renderLyrics(query, 1);
  };
  li.appendChild(a);
  paginationElement.appendChild(li);

  const pageStart =
    currentPage >= totalPage - 4
      ? Math.max(totalPage - 7, 2)
      : Math.max(currentPage - 3, 2);
  const pageEnd =
    currentPage <= 5 && totalPage > 8
      ? 8
      : Math.min(currentPage + 3, totalPage - 1);

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
      renderLyrics(query, i);
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
      renderLyrics(query, totalPage);
    };
    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // next
  li = document.createElement('li');
  li.className = `page-item text-nowrap ${
    currentPage + 1 > totalPage ? 'disabled' : ''
  }`;
  a = document.createElement('a');
  a.className = 'page-link';
  a.innerHTML = '다음';
  a.href = '#';
  a.onclick = (e) => {
    e.preventDefault();
    renderLyrics(query, currentPage + 1);
  };
  li.appendChild(a);
  paginationElement.appendChild(li);
}

function renderSearchInfo(query, totalCount) {
  const resultInfo = document.querySelector('#search-info');
  resultInfo.innerHTML = '';

  if (query === '%' || query === '') {
    resultInfo.hidden = true;
    return;
  }

  const span = document.createElement('span');
  span.className = 'text-body-secondary small';
  span.innerHTML = `'${query}' 검색결과 : 총 ${totalCount} 건`;
  resultInfo.appendChild(span);

  const button = document.createElement('button');
  button.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
  button.className = 'btn p-0 ms-1';
  button.style.color = '';
  button.onclick = () => {
    lyricsSearchInput.value = '';
    renderLyrics('%', 1);
  };

  resultInfo.appendChild(button);
  resultInfo.hidden = false;
}

async function getSongById(id) {
  try {
    const response = await fetch(`/song/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function selectLyrics(id) {
  const selectedSong = await getSongById(id);
  const { title, lyrics } = selectedSong;

  setList.push({
    no: setList.length + 1,
    type: 'lyrics',
    data: {
      id,
      title,
      lyrics,
    },
  });

  renderSetlist();
}

async function renderLyrics(query, pageNum) {
  const searchBy = document.querySelector('#search-type-select').value;
  const { songs, totalCount } = await searchSong(query, searchBy, pageNum);

  renderLyricsTable(songs, pageNum);
  renderPagination(totalCount, pageNum, query);
  renderSearchInfo(query, totalCount);
  renderSetlist();
}

function initLyrics() {
  renderLyrics('%', 1);
  lyricsSearchInput.focus();
}

// renderLyrics('%', 1);
// lyricsSearchInput.focus();
