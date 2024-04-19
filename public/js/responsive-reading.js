let rrInfo = null;
let rrChoices = null;

const rrSelect = document.querySelector('#responsive-reading-select');
rrSelect.addEventListener('change', async () => {
  const no = rrSelect.value;
  if (!no) {
    const rrCardBody = document.querySelector('#rr-card-body');
    rrCardBody.innerHTML = '';
    const p = document.createElement('p');
    // p.className = 'card-text text-center opacity-75';
    p.className = 'card-text text-body-secondary text-center';
    p.innerHTML = '교독문을 선택해 주세요.';
    rrCardBody.appendChild(p);
    return;
  }
  try {
    const response = await fetch(`/responsive-reading/${no}.json`);
    const data = await response.json();
    renderResponsiveReading(data);
  } catch (error) {
    console.error(error);
  }
});

function renderResponsiveReading(data) {
  const { no, title, contents } = data;

  const rrCardBody = document.querySelector('#rr-card-body');
  rrCardBody.innerHTML = '';

  const h5 = document.createElement('h5');
  h5.className = 'card-title text-center mb-4';
  h5.innerHTML = `${no}번. ${title}`;
  rrCardBody.appendChild(h5);

  for (let i = 0; i < contents.length; i++) {
    const p = document.createElement('p');
    p.className = 'card-text';
    if (i % 2 === 1 || contents[i].startsWith('(다같이)')) {
      p.classList.add('fw-bold');
    }
    p.innerHTML = contents[i];
    rrCardBody.appendChild(p);
  }

  const a = document.createElement('a');
  a.href = '#';
  a.className = 'btn btn-primary';
  a.innerHTML = `교독문 ${no}번 선택`;
  a.onclick = (e) => {
    e.preventDefault();

    setList.push({
      no: setList.length + 1,
      type: 'responsive-reading',
      data: {
        title: `${no}번. ${title}`,
        contents,
      },
    });

    renderSetlist();
  };
  rrCardBody.appendChild(a);
}

async function setResponsiveReadingSelectOptions(data) {
  for (const { no, title } of data) {
    const option = document.createElement('option');
    option.value = no;
    option.innerHTML = `${no}번. ${title}`;
    rrSelect.appendChild(option);
  }

  rrChoices = new Choices(rrSelect, {
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
}

async function getResponsiveReadingInfo() {
  const response = await fetch('/responsive-reading/index.json');
  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
  }
  const data = await response.json();
  return data;
}

async function initResponsiveReading() {
  try {
    if (!rrInfo) {
      rrInfo = await getResponsiveReadingInfo();
      setResponsiveReadingSelectOptions(rrInfo);
    }

    rrChoices.showDropdown();
  } catch (error) {
    console.error(error);
  }
}
