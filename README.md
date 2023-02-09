# Aries Markets TypeScript SDK

[![Discord][discord-image]][discord-url]
[![Twitter][twitter-image]][twitter-url]

### [Official Platform Docs](https://docs.ariesmarkets.xyz/aries-markets/)

# Quickstart

To start using aries sdk, run below command in your project directory:

```bash
yarn add @aries-markets/tssdk
```

# SDK usage

See [Sample code](./test/base.test.ts)

# SDK struct

```ts
/**
 * Model ReserveDetails
 */
type ReserveDetails = {
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
type ReserveConfig = {
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
type InterestRateConfig = {
  min_borrow_rate: number;
  optimal_borrow_rate: number;
  max_borrow_rate: number;
  optimal_utilization: number;
};
/**
 * Model Profile
 */
type Profile = {
  id: string;
  meta: ResourceSnapshotId;
  profile_address: string;
  borrowed_reserves: ProfilesBorrows[];
  deposited_reserves: ProfilesDeposits[];
};
```

# Move struct

## Reserve

```move
struct ReserveDetails has store, copy, drop {
  /// Total number of LP tokens minted.
  total_lp_supply: u128,

  /// Total cash available. This should always be the same as `value(underlying_coin)`.
  total_cash_available: u128,

  /// The initial exchange rate between LP tokens and underlying assets.
  initial_exchange_rate: Decimal,

  /// Reserve amount.
  reserve_amount: Decimal,

  /// The normalized value for total borrowed share.
  total_borrowed_share: Decimal,

  /// Total amount of outstanding debt.
  total_borrowed: Decimal,

  /// The timestamp second that the interest get accrue last time.
  interest_accrue_timestamp: u64,

  /// Reserve related configuration.
  reserve_config: ReserveConfig,

  /// Interest rate configuration.
  interest_rate_config: InterestRateConfig,
}

struct ReserveConfig has store, drop, copy {
    /// Loan to value ratio.
    loan_to_value: u8,

    /// Liquidation threshold.
    liquidation_threshold: u8,

    /// The bonus basis point that the liquidator get.
    liquidation_bonus_bips: u64,

    /// The percentage of liquidation bonus will go to the protocol as fee.
    liquidation_fee_hundredth_bips: u64,

    /// The ratio of loan asset value to risk-adjusted liability value in liquidation.
    borrow_factor: u8,

    /// The percentage of the interest that needs to be reserved
    reserve_ratio: u8,

    /// Borrow fee percentage with the unit of 1/100th of basis point (10^-6).
    borrow_fee_hundredth_bips: u64,

    /// A withdrawal fee is taken when a liquidity provider withdraws funds from the pool (redeem LP tokens).

    /// The ratio has a unit of millionth (10^-6).
    withdraw_fee_hundredth_bips: u64,

    // 0 represents no limit
    deposit_limit: u64,

    // 0 represents no limit
    borrow_limit: u64,

    // Whether to accept it as collateral to increase the bororwing power.
    allow_collateral: bool,

    /// Whether to allow the redeem from LP tokens to underlying tokens.
    /// This will be necessary in some extreme condition when we want to freeze
    /// withdrawal.
    allow_redeem: bool,

    /// Borrow fee percentage for flash loans with the unit of 1/100th of basis point (10^-6).
    /// It should be paid in addition to close the flash loan, so it is not limited to 100%
    flash_loan_fee_hundredth_bips: u64,
}

struct InterestRateConfig has store, drop, copy {
    min_borrow_rate: u64,
    optimal_borrow_rate: u64,
    max_borrow_rate: u64,
    optimal_utilization: u64
}


```

## Profile

```move
struct Profile has key {
    /// All reserves that the user has deposited into.
    deposited_reserves: IterableTable<TypeInfo, Deposit>,
    /// All reserves that the user has deposited into that has deposit farming
    deposit_farms: IterableTable<TypeInfo, ProfileFarm>,
    /// All reserves that the user has borrowed from.
    borrowed_reserves: IterableTable<TypeInfo, Loan>,
    /// All reserves that the user has borrowed from that has borrow farming
    borrow_farms: IterableTable<TypeInfo, ProfileFarm>,
}

struct Deposit has store, drop {
    /// The amount of LP tokens that is stored as collateral.
    collateral_amount: u64
}

struct Loan has store, drop {
    /// Normalized borrow share amount.
    borrowed_share: Decimal
}
```

[twitter-url]: https://twitter.com/AriesMarkets
[twitter-image]: https://img.shields.io/twitter/url?label=Aries%20Markets%20Twitter&style=social&url=https%3A%2F%2Ftwitter.com%2FAriesMarkets
[discord-image]: https://img.shields.io/discord/1000012426479153172?label=Discord&logo=discord&style=flat~~~~
[discord-url]: https://discord.com/invite/ariesmarkets
