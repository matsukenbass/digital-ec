import { setupServer } from 'msw/node';
import handlers from './__mocks__/handlers';

const setup = async () => {
  console.log('setup');
  //   const server = setupServer(...handlers);
  //   server.listen();
};

export default setup;
