FROM node:14.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

COPY . .

CMD /wait && npm run dev