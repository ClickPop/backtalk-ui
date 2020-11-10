FROM node:14.11.0
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
EXPOSE 3000
CMD ["yarn", "start"]