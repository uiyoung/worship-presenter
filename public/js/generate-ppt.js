// PPT 생성
const generateBtn = document.querySelector('#generate-btn');
generateBtn.addEventListener('click', (e) => {
  if (selectedList.length <= 0) {
    alert('아이템을 먼저 선택해 주세요.');
    return;
  }

  // add loading spinner to button
  const originalBtnText = e.target.innerHTML;
  e.target.innerHTML = '';
  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm mx-2';
  spinner.role = 'status';
  spinner.ariaHidden = true;
  e.target.appendChild(spinner);
  e.target.innerHTML += 'PPT 생성 중... ';
  e.target.disabled = true;

  // 1. Create a new Presentation
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  const CM_1 = 28.346; // 1cm = 28.346pt
  const shadowOptions = { type: 'outer', angle: 45, blur: 3, color: '000000', offset: 3, opacity: 0.57 };

  const lyricsOptions = {
    fontFace: '다음_SemiBold',
    // const fontFace = '나눔스퀘어라운드 Bold';
    //const fontFace = '나눔고딕 Bold';
    fontSize: 48,
    fontBold: false,
    fontItalic: false,
    fontUnderline: false,
    fontColor: 'FFFFFF',
    fontOutline: { size: 1.0, color: '000000' },
    fontGlow: { size: 2, opacity: 1.0, color: '#000000' },
    align: 'center', // align(left, center, right, justify)
    valign: 'bottom', // vertical align(top, middle, bottom)
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

  // song title slide master
  pptx.defineSlideMaster({
    title: 'LYRICS_TITLE_SLIDE',
    background: {
      color: '009933',
    },
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
  });

  // lyrics slide master
  pptx.defineSlideMaster({
    title: 'LYRICS_SLIDE',
    background: {
      color: '009933',
    },
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
  });

  // rr title slide master
  pptx.defineSlideMaster({
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
  });

  // rr content slide master
  pptx.defineSlideMaster({
    title: 'RR_CONTENT_SLIDE',
    background: { path: '/backgrounds/rr-background.jpg' },
    objects: [{ rect: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 } } }],
  });

  // todo : defineSlideMaster 정리 : 위로 빼기
  selectedList.forEach((item, idx) => {
    const sectionTitle = `${idx}_${item.title}`;
    console.log(sectionTitle);

    switch (item.type) {
      case 'lyrics':
        // sections by item
        pptx.addSection({ title: sectionTitle });

        // add title slide
        const slide = pptx.addSlide({ masterName: 'LYRICS_TITLE_SLIDE', sectionTitle });
        slide.addText(item.title, { placeholder: 'song-title' });

        const lyricsPerSlideArr = item.lyrics.split('\n\n');

        // Add Lyrics Slide
        lyricsPerSlideArr.forEach((lyrics) => {
          const slide = pptx.addSlide({ masterName: 'LYRICS_SLIDE', sectionTitle });

          // Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
          slide.addText(lyrics, { placeholder: 'lyrics-body' });
        });
        break;

      case 'responsive-reading':
        // sections by item
        pptx.addSection({ title: sectionTitle });

        // add rr title slide
        const rrSlide = pptx.addSlide({ masterName: 'RR_TITLE_SLIDE', sectionTitle });
        rrSlide
          .addText('교독문', {
            placeholder: 'rr-title',
            shadow: shadowOptions,
          })
          .addShape(pptx.ShapeType.rect, { fill: { color: 'FFFFFF' }, h: 0.07, w: 1.51, x: 5.91, y: 2.25 })
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
          const rrContentSlide = pptx.addSlide({ masterName: 'RR_CONTENT_SLIDE', sectionTitle });

          if (pair.length == 1) {
            console.log(`group2: ${pair[0]}`);
            rrContentSlide.addText(
              [
                {
                  text: pair[0],
                  options: { ...rrContentOptions, color: rrContentColors.group2 },
                },
              ],
              { x: 0, y: 0, w: '100%', h: '100%', align: 'left', valign: 'top', margin: [30, 30, 100, 100] }
            );
          } else {
            console.log(`group 1: ${pair[0]}, group 2: ${pair[1]}`);
            rrContentSlide.addText(
              [
                {
                  text: pair[0],
                  options: { ...rrContentOptions, color: rrContentColors.group1 },
                },
                { text: '\n\n' },
                {
                  text: pair[1],
                  options: { ...rrContentOptions, color: rrContentColors.group2 },
                },
              ],
              { x: 0, y: 0, w: '100%', h: '100%', align: 'left', valign: 'top', margin: [30, 30, 100, 100] }
            );
          }
        });

        // todo : add rr content slide
        // console.log(item.contents);
        // for (let i = 0; i < item.contents.length; i++) {
        //   if (i % 2 === 1 || item.contents[i].startsWith('(다같이)')) {
        //     console.log('group2 :', item.contents[i]);
        //   } else {
        //     console.log('group1 :', item.contents[i]);
        //   }
        // }

        break;
      default:
        break;
    }

    // console.log(item);
  });

  // 4. Save the Presentation
  const worshipName = prompt('워십의 이름을 적어주세요.');
  if (!worshipName) {
    generateBtn.innerHTML = originalBtnText;
    generateBtn.disabled = false;
    return;
  }

  pptx.writeFile({ fileName: `${worshipName}.pptx` }).then((fileName) => {
    console.log(`created file: ${fileName}`);
    generateBtn.innerHTML = originalBtnText;
    generateBtn.disabled = false;
  });
});
