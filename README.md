# Worship Presenter
https://worship.uiyoung.cf

create ppt for worship and manage setlists

## Features

- CCM 가사 관리(생성, 조회, 수정, 삭제)
- 원하는 자막 줄수에 맞게 변환
- 찬송가 악보 이미지 또는 가사 선택
- 성경 조회 및 선택
- 교독문 조회 및 선택
- 선택한 자료를 PPT로 다운로드

## How to Run

1. `$ touch .env`
2. set `.env` values

- ```
  DATABASE_URL="DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
  COOKIE_SECRET=""
  ```

3. `$ npm i`
4. `$ npm start`

## environments

- Node.js 20
- Express
- Nunjucks
- [PostgreSQL](https://www.postgresql.org)
- [Prisma](https://www.prisma.io)
- [PptxGenJs](https://github.com/gitbrent/PptxGenJS)

## todo

- [trello](https://trello.com/b/7oiX5itL/todo)
