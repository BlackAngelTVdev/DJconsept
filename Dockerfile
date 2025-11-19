# Dockerfile

FROM node:25-trixie

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .

RUN npm install

ARG PORT

EXPOSE $PORT

CMD [ "npm", "run", "dev"]