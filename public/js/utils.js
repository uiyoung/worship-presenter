// get current date(yyyy-mm-dd)
export function getCurrentDate() {
  const today = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today);
}

export function formatDateTime(datetime) {
  return new Intl.DateTimeFormat('ko', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(datetime));
}

export function cleanText(text) {
  return text
    .trim()
    .split('\n')
    .map((line) => line.replace(/\n+/g, '\n\n')) // 2개 초과의 \n -> \n\n
    .map((line) => line.replace(/[\s\u200B]+/g, ' ').trim()) // 공백 및 제로 폭 공백(ZWSP)을 정규화하고 양 끝의 공백 제거
    .reduce((acc, cur) => (cur !== '' || (acc.length > 0 && acc[acc.length - 1] !== '') ? acc.concat(cur) : acc), []) // 연속으로 있는 ''요소를 한개로
    .join('\n');
}

export function divideTextByLines(text, linesPerSlide) {
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
