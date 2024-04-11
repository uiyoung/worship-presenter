// get current date(yyyy-mm-dd)
function getCurrentDate() {
  const today = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today);
}

function divideTextByLines(text, linesPerSlide) {
  const lines = text
    .split('\n')
    .map((e) => e.replace(/[\s\u200B]+/g, ' ').trim()) // ZWSP공백 제거, 문자열 내의 연속된 공백을 하나의 공백으로 대체
    .filter((e) => e !== '');

  // linesPerSlide 만큼 묶어서 result에 담기
  let result = [];
  while (lines.length > 0) {
    result.push(lines.splice(0, linesPerSlide));
  }

  result = result.map((e) => e.join('\n')).join('\n\n');
  return result;
}
