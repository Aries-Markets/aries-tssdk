import { getClient, UserProfile, Reserves } from "@aries-markets/api";
import { getAriesSDK } from "@aries-markets/aries-tssdk";
import { AptosClient } from "aptos";
import Big from "big.js";
import { getCoreSDK } from "./core";
import { ReservesWrapper } from "./reserve";

class AriesClient {
  client: AriesSDK;
  wallet: string;

  constructor(client: AriesSDK, wallet: string) {
    this.client = client;
    this.wallet = wallet;
  }

  profileCache: UserProfile | null = null;

  getProfiles = async (useCache = false) => {
    if (useCache && this.profileCache) {
      return this.profileCache;
    }

    this.profileCache = await this.client.api.profile.find.query({
      owner: this.wallet,
    });

    return this.profileCache;
  };

  initProfile = async () => {
    return this.client.sdk.controller
      .registerUser({ default_profile_name: "Main Account" })
      .makePayload();
  };

  addProfile = async (profileName: string) => {
    return this.client.sdk.controller
      .addSubaccount({ profile_name: profileName })
      .makePayload();
  };

  deposit = async (
    profileName: string,
    coinAddress: string,
    lamports: Big,
    repayOnly = false
  ) => {
    return this.client.sdk.controller
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

  withdraw = async (
    profileName: string,
    coinAddress: string,
    lamports: Big,
    allowBorrow = false
  ) => {
    return this.client.sdk.controller
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
}

export class AriesSDK {
  sdk: ReturnType<typeof getAriesSDK>;
  api: ReturnType<typeof getClient>;

  constructor(client: AptosClient) {
    this.sdk = getCoreSDK(client);
    this.api = getClient("https://api-v2.ariesmarkets.xyz");
  }

  getClient = (wallet: string) => new AriesClient(this, wallet);

  reservesCache: Reserves | null = null;

  getReserves = async (useCache = false) => {
    if (useCache && this.reservesCache) {
      return new ReservesWrapper(this.reservesCache);
    }

    this.reservesCache = await this.api.reserve.find.query({});

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
