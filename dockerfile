FROM node:16.14.2-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "bin/gitfolio.js", "run", "-p", "3000"]
