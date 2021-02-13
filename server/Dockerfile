FROM node:10
#alpine slim
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
#  npm run start