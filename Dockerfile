FROM node:20.19.2

WORKDIR /app

COPY package*.json ./
COPY . .

RUN rm -rf node_modules
RUN npm install -g @nestjs/cli
RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]