const ITEMS_PER_PAGE = 10;

let selectedList = [];

const songDetailModal = new bootstrap.Modal(document.querySelector('#songDetailModal'));

const modalTitle = document.querySelector('#modal-title');
modalTitle.addEventListener('keyup', (e) => {
  document.querySelector('#songDetailModalLabel').innerHTML = e.target.value;
});

// 새로 등록하기
const newBtn = document.querySelector('#new-button');
if (newBtn) {
  newBtn.addEventListener('click', () => {
    showNewSongModal();
  });
}

// modal : 등록
function showNewSongModal() {
  const modalHeader = document.querySelector('#songDetailModalLabel');
  const modalTitle = document.querySelector('#modal-title');
  const modalLyrics = document.querySelector('#modal-lyrics');
  // const modalSongTypes = document.querySelectorAll('input[name=song-type]');
  const modalMemo = document.querySelector('#modal-memo');
  const modalSongDetails = document.querySelector('#modal-song-details');
  const modalCreatedAt = document.querySelector('#modal-created-at');
  const modalUpdatedAt = document.querySelector('#modal-updated-at');
  const modalAuthor = document.querySelector('#modal-author-username');
  const modalSaveBtn = document.querySelector('#modal-save-btn');
  const modalModifyBtn = document.querySelector('#modal-modify-btn');
  const modalSelectBtn = document.querySelector('#modal-select-btn');
  const modalDeleteBtn = document.querySelector('#modal-delete-btn');

  modalHeader.innerHTML = '새로 등록하기';
  modalTitle.value = '';
  modalLyrics.value = '';
  modalLyrics.style.height = '280px';
  // modalSongTypes.forEach((e) => (e.checked = false));
  modalMemo.value = '';
  modalSongDetails.hidden = true;
  modalCreatedAt.innerHTML = '';
  modalCreatedAt.hidden = true;
  modalUpdatedAt.innerHTML = '';
  modalUpdatedAt.hidden = true;
  modalAuthor.innerHTML = '';
  modalAuthor.hidden = true;

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
    // const type = document.querySelector('input[name=song-type]:checked')?.value;
    // if (type === undefined) {
    //   alert('타입을 선택해주세요.');
    //   return;
    // }
    const memo = modalMemo.value.trim();

    const song = { title, lyrics, type: 'CCM', memo };
    saveSong(song);
  };

  modalSaveBtn.hidden = false;
  modalModifyBtn.onclick = null;
  modalModifyBtn.hidden = true;

  songDetailModal.show();
}

// modal : 조회, 수정, 삭제
async function showSongDetailModal(id) {
  const modalHeader = document.querySelector('#songDetailModalLabel');
  const modalTitle = document.querySelector('#modal-title');
  const modalLyrics = document.querySelector('#modal-lyrics');
  const modalMemo = document.querySelector('#modal-memo');
  // const modalSongTypes = document.querySelectorAll('input[name=song-type]');
  const modalSongDetails = document.querySelector('#modal-song-details');
  const modalCreatedAt = document.querySelector('#modal-created-at');
  const modalUpdatedAt = document.querySelector('#modal-updated-at');
  const modalAuthor = document.querySelector('#modal-author-username');
  const modalSelectBtn = document.querySelector('#modal-select-btn');
  const modalDeleteBtn = document.querySelector('#modal-delete-btn');
  const modalSaveBtn = document.querySelector('#modal-save-btn');
  const modalModifyBtn = document.querySelector('#modal-modify-btn');

  try {
    const { title, lyrics, memo, createdAt, updatedAt, author } = await getSongById(id);

    modalHeader.innerHTML = title;
    modalHeader.classList = 'modal-title fs-5 text-truncate';

    modalTitle.value = title;
    modalLyrics.value = lyrics;
    modalLyrics.style.height = `${Math.max(lyrics.split('\n').length * 20 + 38, 280)}px`;
    modalMemo.value = memo;
    // Array.from(modalSongTypes).find((e) => e.value === type).checked = true;
    modalSongDetails.hidden = false;
    modalSongDetails.open = false;
    modalCreatedAt.innerHTML = `등록 : ${new Intl.DateTimeFormat('ko', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(createdAt))}`;
    modalCreatedAt.hidden = false;
    modalUpdatedAt.innerHTML = `수정 : ${new Intl.DateTimeFormat('ko', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(updatedAt))}`;
    modalUpdatedAt.hidden = false;
    modalAuthor.innerHTML = `uploaded by ${author.username}`;
    modalAuthor.hidden = false;

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
      // const type = document.querySelector('input[name=song-type]:checked')?.value;
      // if (type === undefined) {
      //   alert('타입을 선택해주세요.');
      //   return;
      // }
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

// modal : save
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

// modal : delete
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

// modal : modify
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

    // setlist에 선택되어있는 경우 selectedList 값 업데이트
    const targetItem = selectedList.find((item) => item.type === 'lyrics' && item.id === id);
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

const autoAlignBtn = document.querySelector('#song-modal-auto-align-btn');
if (autoAlignBtn) {
  autoAlignBtn.addEventListener('click', () => {
    const modalLyrics = document.querySelector('#modal-lyrics');
    if (modalLyrics.value.trim().length <= 0) {
      alert('가사를 입력해주세요.');
      modalLyrics.focus();
      return;
    }

    const linesPerSlide = Number(document.querySelector('#lines-per-slide').value) || 2;
    modalLyrics.value = autoAlign(modalLyrics.value, linesPerSlide);
    modalLyrics.style.height = `${Math.max(modalLyrics.value.split('\n').length * 20 + 38, 280)}px`;
    modalLyrics.focus();
  });
}

function autoAlign(text, linesPerSlide) {
  const lines = text
    .split('\n')
    .map((e) => e.replace(/[\s\u200B]+/g, ' ').trim()) // ZWSP공백 제거, 문자열 내의 연속된 공백을 하나의 공백으로 대체
    .filter((e) => e !== '');

  // linesPerSlide 만큼 묶어서 result에 담기
  let result = [];
  while (lines.length > 0) {
    result.push(lines.splice(0, linesPerSlide));
  }

  result = result.map((e) => e.join('\n')).join('\n\n');
  return result;
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
  li.className = `page-item text-nowrap ${currentPage + 1 > totalPage ? 'disabled' : ''}`;
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
  button.innerHTML = 'x';
  button.className = 'btn btn-danger btn-sm ms-2';
  button.onclick = () => {
    searchInput.value = '';
    render('%', 1);
  };

  resultInfo.appendChild(button);
  resultInfo.hidden = false;
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

  console.log(selectedList);

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
        case 'bible':
          // todo : bible preview modal
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
      case 'bible':
        type = '성경';
        badgeSpan.classList.add('text-bg-success');
        break;
      case 'responsive-reading':
        type = '교독문';
        badgeSpan.classList.add('text-bg-secondary');
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
  selectedList.push({ no: selectedList.length + 1, type: 'lyrics', id, title, lyrics });
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
