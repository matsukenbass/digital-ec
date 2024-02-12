import { User } from '@/payload-types';
import { Access, CollectionConfig } from 'payload/types';
import cuid from 'cuid';

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
      ({ req, data, operation }) => {
        if (operation === 'create') {
          // addUser and original filename
          return {
            ...data,
            filename: cuid(), //S3に格納する時のID（CMSではfilename扱い）
            user: req.user?.id,
            originalFilename: req.files?.file.name,
          };
        }
      },
    ],
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
    {
      name: 'originalFilename',
      type: 'text',
      required: true,
      admin: {
        condition: () => false,
      },
    },
  ],
};
