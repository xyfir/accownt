FROM node:latest

COPY ./server /accownt/server

COPY ./types /accownt/types

WORKDIR /accownt/server

RUN npm install \
  && npm run build

CMD ["npm", "run", "start"]