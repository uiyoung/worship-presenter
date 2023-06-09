const ITEMS_PER_PAGE = 10;

let selectedList = [];

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
    songDetailModal.show();
    return;
  }

  try {
    const { type, title, lyrics, memo } = await getSongById(id);
    modalHeader.innerHTML = title;
    modalHeader.classList = 'modal-title fs-5 text-truncate';
    deleteButton.onclick = async () => {
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
        if (!confirm(`${title} 삭제 하시겠습니까?`)) {
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
      alert('로그인이 필요합니다.');
      // window.location.href = result.redirectURL;
      return;
    }

    alert(`${title}이(가) 수정되었습니다.`);
    songDetailModal.hide();

    // setlist에 선택되어있는 경우 selectedList 값 업데이트
    selectedList = selectedList.map((item) =>
      item.type === 'lyrics' && item.id === id ? { ...item, title, lyrics, memo } : item
    );

    renderSetlist();
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
  renderSearchTable(songs, pageNum);

  const totalCount = await getTotalSongCount(title);
  renderPagination(totalCount, pageNum, title);

  renderSearchInfo(title, totalCount);

  renderSetlist();
}

function renderSearchInfo(title, totalCount) {
  const resultInfo = document.querySelector('#search-info');
  resultInfo.innerHTML = '';

  if (title === '%' || title === '') {
    resultInfo.hidden = true;
    return;
  }

  const span = document.createElement('span');
  span.className = 'small';
  span.innerHTML = `'${title}' 검색결과 : 총 ${totalCount} 건`;
  // span.className = 'small col-auto';
  resultInfo.appendChild(span);

  const button = document.createElement('button');
  button.innerHTML = 'x';
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
    const res = await fetch(`/song/${id}`);
    const song = await res.json();
    return song;
  } catch (error) {
    console.error(error);
  }
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

// todo : DRY!
function renderPagination(totalCount, currentPage, title) {
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
  li.className = `page-item text-nowrap ${currentPage + 1 > totalPage ? 'disabled' : ''}`;
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

async function selectLyrics(id) {
  // const result = selectedList.some((song) => song.id === id);
  // if (result) {
  //   alert('이미 선택된 곡입니다.');
  //   return;
  // }

  const selectedSong = await getSongById(id);
  const { title, lyrics } = selectedSong;
  selectedList.push({ no: selectedList.length + 1, type: 'lyrics', id, title, lyrics });
  console.log(selectedList);
  renderSetlist();
}

let newIndexAfterDrag;

const setList = document.querySelector('#setlist');
setList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const draggingElement = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(e.clientY);

  if (afterElement == null) {
    newIndexAfterDrag = selectedList.length - 1;
    setList.appendChild(draggingElement);
    return;
  }

  if (draggingElement.getAttribute('no') > afterElement.getAttribute('no')) {
    newIndexAfterDrag = Number(afterElement.getAttribute('no'));
  } else if (draggingElement.getAttribute('no') < afterElement.getAttribute('no')) {
    newIndexAfterDrag = Number(afterElement.getAttribute('no')) - 1;
  } else {
    newIndexAfterDrag = Number(draggingElement.getAttribute('no'));
  }

  setList.insertBefore(draggingElement, afterElement);
});

function getDragAfterElement(y) {
  const notDraggedElements = [...setList.querySelectorAll('.draggable:not(.dragging)')];

  return notDraggedElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function renderSetlist() {
  const setList = document.querySelector('#setlist');
  setList.innerHTML = '';

  if (selectedList.length <= 0) {
    const li = document.createElement('li');
    li.className = 'text-center small opacity-50';
    li.innerHTML = '선택된 아이템이 없습니다.';
    setList.append(li);
    generateBtn.disabled = true;
    return;
  }

  generateBtn.disabled = false;

  selectedList.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item rounded-3 border-1 d-flex justify-content-between align-items-center draggable';
    li.draggable = true;
    li.setAttribute('no', idx);
    li.onclick = () => {
      switch (item.type) {
        case 'lyrics':
          showSongDetailModal(item.id);
          break;
        case 'hymn-image':
          // todo : responsive-reading preview modal
          break;
        case 'responsive-reading':
          // todo : responsive-reading preview modal
          break;

        default:
          break;
      }
    };
    li.addEventListener('dragstart', () => {
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      console.log('oldIdx:', idx, ', newIdx:', newIndexAfterDrag);
      [selectedList[idx], selectedList[newIndexAfterDrag]] = [selectedList[newIndexAfterDrag], selectedList[idx]];
      selectedList.forEach((s, index) => {
        s.no = index + 1;
      });
      renderSetlist();
      console.log(selectedList);
    });

    const div = document.createElement('div');
    div.className = 'text-truncate';

    // title
    const titleSpan = document.createElement('span');
    titleSpan.innerHTML = `${idx + 1}. ${item.title} `;
    div.appendChild(titleSpan);

    // type
    const badgeSpan = document.createElement('span');
    badgeSpan.classList = 'badge text-bg-primary';
    let type = '';
    switch (item.type) {
      case 'lyrics':
        type = '가사';
        badgeSpan.classList.add('text-bg-primary');
        break;
      case 'hymn-image':
        type = '이미지';
        badgeSpan.classList.add('text-bg-warning');
        break;
      case 'responsive-reading':
        type = '교독문';
        badgeSpan.classList.add('text-bg-success');
        break;

      default:
        break;
    }
    badgeSpan.innerHTML = `${type} `;
    div.appendChild(badgeSpan);

    // lyrics preview
    if (item.type === 'lyrics') {
      const previewSpan = document.createElement('span');
      previewSpan.className = 'd-block small opacity-50 ms-2 text-truncate';
      previewSpan.innerHTML = item.lyrics;
      div.appendChild(previewSpan);
    }
    li.appendChild(div);

    const removeBtn = document.createElement('a');
    removeBtn.href = '#';
    removeBtn.innerHTML = '🗑️';
    removeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const listItem = removeBtn.parentNode;
      const targetIdx = Array.from(setList.children).indexOf(listItem);
      selectedList = selectedList.filter((_, index) => index !== targetIdx);
      renderSetlist();
    };
    li.appendChild(removeBtn);

    setList.append(li);
  });
}

const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', () => {
  if (selectedList.length <= 0) {
    alert('선택된 곡이 없습니다.');
    return;
  }
  if (!confirm('선택된 곡 목록을 초기화하시겠습니까?')) {
    return;
  }

  selectedList = [];
  renderSetlist();
});

render('%', 1);
searchInput.focus();
