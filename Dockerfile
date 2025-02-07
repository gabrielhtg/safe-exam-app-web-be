FROM alpine:latest
LABEL authors="ta-12"

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install
RUN npx prisma db push
RUN nest build

EXPOSE 3000

CMD ["nest", "start:prod"]