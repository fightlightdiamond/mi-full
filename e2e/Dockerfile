FROM node:alpine

WORKDIR /usr/src/app

COPY ./e2e .

RUN npm install -g pnpm

RUN pnpm install

CMD ["sh", "-c", "ls -la && pnpm test"]