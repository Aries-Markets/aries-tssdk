import { getAriesSDK } from '@aries-markets/aries-tssdk';
import { AptosClient } from 'aptos';
import { createProvider } from './provider';

export const getCoreSDK = (client: AptosClient) => {
  const provider = createProvider(client);

  return getAriesSDK(provider);
};
