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
    const response = await fetch(`/hymn/lyrics/${no}.json`);
    const data = await response.json();
    renderHymnLyrics(data);
  } catch (error) {
    console.error(error);
  }

  // hymn image
  try {
    const response = await fetch(`/hymn/images/${no}`);
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const data = await response.json();
    renderHymnImages(data);
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
        const response = await fetch(`/hymn/lyrics/${no}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVerses),
        });

        const result = await response.json();
        console.log(result);

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

    const autoAlignBtn = document.querySelector('#hymn-modal-auto-align-btn');
    autoAlignBtn.onclick = () => {
      const textareas = document.querySelectorAll('.hymn-textarea');
      textareas.forEach((textarea) => {
        const alignedText = autoAlign(textarea.value);
        textarea.value = alignedText;
      });
    };
  };

  function autoAlign(text) {
    const lines = text
      .split('\n')
      .filter((e) => e != '')
      .map((e) => e.trim().replace(/\s+/g, ' '));

    const LINES_PER_SLIDE = 2;
    let result = [];
    const temp = [...lines];
    const cnt = Math.ceil(temp.length / LINES_PER_SLIDE);
    for (let i = 0; i < cnt; i++) {
      result.push(temp.splice(0, LINES_PER_SLIDE));
    }
    result = result.map((e) => e.join('\n')).join('\n\n');
    return result;
  }

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

    selectedList.push({
      no: selectedList.length + 1,
      type: 'lyrics',
      title: `찬송가 ${no}장-${title}`,
      lyrics,
    });
    renderSetlist();
  };
  hymnCardBody.appendChild(selectLyricsBtn);
}

function renderHymnImages(data) {
  const { no, title, images } = data;
  // Sort the image file names in ascending order(numerically)
  images.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

  // hymnCarousel.innerHTML = '';
  hymnIndicators.innerHTML = '';
  hymnSlide.innerHTML = '';
  hymnImageBtn.innerHTML = '';
  carouselPrevBtn.innerHTML = '';
  carouselNextBtn.innerHTML = '';

  images.forEach((image, index) => {
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
    img.src = `/hymn/images/${no}/${image}`;
    img.loading = 'lazy';
    div.appendChild(img);
    hymnSlide.appendChild(div);
  });

  // prev, next button
  // <span class="carousel-control-prev-icon" aria-hidden="true"></span>
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
    selectedList.push({
      no: selectedList.length + 1,
      type: 'hymn-image',
      title: `찬송가 ${no}장-${title}`,
      images: images.map((image) => `/hymn/images/${no}/${image}`),
    });
    renderSetlist();
  };
  hymnImageBtn.appendChild(a);
}

async function setHymnSelectOptions() {
  const option = document.createElement('option');
  option.label = '찬송가 선택';
  hymnSelect.appendChild(option);

  try {
    const response = await fetch('/hymn/index.json');
    const data = await response.json();

    for (const { no, title } of data.hymn) {
      const option = document.createElement('option');
      option.value = no;
      option.innerHTML = `${no}장. ${title}`;
      hymnSelect.appendChild(option);
    }
  } catch (error) {
    console.error(error);
  }
}

setHymnSelectOptions();
hymnSelect.value = '';
hymnSelect.dispatchEvent(new Event('change'));
