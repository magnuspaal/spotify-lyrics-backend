FROM node:16-alpine3.14

RUN apk update && apk add bash
RUN apk --no-cache add git

WORKDIR /app

COPY package.json /app/
COPY .env /app/.env

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 5000
CMD [ "node", "./dist/app.js" ]
