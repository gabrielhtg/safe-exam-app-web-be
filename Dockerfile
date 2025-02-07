#FROM mariadb:latest
#LABEL authors="ta-12"
#
#RUN apt update -y
#RUN apt upgrade -y
#RUN apt install -y nodejs npm openssl
#
#WORKDIR /app
#
#COPY package.json ./
#
#COPY . .
#
#RUN npm install
#
#EXPOSE 3001
#EXPOSE 3306

FROM alpine:latest
LABEL authors="ta-12"

RUN apk update && apk upgrade
RUN apk add --no-cache nodejs npm openssl

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install

EXPOSE 3001

CMD ["./run.sh"]

# Create Net    : docker network create honestest_network
# Create DB     : docker run --name honestest-db -e MYSQL_ROOT_PASSWORD=ab5e651e-8f73-4b4c-b26f-c2624d707dd8 --network honestest_network -d -p 3307:3306 mariadb
# Build Command : docker build -t honestest-be .
# Run Command   :
