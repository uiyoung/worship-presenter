import { lyricsSetting, hymnSetting, bibleSetting, rrSetting } from './settings-modal.js';

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

function defineSlideMastersInTypes(pptx, types) {
  types.forEach((type) => {
    switch (type) {
      case 'lyrics':
        // lyrics cover slide master
        if (lyricsSetting.isCoverSlide) {
          pptx.defineSlideMaster({
            title: 'LYRICS_TITLE_SLIDE',
            background: { color: lyricsSetting.bgColor },
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
                    fontFace: lyricsSetting.fontFace,
                    color: lyricsSetting.fontColor,
                    outline: lyricsSetting.fontOutline,
                    // glow: lyricsSetting.fontGlow,
                    margin: [CM_1, CM_1, CM_1, CM_1],
                  },
                  text: '(title here!)',
                },
              },
            ],
          });
        }

        // lyrics content slide master
        pptx.defineSlideMaster({
          title: 'LYRICS_SLIDE',
          background: { color: lyricsSetting.bgColor },
          objects: [
            {
              placeholder: {
                options: {
                  name: 'lyrics-body',
                  type: 'body',
                  w: '100%',
                  h: '100%',
                  autoFit: true,
                  align: lyricsSetting.align,
                  valign: lyricsSetting.valign,
                  bold: lyricsSetting.fontBold,
                  italic: lyricsSetting.fontItalic,
                  underline: lyricsSetting.fontUnderline,
                  fontSize: lyricsSetting.fontSize,
                  fontFace: lyricsSetting.fontFace,
                  color: lyricsSetting.fontColor,
                  outline: lyricsSetting.fontOutline,
                  glow: lyricsSetting.fontGlow,
                  lineSpacing: lyricsSetting.fontSize * 1.025,
                  margin: [1, 1, CM_1, CM_1],
                },
                text: '(lyrics here!)',
              },
            },
          ],
        });
        break;
      case 'hymn-image':
        // hymn cover slide master
        if (hymnSetting.isCoverSlide) {
          pptx.defineSlideMaster({
            title: 'HYMN_TITLE_SLIDE',
            background: { path: hymnSetting.cover.backgroundImage },
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
                    fontSize: hymnSetting.cover.fontSize1,
                    fontFace: hymnSetting.cover.fontFace1,
                    color: hymnSetting.cover.fontColor1,
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
                    fontSize: hymnSetting.cover.fontSize2,
                    fontFace: hymnSetting.cover.fontFace2,
                    color: hymnSetting.cover.fontColor2,
                  },
                  text: '(hymn title here!)',
                },
              },
            ],
          });
        }
        break;
      case 'bible':
        // bible cover slide master
        if (bibleSetting.isCoverSlide) {
          pptx.defineSlideMaster({
            title: 'BIBLE_COVER_SLIDE',
            background: { path: bibleSetting.cover.bgImage },
            objects: [
              {
                placeholder: {
                  options: {
                    name: 'bible-title',
                    type: 'title',
                    x: 0,
                    y: 1.76,
                    w: '100%',
                    // h: '100%',
                    autoFit: true,
                    align: 'center',
                    valign: 'middle',
                    fontSize: 54,
                    fontFace: bibleSetting.cover.fontFace,
                    color: bibleSetting.cover.fontColor,
                  },
                  text: '(title here!)',
                },
              },
              {
                placeholder: {
                  options: {
                    name: 'bible-subtitle',
                    type: 'title',
                    x: 0,
                    y: 2.64,
                    w: '100%',
                    // h: '100%',
                    autoFit: true,
                    align: 'center',
                    valign: 'middle',
                    fontSize: bibleSetting.cover.fontSize,
                    fontFace: bibleSetting.cover.fontFace,
                    color: bibleSetting.cover.fontColor,
                  },
                  text: '(subtitle here!)',
                },
              },
            ],
          });
        }

        // bible content slide master
        pptx.defineSlideMaster({
          title: 'BIBLE_SLIDE',
          background: { path: bibleSetting.fullScreen.bgImage },
          // objects: [{ rect: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 } } }],
        });
        break;
      case 'responsive-reading':
        // rr cover slide master
        if (rrSetting.isCoverSlide) {
          pptx.defineSlideMaster({
            title: 'RR_TITLE_SLIDE',
            background: { path: '/resources/backgrounds/rr-background.jpg' },
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
                    fontFace: rrSetting.cover.fontFace,
                    color: rrSetting.cover.fontColor,
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
                    fontSize: rrSetting.cover.fontSize,
                    fontFace: rrSetting.cover.fontFace,
                    color: rrSetting.cover.fontColor,
                  },
                  text: '(subtitle here!)',
                },
              },
            ],
          });
        }

        // rr content slide master
        pptx.defineSlideMaster({
          title: 'RR_CONTENT_SLIDE',
          background: { path: '/resources/backgrounds/rr-background.jpg' },
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
        });
        break;
      default:
        break;
    }
  });
}

function generateLyrics(pptx, sectionTitle, data) {
  // add section
  pptx.addSection({ title: sectionTitle });

  const { title, lyrics } = data;

  // add lyrics cover slide
  if (lyricsSetting.isCoverSlide) {
    const coverSlide = pptx.addSlide({
      masterName: 'LYRICS_TITLE_SLIDE',
      sectionTitle,
    });
    coverSlide.addText(title, { placeholder: 'song-title' });
  }

  // add lyrics slide
  const lyricsPerSlideArr = lyrics.split('\n\n');
  lyricsPerSlideArr.forEach((lyrics) => {
    const lyricsSlide = pptx.addSlide({
      masterName: 'LYRICS_SLIDE',
      sectionTitle,
    });

    lyricsSlide.addText(lyrics, { placeholder: 'lyrics-body' });
  });
}

function generateHymn(pptx, sectionTitle, data) {
  // add section
  pptx.addSection({ title: sectionTitle });

  const { title, images } = data;

  // add hymn cover slide
  if (hymnSetting.isCoverSlide) {
    const [hymnNo, hymnTitle] = title.split('-');
    const hymnTitleSlide = pptx.addSlide({
      masterName: 'HYMN_TITLE_SLIDE',
      sectionTitle,
    });
    hymnTitleSlide.addText(hymnNo, { placeholder: 'hymn-no' });
    hymnTitleSlide.addText(hymnTitle, { placeholder: 'hymn-title' });
  }

  // add hymn image slides
  images.forEach((image) => {
    const imgSlide = pptx.addSlide({ sectionTitle });
    imgSlide.background = { path: image }; // image: url
  });
}

function generateBible(pptx, sectionTitle, data) {
  // add section
  pptx.addSection({ title: sectionTitle });

  const { bookName, chapter, verses } = data;

  // TODO: add bible cover slide when setting checked
  if (bibleSetting.isCoverSlide) {
    const bibleCoverSlide = pptx.addSlide({
      masterName: 'BIBLE_COVER_SLIDE',
      sectionTitle,
    });
    bibleCoverSlide
      .addText('교독문', {
        placeholder: 'bible-title',
        shadow: { ...shadowOptions },
      })
      .addShape(pptx.ShapeType.rect, {
        fill: { color: 'FFFFFF' },
        h: 0.07,
        w: 1.51,
        x: 5.91,
        y: 2.25,
      })
      .addText(`${title}`, { placeholder: 'bible-subtitle' });
  }

  // bible slide
  const sortedKeys = Object.keys(verses).sort((a, b) => a - b);
  for (const key of sortedKeys) {
    const bibleTitle = `${bookName} ${chapter}${bookName === '시편' ? '편' : '장'} ${key}절`;

    const bibleSlide = pptx.addSlide({
      masterName: 'BIBLE_SLIDE',
      sectionTitle,
    });
    bibleSlide
      // bible info
      .addText(
        [
          {
            text: bibleTitle,
            options: { ...bibleSetting.fullScreen.info },
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
              ...bibleSetting.fullScreen.info,
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
            options: { ...bibleSetting.fullScreen.verse },
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

function generateResponsiveReading(pptx, sectionTitle, data) {
  // add section
  pptx.addSection({ title: sectionTitle });

  const { title, contents } = data;

  // add rr cover slide
  if (rrSetting.isCoverSlide) {
    const rrCoverSlide = pptx.addSlide({
      masterName: 'RR_TITLE_SLIDE',
      sectionTitle,
    });
    rrCoverSlide
      .addText('교독문', {
        placeholder: 'rr-title',
        shadow: { ...shadowOptions },
      })
      .addShape(pptx.ShapeType.rect, {
        fill: { color: '#FFFFFF' },
        h: 0.07,
        w: 1.51,
        x: 5.91,
        y: 2.25,
      })
      .addText(`${title}`, { placeholder: 'rr-subtitle' });
  }

  // 교독문 두개씩 묶기
  const pairs = contents.reduce((result, current, index) => {
    if (index % 2 === 0) {
      if (index === contents.length - 1) {
        result.push([current]);
      } else {
        result.push([current, contents[index + 1]]);
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
              ...rrSetting.content,
              color: rrSetting.content.group2Color,
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
              ...rrSetting.content,
              color: rrSetting.content.group1Color,
            },
          },
          { text: '\n\n' },
          {
            text: pair[1],
            options: {
              ...rrSetting.content,
              color: rrSetting.content.group2Color,
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

export async function generatePPT({ setList, filename }) {
  // 1. Create a new Presentation
  const pptx = new PptxGenJS();
  pptx.author = 'suy';
  pptx.company = 'worship.uiyoung.com';
  pptx.title = 'Worship Presenter';
  pptx.layout = 'LAYOUT_WIDE';

  // 1-1. define slide masters
  const types = [...new Set(setList.map((item) => item.type))];
  defineSlideMastersInTypes(pptx, types);

  // 2. generate slides by type
  const generators = {
    lyrics: generateLyrics,
    'hymn-image': generateHymn,
    bible: generateBible,
    'responsive-reading': generateResponsiveReading,
  };

  setList.forEach(({ type, data }, idx) => {
    const sectionTitle = `${idx}_${data.title}`;
    generators[type]?.(pptx, sectionTitle, data);
  });

  pptx.writeFile({ fileName: `${filename}.pptx` });
}
