FROM --platform=linux/x86_64 node:18-alpine as dependencies
WORKDIR /my-project
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM --platform=linux/x86_64 node:18-alpine as builder
WORKDIR /my-project
COPY . .
COPY --chown=node:node --from=dependencies /my-project/node_modules ./node_modules
RUN yarn build

FROM --platform=linux/x86_64 node:18-alpine as runner
WORKDIR /my-project
ENV NODE_ENV production
COPY --chown=node:node --from=builder /my-project/public ./public
COPY --chown=node:node --from=builder /my-project/.next ./.next
COPY --chown=node:node --from=builder /my-project/dist ./dist
COPY --chown=node:node --from=builder /my-project/build ./build
COPY --chown=node:node --from=builder /my-project/node_modules ./node_modules
COPY --chown=node:node --from=builder /my-project/package.json ./package.json
COPY --chown=node:node --from=builder /my-project/next.config.js ./next.config.js

EXPOSE 3000
CMD ["yarn", "start"]