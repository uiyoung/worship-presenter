let hymnInfo = null;
let hymnChoices = null;

const hymnCarousel = document.querySelector('#hymn-carousel');
const hymnIndicators = document.querySelector('#hymn-indicators');
const hymnSlide = document.querySelector('#hymn-slide');
const hymnImageBtn = document.querySelector('#hymn-image-btn');
const carouselPrevBtn = document.querySelector('.carousel-control-prev');
const carouselNextBtn = document.querySelector('.carousel-control-next');

const hymnLyricsModal = new bootstrap.Modal(document.querySelector('#hymnLyricsModal'));

const hymnSelect = document.querySelector('#hymn-select');
hymnSelect.addEventListener('change', async () => {
  const no = hymnSelect.value;
  if (!no) {
    const hymnCardBody = document.querySelector('#hymn-card-body');
    hymnCardBody.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'card-text text-body-secondary text-center';
    p.innerHTML = '찬송가를 선택해 주세요.';
    hymnCardBody.appendChild(p);

    hymnSlide.innerHTML = '';
    hymnIndicators.innerHTML = '';
    hymnSlide.innerHTML = '';
    hymnImageBtn.innerHTML = '';
    carouselPrevBtn.innerHTML = '';
    carouselNextBtn.innerHTML = '';
    return;
  }

  // hymn lyrcis
  try {
    const response = await fetch(`/resources/hymn/lyrics/${no}.json`);
    const hymnLyricsData = await response.json();
    renderHymnLyrics(hymnLyricsData);
  } catch (error) {
    console.error(error);
  }

  // hymn image
  try {
    const response = await fetch(`/api/hymn/images/${no}`);
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const hymnImageData = await response.json();
    renderHymnImages(hymnImageData);
  } catch (error) {
    console.error(error);
    hymnSlide.innerHTML = '이미지 불러오기 실패';
    hymnIndicators.innerHTML = '';
    hymnSlide.innerHTML = '';
    hymnImageBtn.innerHTML = '';
    carouselPrevBtn.innerHTML = '';
    carouselNextBtn.innerHTML = '';
  }
});

function renderHymnLyrics(data) {
  const hymnCardBody = document.querySelector('#hymn-card-body');
  hymnCardBody.innerHTML = '';

  const { no, title, verses } = data;

  // title
  const div = document.createElement('div');
  div.className = 'card-title mb-4 d-flex';

  const h5 = document.createElement('h5');
  h5.className = 'flex-grow-1 text-center';
  h5.innerHTML = `${no}장. ${title}`;
  div.appendChild(h5);

  // modify button
  const modifyLyricsBtn = document.createElement('a');
  modifyLyricsBtn.href = '#';
  modifyLyricsBtn.className = 'btn btn-outline-success position-absolute top-0 end-0 m-2';
  modifyLyricsBtn.innerHTML = `수정`;
  modifyLyricsBtn.onclick = async (e) => {
    e.preventDefault();

    // open modal
    hymnLyricsModal.show();
    const modalTitle = document.querySelector('#hymnLyricsModalLabel');
    modalTitle.innerHTML = `${no}장. ${title}`;
    const modalBody = document.querySelector('#hymn-modal-body');
    modalBody.innerHTML = '';

    for (const key in verses) {
      const div = document.createElement('div');
      div.className = 'mb-3';
      const label = document.createElement('label');
      label.htmlFor = `textarea${key}`;
      label.className = 'form-label';
      label.innerHTML = `${key}절`;
      div.appendChild(label);
      const textarea = document.createElement('textarea');
      textarea.className = 'form-control hymn-textarea';
      textarea.value = `${verses[key]}`;
      textarea.rows = verses[key].split('\n').length;
      div.appendChild(textarea);
      modalBody.appendChild(div);
    }

    const modifyBtn = document.querySelector('#hymn-modal-modify-btn');
    modifyBtn.onclick = async () => {
      if (!confirm(`수정 하시겠습니까?`)) {
        return;
      }

      const textareas = document.querySelectorAll('.hymn-textarea');
      const newVerses = Array.from(textareas)
        .filter((textarea) => textarea.value !== '')
        .reduce((acc, textarea, idx) => {
          acc[idx + 1] = textarea.value;
          return acc;
        }, {});

      try {
        const response = await fetch(`/api/hymn/lyrics/${no}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVerses),
        });

        const result = await response.json();
        // console.log(result);

        if (!result.success && result.redirectURL) {
          alert('로그인이 필요합니다.');
          return;
        }

        hymnSelect.dispatchEvent(new Event('change'));
        hymnLyricsModal.hide();
      } catch (error) {
        alert('수정 실패');
        console.error(error);
      }
    };

    const hymnDivideLinesBtn = document.querySelector('#hymn-modal-divide-lines-btn');
    hymnDivideLinesBtn.onclick = () => {
      const hymnTextAreas = document.querySelectorAll('.hymn-textarea');
      const linesPerSlide = Number(document.querySelector('#hymn-lines-per-slide').value) || 2;
      hymnTextAreas.forEach((textarea) => {
        textarea.value = divideTextByLines(textarea.value, linesPerSlide);
        textarea.rows = textarea.value.split('\n').length;
      });
    };
  };

  div.appendChild(modifyLyricsBtn);
  hymnCardBody.appendChild(div);

  for (const key in verses) {
    const p = document.createElement('p');
    p.className = 'card-text';

    const span = document.createElement('span');
    span.classList = 'me-1 d-flex';

    const verseNo = document.createElement('a');
    verseNo.href = `#verse${key}`;
    verseNo.id = `verse${key}`;
    verseNo.classList = 'me-2 opacity-75 text-success-emphasis';
    verseNo.innerHTML = key;
    span.appendChild(verseNo);

    const verse = document.createElement('span');
    verse.innerHTML = verses[key].replaceAll('\n', '<br/>');
    span.appendChild(verse);

    p.appendChild(span);
    hymnCardBody.appendChild(p);
  }

  // select button
  const selectLyricsBtn = document.createElement('selectLyricsBtn');
  selectLyricsBtn.href = '#';
  selectLyricsBtn.className = 'btn btn-primary';
  selectLyricsBtn.innerHTML = `가사 선택`;
  selectLyricsBtn.onclick = (e) => {
    e.preventDefault();

    // convert hymn verses to lyrics string
    const lyricsArr = [];
    for (let key in verses) {
      lyricsArr.push(`${key}.${verses[key]}`);
    }
    const lyrics = lyricsArr.join('\n\n');

    setList.push({
      no: setList.length + 1,
      type: 'lyrics',
      data: {
        title: `찬송가 ${no}장-${title}`,
        lyrics,
      },
    });

    renderSetlist();
  };
  hymnCardBody.appendChild(selectLyricsBtn);
}

function renderHymnImages(data) {
  const { no, title, images } = data;

  // hymnCarousel.innerHTML = '';
  hymnIndicators.innerHTML = '';
  hymnSlide.innerHTML = '';
  hymnImageBtn.innerHTML = '';
  carouselPrevBtn.innerHTML = '';
  carouselNextBtn.innerHTML = '';

  images
    .sort((a, b) => {
      // Sort the image file names in ascending order(numerically)
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    })
    .forEach((image, index) => {
      // append indicators
      const button = document.createElement('button');
      button.className = index === 0 ? 'active' : '';
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-target', '#hymn-carousel');
      button.setAttribute('data-bs-slide-to', `${index}`);
      button.setAttribute('aria-label', `Slide ${index + 1}`);
      hymnIndicators.appendChild(button);

      // append slides
      const div = document.createElement('div');
      div.className = 'carousel-item' + (index === 0 ? ' active' : '');

      const img = document.createElement('img');
      img.className = 'd-block w-100';
      img.src = `/resources/hymn/images/${no}/${image}`;
      img.loading = 'lazy';
      div.appendChild(img);
      hymnSlide.appendChild(div);
    });

  // prev, next button
  const spanPrev = document.createElement('span');
  spanPrev.className = 'carousel-control-prev-icon';
  carouselPrevBtn.appendChild(spanPrev);

  const spanNext = document.createElement('span');
  spanNext.className = 'carousel-control-next-icon';
  carouselNextBtn.appendChild(spanNext);

  // select button
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'btn btn-primary';
  a.innerHTML = `이미지 선택`;
  a.onclick = (e) => {
    e.preventDefault();

    setList.push({
      no: setList.length + 1,
      type: 'hymn-image',
      data: {
        title: `찬송가 ${no}장-${title}`,
        images: images.map((image) => `/resources/hymn/images/${no}/${image}`),
      },
    });

    renderSetlist();
  };
  hymnImageBtn.appendChild(a);
}

async function getHymnInfo() {
  const response = await fetch('/resources/hymn/index.json');
  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
  }
  const data = await response.json();
  return data;
}

async function setHymnSelectOptions(data) {
  try {
    // const response = await fetch('/resources/hymn/index.json');
    // const data = await response.json();

    for (const { no, title } of data.hymn) {
      const option = document.createElement('option');
      option.value = no;
      option.innerHTML = `${no}장. ${title}`;
      hymnSelect.appendChild(option);
    }

    hymnChoices = new Choices(hymnSelect, {
      silent: false,
      choices: [],
      renderChoiceLimit: -1,
      removeItemButton: false,
      allowHTML: false,
      searchEnabled: true,
      searchChoices: true,
      searchFields: ['label', 'value'],
      searchFloor: 1,
      searchResultLimit: 10,
      position: 'auto',
      shouldSort: false,
      searchPlaceholderValue: null,
      prependValue: null,
      appendValue: null,
      loadingText: 'Loading...',
      noResultsText: 'No results found',
      itemSelectText: 'Press to select',
      customAddItemText: 'Only values matching specific conditions can be added',
      valueComparer: (value1, value2) => {
        return value1 === value2;
      },
      // Choices uses the great Fuse library for searching. You can find more options here: https://fusejs.io/api/options.html
      fuseOptions: {
        includeScore: true,
      },
      labelId: '',
      callbackOnInit: null,
      callbackOnCreateTemplates: null,
    });
  } catch (error) {
    console.error(error);
  }
}

async function initHymn() {
  try {
    if (!hymnInfo) {
      hymnInfo = await getHymnInfo();
      setHymnSelectOptions(hymnInfo);
      hymnSelect.value = '';
      hymnSelect.dispatchEvent(new Event('change'));
    }
    hymnChoices.showDropdown();
  } catch (error) {
    console.error(error);
  }
}
