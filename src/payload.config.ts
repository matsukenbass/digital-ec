import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { Users } from './collections/Users';
import dotenv from 'dotenv';
import { Products } from './collections/Products/Products';
import { Media } from './collections/Media';
import { ProductFiles } from './collections/ProductFiles';
import { Audio } from './collections/Audio';
import { Orders } from './collections/Orders';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [Users, Products, Media, ProductFiles, Orders, Audio],
  routes: {
    admin: '/sell',
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- makemoke',
      favicon: '/favicon.ico',
      ogImage: '/asset/logo.png',
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    // Pass the plugin to Payload
    cloudStorage({
      collections: {
        // Enable cloud storage for Media collection
        media: {
          // Create the S3 adapter
          adapter: s3Adapter({
            config: {
              // endpoint: process.env.S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
              },
              region: process.env.AWS_REGION,
            },
            bucket: process.env.MEDIA_BUCKET ?? '',
          }),
        },
        product_files: {
          // Create the S3 adapter
          adapter: s3Adapter({
            config: {
              // endpoint: process.env.S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
              },
              region: process.env.AWS_REGION,
            },
            bucket: process.env.PRODUCT_FILES_BUCKET ?? '',
          }),
        },
        audio: {
          // Create the S3 adapter
          adapter: s3Adapter({
            config: {
              // endpoint: process.env.S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
              },
              region: process.env.AWS_REGION,
            },
            bucket: process.env.AUDIO_BUCKET ?? '',
          }),
        },
      },
    }),
  ],
});
