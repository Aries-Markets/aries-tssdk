import { AptosClient } from 'aptos';
import { AriesSDK } from '../src';

describe('Reserve Get', () => {
  it('Can fetch reserve', async () => {
    const client = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');
    const sdk = new AriesSDK(client);
    const reserves = await sdk.getReserves();
    console.log('🚀 ~ file: reserve.test.ts:9 ~ it ~ reserves', reserves);
  });
});
