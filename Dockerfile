FROM --platform=linux/x86_64 node:18-alpine as dependencies
WORKDIR /my-project
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile

ARG PAYLOAD_SECRET
ARG MONGODB_URL
ARG NEXT_PUBLIC_SERVER_URL
ARG RESEND_API_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG AWS_REGION
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG NEXT_PUBLIC_AWS_ACCESS_KEY
ARG NEXT_PUBLIC_AWS_SECRET
ARG AUDIO_BUCKET_NAME
ARG MEDIA_BUCKET_NAME
ARG PRODUCT_FILES_BUCKET_NAME
ARG DYNAMODB_TABLE

RUN touch .env
RUN echo "PAYLOAD_SECRET=$PAYLOAD_SECRET" >> .env
RUN echo "MONGODB_URL=$MONGODB_URL" >> .env
RUN echo "NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL" >> .env
RUN echo "RESEND_API_KEY=$RESEND_API_KEY" >> .env
RUN echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" >> .env
RUN echo "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET" >> .env
RUN echo "AWS_REGION=$AWS_REGION" >> .env
RUN echo "S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID" >> .env
RUN echo "S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY" >> .env
RUN echo "NEXT_PUBLIC_AWS_ACCESS_KEY=$NEXT_PUBLIC_AWS_ACCESS_KEY" >> .env
RUN echo "NEXT_PUBLIC_AWS_SECRET=$NEXT_PUBLIC_AWS_SECRET" >> .env
RUN echo "AUDIO_BUCKET_NAME=$AUDIO_BUCKET_NAME" >> .env
RUN echo "MEDIA_BUCKET_NAME=$MEDIA_BUCKET_NAME" >> .env
RUN echo "PRODUCT_FILES_BUCKET_NAME=$PRODUCT_FILES_BUCKET_NAME" >> .env
RUN echo "DYNAMODB_TABLE=$DYNAMODB_TABLE" >> .env
RUN cat .env



FROM --platform=linux/x86_64 node:18-alpine as builder
WORKDIR /my-project
COPY . .
COPY --chown=node:node --from=dependencies /my-project/.env ./.env
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
