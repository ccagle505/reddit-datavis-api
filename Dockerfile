# node version
FROM node:16
# app dir
WORKDIR /usr/src/app
#include dependencies
COPY package*.json ./
# NOTE: For production code, RUN npm ci --only=production
RUN npm install
#Bundle
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]
