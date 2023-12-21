import { User } from '@/payload-types';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { Access, CollectionConfig } from 'payload/types';
const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};
const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  const { docs: products } = await req.payload.find({
    collection: 'products',
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  const ownProductFileIds = products.map((prod) => prod.product_files).flat();

  const { docs: orders } = await req.payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === 'string') return req.payload.logger.error('');
        return typeof product.product_files === 'string'
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();
  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};
export const ProductFiles: CollectionConfig = {
  slug: 'product_files',
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin',
  },
  upload: {
    staticURL: '/product_files', //保存先をS3(Wasabi)に変更する(https://github.com/jeanbmar/payload-s3-upload)
    staticDir: 'product_files',
    mimeTypes: ['image/*', 'font/*', 'application/postscript'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
