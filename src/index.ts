import { getAriesSDK } from '@aries-markets/aries-tssdk';
import { getClient, UserProfile, Reserves } from '@aries-markets/api';
import { AptosClient } from 'aptos';
import Big from 'big.js';
import { getCoreSDK } from './core';
import { ReservesWrapper } from './reserve';

export class AriesSDK {
  private sdk: ReturnType<typeof getAriesSDK>;
  private api: ReturnType<typeof getClient>;

  constructor(client: AptosClient) {
    this.sdk = getCoreSDK(client);
    this.api = getClient('https://api-v2.ariesmarkets.xyz');
  }

  getClient = (wallet: string) => {
    let profileCache: UserProfile | null = null;

    const getProfiles = async (useCache = false) => {
      if (useCache && profileCache) {
        return profileCache;
      }

      profileCache = await this.api.profile.find.query({
        owner: wallet,
      });

      return profileCache;
    };

    const initProfile = async () => {
      return this.sdk.controller
        .registerUser({ default_profile_name: 'Main Account' })
        .makePayload();
    };

    const addProfile = async (profileName: string) => {
      return this.sdk.controller
        .addSubaccount({ profile_name: profileName })
        .makePayload();
    };

    const deposit = async (
      profileName: string,
      coinAddress: string,
      lamports: Big,
      repayOnly = false
    ) => {
      return this.sdk.controller
        .deposit(
          {
            profile_name: profileName,
            amount: lamports,
            repay_only: repayOnly,
          },
          { Coin0: coinAddress }
        )
        .makePayload();
    };

    const withdraw = async (
      profileName: string,
      coinAddress: string,
      lamports: Big,
      allowBorrow = false
    ) => {
      return this.sdk.controller
        .withdraw(
          {
            profile_name: profileName,
            amount: lamports,
            allow_borrow: allowBorrow,
          },
          { Coin0: coinAddress }
        )
        .makePayload();
    };

    return {
      deposit,
      withdraw,
      getProfiles,
      initProfile,
      addProfile,
    };
  };

  reservesCache: Reserves | null = null;

  getReserves = async (useCache = false) => {
    if (useCache && this.reservesCache) {
      return new ReservesWrapper(this.reservesCache);
    }

    this.reservesCache = await this.api.reserve.current.query();

    return new ReservesWrapper(this.reservesCache);
  };

  getUnhealthyProfiles = async () => {
    return this.api.profile.currentUnhealthy.query();
  };

  liquidateProfile = async (
    account: string,
    profileName: string,
    repayCoinAddr: string,
    withdrawCoinAddr: string,
    lamports: Big
  ) => {
    return this.sdk.controller.liquidateAndRedeem(
      {
        liquidatee_addr: account,
        liquidatee_profile_name: profileName,
        amount: lamports,
      },
      { RepayCoin: repayCoinAddr, WithdrawCoin: withdrawCoinAddr }
    );
  };
}
