import { AptosClient } from 'aptos';
import { isPlainObject } from 'lodash-es';
import { AriesSDK } from '../src';

describe('Base usage', () => {
  const client = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');
  const sdk = new AriesSDK(client);

  it('Can fetch reserve', async () => {
    const reservesWrapper = await sdk.getReserves();
    expect(reservesWrapper.getList().length).toBeGreaterThan(0);

    const reserveList = reservesWrapper.getList();

    const coinAddress = reserveList[0].coinAddress;

    // Get reserve on-chain data and config by coin address
    expect(reservesWrapper.getReserve(coinAddress)).toBeDefined();
    expect(reservesWrapper.getInterestConfig(coinAddress)).toBeDefined();
    expect(reservesWrapper.getReserveConfig(coinAddress)).toBeDefined();

    // Get reserve status by coin address
    expect(reservesWrapper.getTotalAsset(coinAddress)).toBeGreaterThanOrEqual(
      0
    );
    expect(reservesWrapper.getBorrowed(coinAddress)).toBeGreaterThanOrEqual(0);
    expect(reservesWrapper.getBorrowApy(coinAddress)).toBeGreaterThanOrEqual(0);
    expect(reservesWrapper.getDepositApy(coinAddress)).toBeGreaterThanOrEqual(
      0
    );
  });

  it('Can get profile status and make action payload', async () => {
    const someUserWallet =
      '0xb332d62c312ddd0d1f9b326c55b6f13b84280e3d9fbb4a95c862f86049439c3f';

    const ariesClient = sdk.getClient(someUserWallet);

    const profiles = await ariesClient.getProfiles();

    expect(profiles.total_equity).toBeGreaterThanOrEqual(0);
    expect(isPlainObject(profiles.profiles)).toBe(true);

    const initProfilePayload = ariesClient.initProfile();
    expect(initProfilePayload).toStrictEqual({
      type: 'entry_function_payload',
      function: '0x1::controller::register_user',
      type_arguments: [],
      arguments: ['Main Account'],
    });

    const addProfilePayload = ariesClient.addProfile('<Your new profile name>');
    expect(addProfilePayload).toStrictEqual({
      type: 'entry_function_payload',
      function: '0x1::controller::add_subaccount',
      type_arguments: [],
      arguments: ['<Your new profile name>'],
    });

    const aptosCoin = '0x1::aptos_coin::AptosCoin';
    const mockProfileName = '<Your new profile name>';
    const depositPayload = ariesClient.deposit(
      mockProfileName,
      aptosCoin,
      '1000000000',
      true
    );

    expect(depositPayload).toStrictEqual({
      type: 'entry_function_payload',
      function: '0x1::controller::deposit',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: ['<Your new profile name>', '1000000000', true],
    });

    const withdrawPayload = ariesClient.withdraw(
      mockProfileName,
      aptosCoin,
      '1000000000',
      true
    );

    expect(withdrawPayload).toStrictEqual({
      type: 'entry_function_payload',
      function: '0x1::controller::withdraw',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: ['<Your new profile name>', '1000000000', true],
    });
  });

  it('Can fetch unhealthy profile and make payload', async () => {
    const unhealthyProfiles = await sdk.getUnhealthyProfiles();
    expect(unhealthyProfiles.length).toBeGreaterThanOrEqual(0);

    const liquidatePayload = await sdk.liquidateProfile(
      '<mock_account>',
      '<mock_profile>',
      '0x1::aptos_coin::AptosCoin',
      '0x1::aptos_coin::AptosCoin',
      '10000'
    );
    expect(liquidatePayload).toStrictEqual({
      type: 'entry_function_payload',
      function: '0x1::controller::liquidate_and_redeem',
      type_arguments: [
        '0x1::aptos_coin::AptosCoin',
        '0x1::aptos_coin::AptosCoin',
      ],
      arguments: ['<mock_account>', '<mock_profile>', '10000'],
    });
  });
});
