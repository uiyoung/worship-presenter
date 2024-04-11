const downloadBtn = document.querySelector('#download-btn');

downloadBtn.addEventListener('click', (e) => {
  // add loading spinner to button
  const originalBtnText = e.target.innerHTML;
  e.target.innerHTML = '';
  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm mx-2';
  e.target.appendChild(spinner);
  e.target.innerHTML += 'PPT 생성 중...';
  e.target.disabled = true;

  // 1. Create a new Presentation
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  // 1-1. define slide masters
  const types = [...new Set(setList.map((item) => item.type))];
  defineSlideMasters(pptx, types);

  // 2. generate slides by type
  setList.forEach((item, idx) => {
    const sectionTitle = `${idx}_${item.title}`;

    switch (item.type) {
      case 'lyrics':
        generateLyrics(pptx, sectionTitle, item);
        break;
      case 'hymn-image':
        generateHymn(pptx, sectionTitle, item);
        break;
      case 'bible':
        generateBible(pptx, sectionTitle, item);
        break;
      case 'responsive-reading':
        generateResponsiveReading(pptx, sectionTitle, item);
        break;
      default:
        break;
    }
  });

  // 3. Save the Presentation
  const filename = filenameInput.value;
  pptx
    .writeFile({ fileName: `${filename}.pptx` })
    .then((fileName) => {
      console.log(`created file: ${fileName}`);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      downloadBtn.innerHTML = originalBtnText;
      downloadBtn.disabled = false;
      settingsModal.hide();
    });
});

// options
const CM_1 = 28.346; // 1cm = 28.346pt

const shadowOptions = {
  type: 'outer',
  angle: 45,
  blur: 3,
  color: '000000',
  offset: 3,
  opacity: 0.57,
};

const hymnTitleOptions = {
  fontSize1: 18,
  fontFace1: '마루 부리 조금굵은',
  fontColor1: '210C00',
  fontSize2: 36,
  fontFace2: '마루 부리 굵은',
  fontColor2: '431f00',
};

const bibleOptions = {
  fullScreenSubtitleOptions: {
    fontFace: '마루 부리 중간',
    fontSize: 20,
    color: 'FFFFFF',
  },
  fullScreenVerseOptions: {
    fontFace: '나눔명조 ExtraBold',
    fontSize: 40,
    color: 'FFFFFF',
  },
};

const rrTitleOptions = {
  fontFace: '나눔명조 ExtraBold',
  fontSize: 20,
  fontColor: 'FFFFFF',
};

const rrContentOptions = {
  fontFace: '다음_SemiBold',
  fontSize: 36,
  breakLine: false,
};

const rrContentColors = {
  group1: 'FFFFFF',
  group2: 'FFE699',
};

const slideMasterOptionsByType = {
  lyrics: [
    {
      title: 'LYRICS_TITLE_SLIDE',
      background: { color: lyricsOptions.bgColor },
      objects: [
        {
          placeholder: {
            options: {
              name: 'song-title',
              type: 'title',
              w: '100%',
              h: '20%',
              autoFit: true,
              align: 'left',
              valign: 'top',
              fontSize: 32,
              fontFace: lyricsOptions.fontFace,
              color: lyricsOptions.fontColor,
              outline: lyricsOptions.fontOutline,
              glow: lyricsOptions.fontGlow,
              margin: [CM_1, CM_1, CM_1, CM_1],
            },
            text: '(title here!)',
          },
        },
      ],
    },
    {
      title: 'LYRICS_SLIDE',
      background: { color: lyricsOptions.bgColor },
      objects: [
        {
          placeholder: {
            options: {
              name: 'lyrics-body',
              type: 'body',
              w: '100%',
              h: '100%',
              autoFit: true,
              align: lyricsOptions.align,
              valign: lyricsOptions.valign,
              bold: lyricsOptions.fontBold,
              italic: lyricsOptions.fontItalic,
              underline: lyricsOptions.fontUnderline,
              fontSize: lyricsOptions.fontSize,
              fontFace: lyricsOptions.fontFace,
              color: lyricsOptions.fontColor,
              outline: lyricsOptions.fontOutline,
              glow: lyricsOptions.fontGlow,
              lineSpacing: lyricsOptions.fontSize * 1.025,
              margin: [1, 1, CM_1, CM_1],
            },
            text: '(lyrics here!)',
          },
        },
      ],
    },
  ],
  hymn: [
    {
      title: 'HYMN_TITLE_SLIDE',
      background: { path: '/backgrounds/hymn-title-background.jpg' },
      objects: [
        {
          placeholder: {
            options: {
              name: 'hymn-no',
              type: 'title',
              x: 0,
              y: 2.32,
              w: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: hymnTitleOptions.fontSize1,
              fontFace: hymnTitleOptions.fontFace1,
              color: hymnTitleOptions.fontColor1,
            },
            text: '(hymn no here!)',
          },
        },
        {
          placeholder: {
            options: {
              name: 'hymn-title',
              type: 'title',
              x: 0,
              y: 3.75,
              w: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: hymnTitleOptions.fontSize2,
              fontFace: hymnTitleOptions.fontFace2,
              color: hymnTitleOptions.fontColor2,
            },
            text: '(hymn title here!)',
          },
        },
      ],
    },
  ],
  'responsive-reading': [
    {
      title: 'RR_TITLE_SLIDE',
      background: { path: '/backgrounds/rr-background.jpg' },
      objects: [
        {
          placeholder: {
            options: {
              name: 'rr-title',
              type: 'title',
              x: 0,
              y: 1.76,
              w: '100%',
              // h: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: 54,
              fontFace: rrTitleOptions.fontFace,
              color: rrTitleOptions.fontColor,
            },
            text: '(title here!)',
          },
        },
        {
          placeholder: {
            options: {
              name: 'rr-subtitle',
              type: 'title',
              x: 0,
              y: 2.64,
              w: '100%',
              // h: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: rrTitleOptions.fontSize,
              fontFace: rrTitleOptions.fontFace,
              color: rrTitleOptions.fontColor,
            },
            text: '(subtitle here!)',
          },
        },
      ],
    },
    {
      title: 'RR_CONTENT_SLIDE',
      background: { path: '/backgrounds/rr-background.jpg' },
      objects: [
        {
          rect: {
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
            fill: { color: '000000', transparency: 50 },
          },
        },
      ],
    },
  ],
  bible: [
    {
      title: 'BIBLE_COVER',
      background: { path: '/backgrounds/bible-fullscreen-bg.jpg' },
      objects: [
        {
          placeholder: {
            options: {
              name: 'rr-title',
              type: 'title',
              x: 0,
              y: 1.76,
              w: '100%',
              // h: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: 54,
              fontFace: rrTitleOptions.fontFace,
              color: rrTitleOptions.fontColor,
            },
            text: '(title here!)',
          },
        },
        {
          placeholder: {
            options: {
              name: 'rr-subtitle',
              type: 'title',
              x: 0,
              y: 2.64,
              w: '100%',
              // h: '100%',
              autoFit: true,
              align: 'center',
              valign: 'middle',
              fontSize: rrTitleOptions.fontSize,
              fontFace: rrTitleOptions.fontFace,
              color: rrTitleOptions.fontColor,
            },
            text: '(subtitle here!)',
          },
        },
      ],
    },
    {
      title: 'BIBLE_SLIDE',
      background: { path: '/backgrounds/bible-fullscreen-bg.jpg' },
      // objects: [{ rect: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 } } }],
    },
  ],
};

function defineSlideMasters(pptx, types) {
  types.forEach((type) => {
    slideMasterOptionsByType[type].forEach((options) => {
      pptx.defineSlideMaster(options);
    });
  });
}

function generateLyrics(pptx, sectionTitle, item) {
  // add section
  pptx.addSection({ title: sectionTitle });

  const { title, lyrics } = item;

  // add lyrics title slide
  const slide = pptx.addSlide({
    masterName: 'LYRICS_TITLE_SLIDE',
    sectionTitle,
  });
  slide.addText(title, { placeholder: 'song-title' });

  // add lyrics slide
  const lyricsPerSlideArr = lyrics.split('\n\n');
  lyricsPerSlideArr.forEach((lyrics) => {
    const slide = pptx.addSlide({
      masterName: 'LYRICS_SLIDE',
      sectionTitle,
    });

    slide.addText(lyrics, { placeholder: 'lyrics-body' });
  });
}

function generateHymn(pptx, sectionTitle, item) {
  // add section
  pptx.addSection({ title: sectionTitle });

  // add hymn title slide
  const [hymnNo, title] = item.title.split('-');
  const hymnTitleSlide = pptx.addSlide({
    masterName: 'HYMN_TITLE_SLIDE',
    sectionTitle,
  });
  hymnTitleSlide.addText(hymnNo, { placeholder: 'hymn-no' });
  hymnTitleSlide.addText(title, { placeholder: 'hymn-title' });

  // add hymn image slides
  item.images.forEach((image) => {
    const imgSlide = pptx.addSlide({ sectionTitle });
    imgSlide.background = { path: image }; // image: url
  });
}

function generateBible(pptx, sectionTitle, item) {
  // add section
  pptx.addSection({ title: sectionTitle });

  // todo : add bible cover slide
  // const bibleCoverSlide = pptx.addSlide({ masterName: 'RR_TITLE_SLIDE', sectionTitle });
  // bibleCoverSlide
  //   .addText('교독문', {
  //     placeholder: 'rr-title',
  //     shadow: shadowOptions,
  //   })
  //   .addShape(pptx.ShapeType.rect, { fill: { color: 'FFFFFF' }, h: 0.07, w: 1.51, x: 5.91, y: 2.25 })
  //   .addText(`${item.title}`, { placeholder: 'rr-subtitle' });

  const { bookName, chapter, verses } = item.data;

  // bible slide
  const sortedKeys = Object.keys(verses).sort((a, b) => a - b);
  for (const key of sortedKeys) {
    const bibleSlide = pptx.addSlide({
      masterName: 'BIBLE_SLIDE',
      sectionTitle,
    });
    bibleSlide
      // bible info
      .addText(
        [
          {
            // text: item.title,
            text: `${bookName} ${chapter}${
              bookName === '시편' ? '편' : '장'
            } ${key}절`,
            options: { ...bibleOptions.fullScreenSubtitleOptions },
          },
        ],
        {
          x: 0.4,
          y: 0.2,
          w: '30%',
          h: '10%',
          align: 'left',
          valign: 'center',
          margin: [0, 30, 100, 100],
          wrap: true,
        }
      )
      // verse no
      .addText(
        [
          {
            text: `${key}.`,
            options: {
              ...bibleOptions.fullScreenSubtitleOptions,
              fontSize: 32,
            },
          },
        ],
        {
          x: 0.2,
          y: 1.34,
          w: '6%',
          h: '10%',
          align: 'right',
          valign: 'center',
          margin: [0, 0, 0, 0],
          wrap: true,
        }
      )
      // verse
      .addText(
        [
          {
            text: verses[key],
            options: { ...bibleOptions.fullScreenVerseOptions },
          },
        ],
        {
          x: 1.2,
          y: 0,
          w: '90%',
          h: '100%',
          align: 'left',
          valign: 'top',
          margin: [0, 30, 100, 100],
          wrap: true,
        }
      );
  }
}

function generateResponsiveReading(pptx, sectionTitle, item) {
  // add section
  pptx.addSection({ title: sectionTitle });

  // add rr title slide
  const rrSlide = pptx.addSlide({
    masterName: 'RR_TITLE_SLIDE',
    sectionTitle,
  });
  rrSlide
    .addText('교독문', {
      placeholder: 'rr-title',
      shadow: shadowOptions,
    })
    .addShape(pptx.ShapeType.rect, {
      fill: { color: 'FFFFFF' },
      h: 0.07,
      w: 1.51,
      x: 5.91,
      y: 2.25,
    })
    .addText(`${item.title}`, { placeholder: 'rr-subtitle' });

  // 교독문 두개씩 묶기
  const pairs = item.contents.reduce((result, current, index) => {
    if (index % 2 === 0) {
      if (index === item.contents.length - 1) {
        result.push([current]);
      } else {
        result.push([current, item.contents[index + 1]]);
      }
    }
    return result;
  }, []);

  pairs.map((pair) => {
    const rrContentSlide = pptx.addSlide({
      masterName: 'RR_CONTENT_SLIDE',
      sectionTitle,
    });

    if (pair.length == 1) {
      // console.log(`group2: ${pair[0]}`);
      rrContentSlide.addText(
        [
          {
            text: pair[0],
            options: {
              ...rrContentOptions,
              color: rrContentColors.group2,
            },
          },
        ],
        {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          align: 'left',
          valign: 'top',
          margin: [30, 30, 100, 100],
          wrap: true,
        }
      );
    } else {
      // console.log(`group 1: ${pair[0]}, group 2: ${pair[1]}`);
      rrContentSlide.addText(
        [
          {
            text: pair[0],
            options: {
              ...rrContentOptions,
              color: rrContentColors.group1,
            },
          },
          { text: '\n\n' },
          {
            text: pair[1],
            options: {
              ...rrContentOptions,
              color: rrContentColors.group2,
            },
          },
        ],
        {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          align: 'left',
          valign: 'top',
          margin: [30, 30, 100, 100],
        }
      );
    }
  });
}
