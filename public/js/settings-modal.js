const settingsModalEl = document.querySelector('#settingsModal');
const settingsModal = new bootstrap.Modal(settingsModalEl);

const filenameInput = document.querySelector('#modal-filename');
const bgColorInput = document.querySelector('#bg-color-input');
const bgColorRadios = document.querySelectorAll('input[name="bg-colorPicker"]');
const bgColorCustomBtn = document.querySelector('#bg-color-custom');
const fontColorInput = document.querySelector('#font-color-input');
const fontColorRadios = document.querySelectorAll(
  'input[name="font-colorPicker"]'
);
const fontColorCustomBtn = document.querySelector('#font-color-custom');
const horizontalAlignRadios = document.querySelectorAll(
  'input[name="horizontal-align"]'
);
const verticalAlignRadios = document.querySelectorAll(
  'input[name="vertical-align"]'
);
const previewDiv = document.querySelector('#preview-ppt');
const previewText = document.querySelector('#preview-text');

const lyricsOptions = {
  fontFace: '다음_SemiBold', // '나눔스퀘어라운드 Bold'; '나눔고딕 Bold';
  fontSize: 48,
  fontBold: false,
  fontItalic: false,
  fontUnderline: false,
  fontColor: '#FFFFFF',
  bgColor: '#009933',
  fontOutline: { size: 1.0, color: '#000000' },
  fontGlow: { size: 2, opacity: 1.0, color: '#000000' },
  align: 'center', // align(left, center, right, justify)
  valign: 'bottom', // vertical align(top, middle, bottom)
};

const alignProps = {
  left: 'start',
  center: 'center',
  right: 'end',
  top: 'start',
  middle: 'center',
  bottom: 'end',
};

settingsModalEl.addEventListener('shown.bs.modal', (e) => {
  initSettingsModal();
  filenameInput.focus();
});

bgColorInput.addEventListener('input', (e) => {
  bgColorRadios.forEach((radio) => (radio.checked = false));
  lyricsOptions.bgColor = e.target.value;
  renderPreviewLyrics();
});

bgColorRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      const bgColor = e.target.value;
      bgColorInput.value = bgColor;
      // previewDiv.style.backgroundColor = bgColor;

      lyricsOptions.bgColor = bgColor;
      renderPreviewLyrics();
    }
  });
});

bgColorCustomBtn.addEventListener('click', (e) => {
  bgColorInput.showPicker();
});

fontColorInput.addEventListener('input', (e) => {
  fontColorRadios.forEach((radio) => (radio.checked = false));
  lyricsOptions.fontColor = e.target.value;
  renderPreviewLyrics();
});

fontColorRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      const fontColor = e.target.value;

      lyricsOptions.fontColor = fontColor;
      renderPreviewLyrics();
    }
  });
});

fontColorCustomBtn.addEventListener('click', (e) => {
  fontColorInput.showPicker();
});

horizontalAlignRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      lyricsOptions.align = e.target.value;
      renderPreviewLyrics();
    }
  });
});

verticalAlignRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      lyricsOptions.valign = e.target.value;
      renderPreviewLyrics();
    }
  });
});

function renderPreviewLyrics() {
  const { bgColor, fontColor, align, valign } = lyricsOptions;

  // color
  bgColorInput.value = bgColor;
  fontColorInput.value = fontColor;
  previewDiv.style.backgroundColor = bgColor;
  previewText.style.color = fontColor;

  // align
  previewDiv.style.justifyContent = alignProps[align];
  previewDiv.style.alignItems = alignProps[valign];
}

function initSettingsModal() {
  // filename
  const today = getCurrentDate();
  filenameInput.value = `${today}_worship`;

  // color
  const defaultBgColorEl = document.querySelector('#bg-color-1');
  const defaultfontColorEl = document.querySelector('#font-color-1');
  defaultBgColorEl.checked = true;
  defaultfontColorEl.checked = true;

  // align
  const defaultVerticalAlignEl = document.querySelector(
    '#vertical-bottom-input'
  );
  const defaultHorizontalAlignEl = document.querySelector(
    '#horizontal-center-input'
  );
  defaultVerticalAlignEl.checked = true;
  defaultHorizontalAlignEl.checked = true;

  renderPreviewLyrics();
}
