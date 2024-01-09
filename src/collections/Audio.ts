import { User } from '@/payload-types';
import { Access, CollectionConfig } from 'payload/types';
import * as iconv from 'iconv-lite';

const isAdminOrHasAccessToAudio =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;
    if (!user) return false;
    if (user.role === 'admin') return true;

    return {
      user: {
        equals: req.user.id,
      },
    };
  };

export const Audio: CollectionConfig = {
  slug: 'audio',
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // addUser
        return { ...data, user: req.user?.id };
      },
    ],
    // beforeOperation: [
    //   async ({ args, operation }) => {
    //     if (operation === 'create' || operation === 'update') {
    //       const files = args.req?.files;
    //       if (files && files.file && files.file.name) {
    //         const utf8Content = iconv.decode(files.file.name, 'utf-8');
    //         files.file.name = utf8Content;
    //       }
    //     }
    //   },
    // ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;
      if (!req.user || !referer?.includes('sell')) {
        return true;
      }
      return await isAdminOrHasAccessToAudio()({ req });
    },
    delete: isAdminOrHasAccessToAudio(),
    update: isAdminOrHasAccessToAudio(),
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['audio/mpeg', 'audio/opus', 'audio/wav'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
