import { useMemo } from 'react';
import { useWalletBalances } from '../hooks/useWalletBalances'; // Sample import paths
import { usePrices } from '../hooks/usePrices'; // Sample import paths
import WalletRow from '../components/WalletRow'; // Sample import paths

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
	id: string;
	currency: string;
	amount: number;
	blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
	formatted: string;
}

const PRIORITY_MAP: Record<Blockchain, number> = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
};

export default function WalletPage() {
	const balances = useWalletBalances();
	const prices = usePrices();

	const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
		return balances
			.filter(
				(balance: WalletBalance) =>
					PRIORITY_MAP[balance.blockchain] !== undefined && balance.amount > 0
			)
			.sort(
				(a: WalletBalance, b: WalletBalance) =>
					PRIORITY_MAP[b.blockchain] - PRIORITY_MAP[a.blockchain]
			)
			.map((balance: WalletBalance) => ({
				...balance,
				formatted: balance.amount.toFixed(2),
			}));
	}, [balances]);

	return (
		<div>
			{formattedBalances.map((balance: FormattedWalletBalance) => {
				const price = prices[balance.currency] ?? 0;
				const usdValue = price * balance.amount;

				return (
					<WalletRow
						key={balance.id}
						amount={balance.amount}
						usdValue={usdValue}
						formattedAmount={balance.formatted}
					/>
				);
			})}
		</div>
	);
}
