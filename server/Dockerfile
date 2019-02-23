FROM node:current-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /opt/accownt/server

COPY ./server/package*.json ./
RUN npm install --no-optional && npm cache clean --force

COPY ./server ./

COPY ./types ../types

USER node

CMD ["npm", "run", "start"]