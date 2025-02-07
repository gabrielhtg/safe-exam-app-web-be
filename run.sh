#!/bin/sh

npx prisma db push
npm run build
node dist/main.js