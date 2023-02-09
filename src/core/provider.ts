import { AptosProvider } from '@aries-markets/create-sdk';
import { AptosClient } from 'aptos';
import { argToString } from './serializer';

const GAP_UNIT = 100;
const MAX_GAS_AMOUNT = 100000;
export const MAX_GAS_PER_TX = GAP_UNIT * MAX_GAS_AMOUNT;

export const createProvider = (client: AptosClient) => {
  const processData = (item: any) => item;
  const getResource: AptosProvider['getResource'] = async ({
    program,
    module,
    address,
    resourceType,
  }) => {
    const res = await client.getAccountResource(
      address,
      `${program}::${module}::${resourceType}`
    );

    return processData(res.data) as Record<string, unknown>;
  };

  type GetGenericRes = AptosProvider['getGenericResources'];
  const getGenericResources: GetGenericRes = async ({
    module,
    address,
    genericResourceType,
  }) => {
    const res = await client.getAccountResources(address);
    // type: 0x1::AptosAccount::Coin
    return processData(
      res
        .filter(resource =>
          resource.type.includes(`${module}::${genericResourceType}`)
        )
        .map(v => ({ ...v.data, resourceType: v.type }))
    );
  };

  type GetResByType = AptosProvider['getGenericResourceByType'];
  const getResourceByType: GetResByType = async ({
    program,
    module,
    address,
    genericResourceType,
    typeArgs,
  }) => {
    const res = await client.getAccountResource(
      address,
      `${program}::${module}::${genericResourceType}<${typeArgs.join(', ')}>`
    );
    return processData(res.data) as Record<string, unknown>;
  };

  const makePayload: AptosProvider['makePayload'] = ({
    program,
    module,
    args,
    typeArgs,
    functionName,
  }) => {
    const payload = {
      type: 'entry_function_payload',
      function: `${program}::${module}::${functionName}`,
      type_arguments: typeArgs,
      arguments: args.map(({ value, moveType }) =>
        argToString(value, moveType)
      ),
    };

    return payload;
  };

  const sendTx: AptosProvider['sendTx'] = async () => {
    throw new Error('Unsupported');
  };

  const simulateTx: AptosProvider['simulateTx'] = async () => {
    throw new Error('Unsupported');
  };

  const provider: AptosProvider = {
    getGenericResourceByType: getResourceByType,
    getResource,
    getGenericResources,
    sendTx,
    simulateTx,
    makePayload,
    getWalletAddress: () => {
      throw new Error('Unsupported');
    },
    client,
  };

  return provider;
};
