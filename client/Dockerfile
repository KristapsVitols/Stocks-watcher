FROM node:14.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD npm run serve