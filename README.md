# Worship Presenter

https://worship.uiyoung.com

create ppt for worship and manage setlists

![Picture1](https://github.com/uiyoung/worship-presenter/assets/8945807/b76e6a5a-dc46-4bf5-961a-c1630f0c794b)
![Picture2](https://github.com/uiyoung/worship-presenter/assets/8945807/8dc4c5ae-9f71-430f-8969-e445b3918113)

## Features

- CCM 가사 관리(생성, 조회, 수정, 삭제)
- 원하는 자막 줄수에 맞게 변환
- 찬송가 악보 이미지 또는 가사 선택
- 성경 조회 및 선택
- 교독문 조회 및 선택
- 선택된 자료 목록을 PPT로 다운로드

## How to Run

1. set `.env`
   ```
   DATABASE_URL=postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
   COOKIE_SECRET=""
   ```
2. run

   ```bash
   # install libraries
   npm i

   # run
   npm start
   ```

## environments

- Node.js 20
- Express
- Nunjucks
- [PostgreSQL](https://www.postgresql.org)
- [Prisma](https://www.prisma.io)
- [PptxGenJs](https://github.com/gitbrent/PptxGenJS)

## todo

- [trello](https://trello.com/b/7oiX5itL/todo)

## Copyright Information

- <a href="https://www.flaticon.com/free-icons/hymns" title="hymns icons">Hymns icons created by Flat Icons - Flaticon</a>
