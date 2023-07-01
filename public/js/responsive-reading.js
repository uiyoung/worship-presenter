const rrSelect = document.querySelector('#responsive-reading-select');
rrSelect.addEventListener('change', async () => {
  const no = rrSelect.value;
  if (!no) {
    const rrCardBody = document.querySelector('#rr-card-body');
    rrCardBody.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'card-text text-center opacity-75';
    p.innerHTML = '교독문을 선택해 주세요.';
    rrCardBody.appendChild(p);
    return;
  }
  try {
    const response = await fetch(`/responsive-reading/${no}.json`);
    const rr = await response.json();
    renderResponsiveReading(rr);
  } catch (error) {
    console.error(error);
  }
});

function renderResponsiveReading(data) {
  const rrCardBody = document.querySelector('#rr-card-body');
  rrCardBody.innerHTML = '';
  const { no, title, contents } = data;

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
    selectedList.push({
      no: selectedList.length + 1,
      type: 'responsive-reading',
      title: `${no}번. ${title}`,
      contents,
    });
    renderSetlist();
  };
  rrCardBody.appendChild(a);
}

async function setResponsiveReadingSelectOptions() {
  const option = document.createElement('option');
  option.label = '교독문 선택';
  rrSelect.appendChild(option);

  try {
    const response = await fetch('/responsive-reading/index.json');
    const data = await response.json();

    for (const { no, title } of data) {
      const option = document.createElement('option');
      option.value = no;
      option.innerHTML = `${no}번. ${title}`;
      rrSelect.appendChild(option);
    }
  } catch (error) {
    console.error(error);
  }
}

setResponsiveReadingSelectOptions();
