import { showSongDetailModal } from './lyrics.js';
import { showSettigsModal } from './settings-modal.js';

export let setList = [];

const setListEl = document.querySelector('#setlist');
const clearButton = document.querySelector('#clear-button');
const settingsBtn = document.querySelector('#settings-btn');

let newIndexAfterDrag;
setListEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  const draggingElement = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(e.clientY);

  if (afterElement == null) {
    newIndexAfterDrag = setList.length - 1;
    setListEl.appendChild(draggingElement);
    return;
  }

  if (draggingElement.getAttribute('no') > afterElement.getAttribute('no')) {
    newIndexAfterDrag = Number(afterElement.getAttribute('no'));
  } else if (draggingElement.getAttribute('no') < afterElement.getAttribute('no')) {
    newIndexAfterDrag = Number(afterElement.getAttribute('no')) - 1;
  } else {
    newIndexAfterDrag = Number(draggingElement.getAttribute('no'));
  }

  setListEl.insertBefore(draggingElement, afterElement);
});

clearButton.addEventListener('click', () => {
  if (setList.length <= 0) {
    alert('선택된 곡이 없습니다.');
    return;
  }

  if (!confirm('목록을 비우시겠습니까?')) {
    return;
  }

  setList = [];
  renderSetlist();
});

settingsBtn.addEventListener('click', () => {
  if (setList.length <= 0) {
    alert('아이템을 먼저 추가해 주세요.');
    return;
  }

  showSettigsModal();
});

function handleSetListItemClick(item) {
  switch (item.type) {
    case 'lyrics':
      showSongDetailModal(item.data.id);
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
}

export function renderSetlist() {
  setListEl.innerHTML = '';

  if (setList.length <= 0) {
    const li = document.createElement('li');
    li.className = 'text-center small opacity-50';
    li.innerHTML = '선택된 아이템이 없습니다.';
    setListEl.append(li);
    settingsBtn.disabled = true;
    clearButton.disabled = true;
    return;
  }

  settingsBtn.disabled = false;
  clearButton.disabled = false;

  setList.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item rounded-3 border-1 d-flex justify-content-between align-items-center draggable';
    li.draggable = true;
    li.setAttribute('no', idx);

    li.addEventListener('click', () => handleSetListItemClick(item));
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');

      [setList[idx], setList[newIndexAfterDrag]] = [setList[newIndexAfterDrag], setList[idx]];
      setList.forEach((s, index) => {
        s.no = index + 1;
      });

      renderSetlist();
    });

    const div = document.createElement('div');
    div.className = 'text-truncate';

    const titleAndBadgeDiv = document.createElement('div');
    titleAndBadgeDiv.className = 'd-flex align-items-center gap-1';

    // title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'text-truncate';
    titleSpan.innerHTML = `${idx + 1}. ${item.data.title} `;
    titleAndBadgeDiv.appendChild(titleSpan);

    // type badge
    const badgeTypes = {
      lyrics: { text: '가사', class: 'text-bg-primary' },
      'hymn-image': { text: '이미지', class: 'text-bg-warning' },
      bible: { text: '성경', class: 'text-bg-success' },
      'responsive-reading': { text: '교독문', class: 'text-bg-secondary' },
    };

    const badgeSpan = document.createElement('span');
    badgeSpan.classList = 'badge';
    badgeSpan.classList.add(badgeTypes[item.type].class);
    badgeSpan.innerHTML = badgeTypes[item.type].text;

    titleAndBadgeDiv.appendChild(badgeSpan);
    div.appendChild(titleAndBadgeDiv);

    // lyrics preview line
    if (item.type === 'lyrics') {
      const previewSpan = document.createElement('span');
      previewSpan.className = 'd-block small opacity-50 ms-3 text-truncate';
      previewSpan.innerHTML = item.data.lyrics.split('\n\n')[0];
      div.appendChild(previewSpan);
    }
    li.appendChild(div);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'removeBtn';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const listItem = removeBtn.parentNode;
      const targetIdx = Array.from(setListEl.children).indexOf(listItem);
      setList = setList.filter((_, index) => index !== targetIdx);
      renderSetlist();
    };

    li.appendChild(removeBtn);
    setListEl.append(li);
  });
}

export function addToSetList(item) {
  setList.push({
    no: setList.length + 1,
    ...item,
  });

  renderSetlist();
}

export function updateLyricsInSetList(id, newData) {
  setList = setList.map((item) => {
    if (item.type === 'lyrics' && item.data.id === id) {
      return {
        ...item,
        data: {
          ...item.data,
          title: newData.title,
          lyrics: newData.lyrics,
        },
      };
    }
    return item;
  });

  renderSetlist();
}

function getDragAfterElement(y) {
  const notDraggedElements = [...setListEl.querySelectorAll('.draggable:not(.dragging)')];

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
