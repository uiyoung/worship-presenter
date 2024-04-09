const settingsModalEl = document.querySelector('#settingsModal');
const settingsModal = new bootstrap.Modal(settingsModalEl);

const filenameInput = document.querySelector('#modal-filename');
const bgColorInput = document.querySelector('#bg-color-input');
const fontColorInput = document.querySelector('#font-color-input');
const presetColorRadios = document.querySelectorAll(
  'input[name="preset-color"]'
);
const presetCustomBtn = document.querySelector('#preset-color-custom');
const horizontalAlignRadios = document.querySelectorAll(
  'input[name="horizontal-align"]'
);
const verticalAlignRadios = document.querySelectorAll(
  'input[name="vertical-align"]'
);
const previewDiv = document.querySelector('#preview-ppt');
const previewText = document.querySelector('#preview-text');

const lyricsOptions = {
  bgColor: '#009933',
  fontColor: '#FFFFFF',
  fontFace: '다음_SemiBold', // '나눔스퀘어라운드 Bold'; '나눔고딕 Bold';
  fontSize: 48,
  fontBold: false,
  fontItalic: false,
  fontUnderline: false,
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

const colorsByPreset = {
  preset1: {
    bgColor: '#009933',
    fontColor: '#FFFFFF',
    fontOutline: { size: 1.0, color: '#000000' },
    fontGlow: { size: 2, opacity: 1.0, color: '#000000' },
  },
  preset2: {
    bgColor: '#1e1e2e',
    fontColor: '#eff1f5',
    outlineColor: undefined,
    fontGlow: undefined,
  },
  preset3: {
    bgColor: '#eff1f5',
    fontColor: '#8839ef',
    outlineColor: undefined,
    fontGlow: undefined,
  },
  preset4: {
    bgColor: '#f2cdcd',
    fontColor: '#4c4f69',
    outlineColor: undefined,
    fontGlow: undefined,
  },
  preset5: {
    bgColor: '#94e2d5',
    fontColor: '#303446',
    outlineColor: undefined,
    fontGlow: undefined,
  },
};

bgColorInput.addEventListener('input', (e) => {
  presetColorRadios.forEach((radio) => (radio.checked = false));
  lyricsOptions.bgColor = e.target.value;
  lyricsOptions.fontOutline = undefined;
  lyricsOptions.fontGlow = undefined;
  renderPreviewLyrics();
});

fontColorInput.addEventListener('input', (e) => {
  presetColorRadios.forEach((radio) => (radio.checked = false));
  lyricsOptions.fontColor = e.target.value;
  lyricsOptions.fontOutline = undefined;
  lyricsOptions.fontGlow = undefined;
  renderPreviewLyrics();
});

presetCustomBtn.addEventListener('click', (e) => {
  bgColorInput.showPicker();
});

presetColorRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      const { bgColor, fontColor, fontOutline, fontGlow } =
        colorsByPreset[e.target.value];

      bgColorInput.value = bgColor;
      fontColorInput.value = fontColor;

      lyricsOptions.bgColor = bgColor;
      lyricsOptions.fontColor = fontColor;
      lyricsOptions.fontOutline = fontOutline;
      lyricsOptions.fontGlow = fontGlow;

      renderPreviewLyrics();
    }
  });
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
  const { bgColor, fontColor, fontOutline, align, valign } = lyricsOptions;

  // color
  bgColorInput.value = bgColor;
  fontColorInput.value = fontColor;
  previewDiv.parentElement.style.backgroundColor = bgColor;
  previewText.style.color = fontColor;
  // previewText.style.textShadow = `-1px -1px 0 ${fontOutline.color}, 1px -1px 0 ${fontOutline.color}, -1px 1px 0 ${fontOutline.color}, 1px 1px 0 ${fontOutline.color}`;

  // align
  previewDiv.style.justifyContent = alignProps[align];
  previewDiv.style.alignItems = alignProps[valign];
}

function initSettingsModal() {
  // filename
  const today = getCurrentDate();
  filenameInput.value = `${today}_worship`;

  // color
  const defaultColorPresetEl = document.querySelector('#preset1');
  defaultColorPresetEl.checked = true;

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
