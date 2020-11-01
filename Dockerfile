FROM node:14.11.0
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
RUN yarn install
CMD ["yarn", "start"]