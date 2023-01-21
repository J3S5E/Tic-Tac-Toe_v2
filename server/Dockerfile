# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
ENV NODE_ENV=production
RUN --mount=type=secret,id=DATABASE_URL \
  database_url=$(cat /run/secrets/DATABASE_URL)
RUN --mount=type=secret,id=WEB_CLIENT_URL \
  webclient_url=$(cat /run/secrets/WEB_CLIENT_URL)
ENV DATABASE_URL=$database_url
ENV WEB_CLIENT_URL=$webclient_url
CMD ["npm", "run", "start"]