import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}`;

// env의 DB URL에서 schema를 못가져오는 이슈 때문에 직접 schema를 추출하여 adapter에 전달
// https://github.com/prisma/prisma/issues/28128
// TODO: 추후 prisma에서 공식적으로 지원하면 제거
const schema = new URL(connectionString).searchParams.get('schema');

const adapter = new PrismaPg(
  {
    connectionString,
  },
  {
    schema,
  }
);
const prisma = new PrismaClient({ adapter });

export { prisma };
