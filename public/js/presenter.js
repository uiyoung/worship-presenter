const ITEMS_PER_PAGE = 10;

const songDetailModalEl = document.querySelector('#songDetailModal');
const songDetailModal = new bootstrap.Modal(songDetailModalEl);

songDetailModalEl.addEventListener('shown.bs.modal', (e) => {
  modalTitle.focus();
});

const modalTitle = document.querySelector('#modal-title');
modalTitle.addEventListener('keyup', (e) => {
  document.querySelector('#songDetailModalLabel').innerHTML = e.target.value;
});

const newBtn = document.querySelector('#new-button');

if (newBtn) {
  newBtn.addEventListener('click', () => showNewSongModal());
}

// modal : 등록
function showNewSongModal() {
  const modalHeader = document.querySelector('#songDetailModalLabel');
  const modalTitle = document.querySelector('#modal-title');
  const modalLyrics = document.querySelector('#modal-lyrics');
  const modalMemo = document.querySelector('#modal-memo');
  const modalSongDetails = document.querySelector('#modal-song-details');
  const modalCreatedAt = document.querySelector('#modal-created-at');
  const modalUpdatedAt = document.querySelector('#modal-updated-at');
  const modalSaveBtn = document.querySelector('#modal-save-btn');
  const modalModifyBtn = document.querySelector('#modal-modify-btn');
  const modalSelectBtn = document.querySelector('#modal-select-btn');
  const modalDeleteBtn = document.querySelector('#modal-delete-btn');

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

  modalSaveBtn.onclick = () => {
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

    const memo = modalMemo.value.trim();

    const song = { title, lyrics, memo };
    saveSong(song);
  };

  modalSaveBtn.hidden = false;
  modalModifyBtn.onclick = null;
  modalModifyBtn.hidden = true;

  songDetailModal.show();
}

// lyrics modal : 조회, 수정, 삭제
async function showSongDetailModal(id) {
  const modalHeader = document.querySelector('#songDetailModalLabel');
  const modalTitle = document.querySelector('#modal-title');
  const modalLyrics = document.querySelector('#modal-lyrics');
  const modalMemo = document.querySelector('#modal-memo');
  const modalSongDetails = document.querySelector('#modal-song-details');
  const modalCreatedAt = document.querySelector('#modal-created-at');
  const modalUpdatedAt = document.querySelector('#modal-updated-at');
  const modalSelectBtn = document.querySelector('#modal-select-btn');
  const modalDeleteBtn = document.querySelector('#modal-delete-btn');
  const modalSaveBtn = document.querySelector('#modal-save-btn');
  const modalModifyBtn = document.querySelector('#modal-modify-btn');

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
    modalModifyBtn.onclick = () => {
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

      const memo = modalMemo.value.trim();
      if (!confirm('수정 하시겠습니까?')) {
        return;
      }

      const modifiedSong = { title, lyrics, memo };
      modifySong(id, modifiedSong);
    };
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
    render('%', 1);
    songDetailModal.hide();
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
    render('%', 1);
    songDetailModal.hide();
  } catch (error) {
    alert('삭제 실패');
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
    render(searchInput.value, 1);
    songDetailModal.hide();

    // setlist에 선택되어있는 경우 setList값 업데이트
    const targetItem = setList.find(
      (item) => item.type === 'lyrics' && item.id === id
    );
    if (targetItem) {
      targetItem.title = modifiedSong.title;
      targetItem.lyrics = modifiedSong.lyrics;
      renderSetlist();
    }
  } catch (error) {
    alert('등록 실패');
    console.error(error);
  }
}

const hymnDivideLinesBtn = document.querySelector(
  '#song-modal-divide-lines-btn'
);
if (hymnDivideLinesBtn) {
  hymnDivideLinesBtn.addEventListener('click', () => {
    const modalLyrics = document.querySelector('#modal-lyrics');
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

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.dispatchEvent(new Event('click'));
  }
});

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query === '') {
    alert('검색어를 입력해주세요.');
    searchInput.focus();
    return;
  }

  render(query, 1);
});

async function searchSong(query, pageNum) {
  const searchBy = document.querySelector('#search-type-select').value;
  const response = await fetch(`/song?${searchBy}=${query}&page=${pageNum}`);
  const data = await response.json();
  return data;
}

function renderSearchTable(songs, pageNum) {
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
    tr.appendChild(td);
    tbody.append(tr);
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
    render(query, currentPage - 1);
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
    render(query, 1);
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
      render(query, i);
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
      render(query, totalPage);
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
    render(query, currentPage + 1);
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
  span.className = 'small';
  span.innerHTML = `'${query}' 검색결과 : 총 ${totalCount} 건`;
  resultInfo.appendChild(span);

  const button = document.createElement('button');
  button.innerHTML = '&times;';
  button.className = 'btn btn-danger btn-sm ms-2';
  button.onclick = () => {
    searchInput.value = '';
    render('%', 1);
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
    id,
    title,
    lyrics,
  });

  renderSetlist();
}

async function render(query, pageNum) {
  try {
    const { songs, totalCount } = await searchSong(query, pageNum);

    renderSearchTable(songs, pageNum);
    renderPagination(totalCount, pageNum, query);
    renderSearchInfo(query, totalCount);
  } catch (error) {
    console.error(error);
  }

  renderSetlist();
}

render('%', 1);
searchInput.focus();
