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
    fontSize: 36,
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

  // todo : defineSlideMaster 정리 : 위로 빼기
  selectedList.forEach((item, idx) => {
    const sectionTitle = `${idx}_${item.title}`;

    switch (item.type) {
      case 'lyrics':
        // sections by item
        pptx.addSection({ title: sectionTitle });

        // title slide master
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
                  fontSize: 24,
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
                  valign: lyricsOptions.valing,
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

        // rr title slide master
        pptx.defineSlideMaster({
          title: 'RR_TITLE_SLIDE',
          background: { path: './rr-background.jpg' },
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

        // todo : rr content slide master

        // add rr title slide
        const rrSlide = pptx.addSlide({ masterName: 'RR_TITLE_SLIDE' });
        rrSlide.background = { path: '/backgrounds/rr-background.jpg' }; // image: url
        rrSlide
          .addText('교독문', {
            placeholder: 'rr-title',
            shadow: shadowOptions,
          })
          .addShape(pptx.ShapeType.rect, { fill: { color: 'FFFFFF' }, h: 0.07, w: 1.51, x: 5.91, y: 2.25 })
          .addText(`${item.title}`, { placeholder: 'rr-subtitle' });

        // todo : add rr content slide
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
