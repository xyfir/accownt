FROM node:current-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /opt/accownt/web

COPY ./web/package*.json ./
RUN npm install --no-optional && npm cache clean --force

COPY ./web ./

COPY ./types ../types

USER node

CMD ["npm", "run", "build"]