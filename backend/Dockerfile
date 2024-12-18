FROM node:20-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3005
CMD [ "npm", "run", "start" ]