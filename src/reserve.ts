import { Reserves } from '@aries-markets/api';

export class ReservesWrapper {
  rawReserves: Reserves;

  constructor(rawReserves: Reserves) {
    this.rawReserves = rawReserves;
  }

  getList = () => {
    return this.rawReserves.stats.map(stat => ({
      coinAddress: stat.key,
      ...stat.value,
    }));
  };

  getReserve = (coinAddress: string) => {
    return this.rawReserves.stats.find(stat => stat.key === coinAddress)?.value;
  };

  getConfigByCoinAddress = (coinAddress: string) => {
    return this.getReserve(coinAddress)?.reserve_config;
  };

  getTotalAsset = (coinAddress: string) => {
    const reserve = this.getReserve(coinAddress);
    if (!reserve) return 0;

    const { total_borrowed, total_cash_available } = reserve;

    return total_borrowed + total_cash_available;
  };

  getBorrowApy = (coinAddress: string) => {
    const reserve = this.getReserve(coinAddress);
    if (!reserve) return 0;

    const {
      total_borrowed,
      interest_rate_config: {
        optimal_borrow_rate,
        optimal_utilization: optimal_utilization_pct,
        max_borrow_rate,
        min_borrow_rate,
      },
    } = reserve;
    const total_asset = this.getTotalAsset(coinAddress);

    const utilization = total_asset === 0 ? 0 : total_borrowed / total_asset;
    const optimal_utilization = Number(optimal_utilization_pct) / 100;

    if (utilization <= optimal_utilization) {
      const factor =
        optimal_utilization === 0 ? 0 : utilization / optimal_utilization;
      const borrow_rate_diff = optimal_borrow_rate - min_borrow_rate;

      return (
        (factor * Number(borrow_rate_diff) + Number(min_borrow_rate)) / 100
      );
    } else {
      const factor =
        (utilization - optimal_utilization) / (1 - optimal_utilization);

      const borrow_rate_diff = max_borrow_rate - optimal_borrow_rate;

      return (
        (factor * Number(borrow_rate_diff) + Number(optimal_borrow_rate)) / 100
      );
    }
  };

  getDepositApy = (coinAddress: string) => {
    const reserve = this.getReserve(coinAddress);
    if (!reserve) return 0;

    const { total_borrowed } = reserve;
    const total_asset = this.getTotalAsset(coinAddress);

    const utilization = total_asset === 0 ? 0 : total_borrowed / total_asset;
    const borrowApy = this.getBorrowApy(coinAddress);
    return borrowApy * utilization;
  };
}
