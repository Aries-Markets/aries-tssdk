# Aries Market Typescript SDK

[![Discord][discord-image]][discord-url]
[Aries Market](https://docs.ariesmarkets.xyz/aries-markets/)

# Quickstart

To start using aries sdk, run below command in your project directory:

```bash
yarn add @aries-markets/tssdk
```

# Core Data Struct

```ts
/**
 * Model ReserveDetails
 */
export type ReserveDetails = {
  initial_exchange_rate: number;
  reserve_amount: number;
  total_borrowed: number;
  total_borrowed_share: number;
  total_cash_available: number;
  total_lp_supply: number;
  reserve_config: ReserveConfig;
  interest_rate_config: InterestRateConfig;
};
/**
 * Model ReserveConfig
 */
export type ReserveConfig = {
  loan_to_value: number;
  liquidation_threshold: number;
  liquidation_bonus_bips: number;
  liquidation_fee_hundredth_bips: number;
  borrow_factor: number;
  reserve_ratio: number;
  borrow_fee_hundredth_bips: number;
  withdraw_fee_hundredth_bips: number;
  deposit_limit: number;
  borrow_limit: number;
  allow_collateral: boolean;
  allow_redeem: boolean;
  flash_loan_fee_hundredth_bips: number;
};
/**
 * Model InterestRateConfig
 */
export type InterestRateConfig = {
  min_borrow_rate: number;
  optimal_borrow_rate: number;
  max_borrow_rate: number;
  optimal_utilization: number;
};
```

# SDK usage

See [Sample code](./test/base.test.ts)
