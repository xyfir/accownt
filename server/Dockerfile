FROM node:latest

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /accownt/server

COPY ./server/package*.json ./

RUN npm install

COPY ./server ./

COPY ./types ../types

CMD ["npm", "run", "start"]