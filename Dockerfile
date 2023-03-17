FROM node:16-alpine AS builder

ENV APP_ENV production

WORKDIR build

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

RUN apk --no-cache add curl && curl -sf https://gobinaries.com/tj/node-prune | sh && /usr/local/bin/node-prune

FROM node:16-alpine AS deploy

WORKDIR app

COPY --from=builder /build/dist/ .

COPY --from=builder /build/node_modules/ ./node_modules/

COPY .env .env.production ./

EXPOSE 3000

CMD [ "node", "main.js" ]
