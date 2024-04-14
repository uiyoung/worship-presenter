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

const lyricsSetting = {
  isCoverSlide: true,
  bgColor: '#009933',
  fontColor: '#FFFFFF',
  fontFace: '다음_SemiBold', // '나눔스퀘어라운드 Bold'; '나눔고딕 Bold';
  fontSize: 48,
  fontBold: false,
  fontItalic: false,
  fontUnderline: false,
  fontOutline: { size: 1.4, color: '#000000' },
  // fontGlow: { size: 2, opacity: 1.0, color: '000000' },
  align: 'center', // align(left, center, right, justify)
  valign: 'bottom', // vertical align(top, middle, bottom)
};

const hymnSetting = {
  isCoverSlide: true,
  cover: {
    fontSize1: 18,
    fontFace1: '마루 부리 조금굵은',
    fontColor1: '210C00',
    fontSize2: 36,
    fontFace2: '마루 부리 굵은',
    fontColor2: '431f00',
    backgroundImage: '/backgrounds/hymn-title-background.jpg',
  },
};

const bibleSetting = {
  isCoverSlide: false, // TODO: set true when bible cover slide implemented
  isFullScreen: true,
  cover: {
    bgImage: '/backgrounds/bible-fullscreen-bg.jpg',
    fontFace: '나눔명조 ExtraBold',
    fontSize: 20,
    fontColor: '#FFFFFF',
  },
  fullScreen: {
    bgImage: '/backgrounds/bible-fullscreen-bg.jpg',
    info: {
      fontFace: '마루 부리 중간',
      fontSize: 20,
      color: '#FFFFFF',
    },
    verse: {
      fontFace: '나눔명조 ExtraBold',
      fontSize: 40,
      color: '#FFFFFF',
    },
  },
  subtitle: {},
};

const rrSetting = {
  isCoverSlide: true,
  cover: {
    fontFace: '나눔명조 ExtraBold',
    fontSize: 20,
    fontColor: '#FFFFFF',
  },
  content: {
    fontFace: '다음_SemiBold',
    fontSize: 36,
    breakLine: false,
    group1Color: '#FFFFFF',
    group2Color: '#FFE699',
  },
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
    fontOutline: { size: 1.4, color: '#000000' },
    // fontGlow: { size: 2, opacity: 1.0, color: '000000' },
    fontGlow: undefined,
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
  lyricsSetting.bgColor = e.target.value;
  lyricsSetting.fontOutline = undefined;
  lyricsSetting.fontGlow = undefined;
  renderPreviewLyrics();
});

fontColorInput.addEventListener('input', (e) => {
  presetColorRadios.forEach((radio) => (radio.checked = false));
  lyricsSetting.fontColor = e.target.value;
  lyricsSetting.fontOutline = undefined;
  lyricsSetting.fontGlow = undefined;
  renderPreviewLyrics();
});

presetCustomBtn.addEventListener('click', (e) => bgColorInput.showPicker());

presetColorRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      const { bgColor, fontColor, fontOutline, fontGlow } =
        colorsByPreset[e.target.value];

      bgColorInput.value = bgColor;
      fontColorInput.value = fontColor;

      lyricsSetting.bgColor = bgColor;
      lyricsSetting.fontColor = fontColor;
      lyricsSetting.fontOutline = fontOutline;
      lyricsSetting.fontGlow = fontGlow;

      renderPreviewLyrics();
    }
  });
});

horizontalAlignRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      lyricsSetting.align = e.target.value;
      renderPreviewLyrics();
    }
  });
});

verticalAlignRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (radio.checked) {
      lyricsSetting.valign = e.target.value;
      renderPreviewLyrics();
    }
  });
});

function renderPreviewLyrics() {
  const { bgColor, fontColor, fontOutline, align, valign } = lyricsSetting;

  // color
  bgColorInput.value = bgColor;
  fontColorInput.value = fontColor;
  previewDiv.parentElement.style.backgroundColor = bgColor;
  previewText.style.color = fontColor;
  previewText.style.textShadow = fontOutline
    ? `-1px -1px 0 ${fontOutline.color}, 1px -1px 0 ${fontOutline.color}, -1px 1px 0 ${fontOutline.color}, 1px 1px 0 ${fontOutline.color}`
    : 'none';

  // align
  previewDiv.style.justifyContent = alignProps[align];
  previewDiv.style.alignItems = alignProps[valign];
}

const settingElementIdByType = {
  lyrics: 'lyrics-setting',
  'hymn-image': 'hymn-setting',
  bible: 'bible-setting',
  'responsive-reading': 'rr-setting',
};

function initSettingsModal() {
  // filename
  const today = getCurrentDate();
  filenameInput.value = `${today}_worship`;

  // settings by selected types
  document
    .querySelectorAll('.accordion-item')
    .forEach((el) => (el.hidden = true));

  const types = [...new Set(setList.map((item) => item.type))];
  types.forEach((type) => {
    document.querySelector(`#${settingElementIdByType[type]}`).hidden = false;

    switch (type) {
      case 'lyrics':
        document
          .querySelector('#lyrics-cover-slide')
          .addEventListener('change', (e) => {
            lyricsSetting.isCoverSlide = e.target.checked;
          });

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
        defaultVerticalAlignEl.dispatchEvent(new Event('change'));
        defaultHorizontalAlignEl.dispatchEvent(new Event('change'));

        break;
      case 'hymn-image':
        document
          .querySelector('#hymn-cover-slide')
          .addEventListener('change', (e) => {
            hymnSetting.isCoverSlide = e.target.checked;
          });

        break;
      case 'bible':
        document
          .querySelector('#bible-cover-slide')
          .addEventListener('change', (e) => {
            rrSetting.isCoverSlide = e.target.checked;
          });
        break;
      case 'responsive-reading':
        document
          .querySelector('#rr-cover-slide')
          .addEventListener('change', (e) => {
            rrSetting.isCoverSlide = e.target.checked;
          });
        break;
      default:
        break;
    }
  });

  renderPreviewLyrics();
}
