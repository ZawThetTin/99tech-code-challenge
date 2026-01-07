import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { Price } from './types/prices';

const TOKEN_ICON_BASE_URL =
	'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

function App() {
	const [prices, setPrices] = useState<Price[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [inputAmount, setInputAmount] = useState<string>('');
	const [outputAmount, setOutputAmount] = useState<string>('');
	const [inputCurrency, setInputCurrency] = useState<string>('');
	const [outputCurrency, setOutputCurrency] = useState<string>('');
	const [isSwapping, setIsSwapping] = useState(false);
	const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set());

	const { uniqueCurrencies, latestPrices } = useMemo(() => {
		if (prices.length === 0) {
			return { uniqueCurrencies: [], latestPrices: new Map() };
		}

		const priceMap = new Map<string, Price>();

		prices.forEach(price => {
			const existing = priceMap.get(price.currency);
			if (!existing || new Date(price.date) > new Date(existing.date)) {
				priceMap.set(price.currency, price);
			}
		});

		const currencies = Array.from(priceMap.keys()).sort();

		const latestPricesMap = new Map(
			Array.from(priceMap.entries()).map(([currency, price]) => [
				currency,
				price.price,
			])
		);

		return { uniqueCurrencies: currencies, latestPrices: latestPricesMap };
	}, [prices]);

	useEffect(() => {
		if (
			!inputAmount ||
			!inputCurrency ||
			!outputCurrency ||
			isNaN(Number(inputAmount))
		) {
			setOutputAmount('');
			return;
		}

		const inputPrice = latestPrices.get(inputCurrency);
		const outputPrice = latestPrices.get(outputCurrency);

		if (!inputPrice || !outputPrice || outputPrice === 0) {
			setOutputAmount('');
			return;
		}

		const result = (Number(inputAmount) * inputPrice) / outputPrice;
		setOutputAmount(result.toString());
	}, [inputAmount, inputCurrency, outputCurrency, latestPrices]);

	useEffect(() => {
		if (uniqueCurrencies.length > 0 && !inputCurrency) {
			setInputCurrency(uniqueCurrencies[0]);
			setOutputCurrency(
				uniqueCurrencies.length > 1 ? uniqueCurrencies[1] : uniqueCurrencies[0]
			);
		}
	}, [uniqueCurrencies, inputCurrency]);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const response = await fetch(
					'https://interview.switcheo.com/prices.json'
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setPrices(data);
				setError(null);
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch prices');
				setPrices([]);
				setLoading(false);
			}
		})();
	}, []);

	const formatNumber = (num: string | number): string => {
		if (!num || num === '') return '0';

		const value = typeof num === 'string' ? parseFloat(num) : num;

		if (isNaN(value)) return '0';

		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 6,
		}).format(value);
	};

	const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value === '' || /^\d*\.?\d*$/.test(value)) {
			setInputAmount(value);
		}
	};

	const handleSwapCurrencies = () => {
		setInputCurrency(outputCurrency);
		setOutputCurrency(inputCurrency);
		setInputAmount(outputAmount);
	};

	const handleConfirmSwap = async () => {
		setIsSwapping(true);
		// Simulate API call with 2 seconds delay
		await new Promise(resolve => setTimeout(resolve, 2000));

		setIsSwapping(false);
	};

	const handleIconError = (currency: string) => {
		setFailedIcons(prev => new Set(prev).add(currency));
	};

	const getTokenIcon = (currency: string): string => {
		return `${TOKEN_ICON_BASE_URL}/${currency.toUpperCase()}.svg`;
	};

	const renderCurrencyIcon = (currency: string) => {
		if (failedIcons.has(currency)) {
			return (
				<div className='currency-icon-fallback'>
					{currency.charAt(0).toUpperCase()}
				</div>
			);
		}

		return (
			<img
				src={getTokenIcon(currency)}
				alt={`${currency} icon`}
				className='currency-icon'
				onError={() => handleIconError(currency)}
			/>
		);
	};

	if (loading) {
		return (
			<div className='swap-container'>
				<p className='loading-text'>Loading prices...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='swap-container'>
				<p style={{ color: 'red' }}>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className='swap-container'>
			<form onSubmit={e => e.preventDefault()}>
				<div className='swap-section'>
					<div className='currency-input-group input-currency-input-group'>
						<label htmlFor='input-amount'>Amount</label>
						<div className='input-row'>
							<div className='amount-section'>
								<input
									id='input-amount'
									type='text'
									placeholder='0'
									className='amount-input'
									value={inputAmount}
									onChange={handleInputAmountChange}
									autoFocus
								/>
							</div>
							<div
								className='currency-select-container'
								role='button'
								tabIndex={0}>
								{inputCurrency && (
									<div className='currency-display'>
										{renderCurrencyIcon(inputCurrency)}
										<span>{inputCurrency}</span>
									</div>
								)}{' '}
								<span className='dropdown-arrow'>▼</span>{' '}
								<select
									className='currency-select'
									value={inputCurrency}
									onChange={e => setInputCurrency(e.target.value)}>
									{uniqueCurrencies.map(currency => (
										<option key={currency} value={currency}>
											{currency}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					<div className='swap-icon'>
						<button
							type='button'
							className='swap-button'
							aria-label='Swap currencies'
							onClick={handleSwapCurrencies}>
							↓
						</button>
					</div>

					<div className='currency-input-group output-currency-input-group'>
						<label htmlFor='output-amount'>Converted to</label>
						<div className='input-row'>
							<div className='amount-section'>
								<input
									id='output-amount'
									type='text'
									placeholder='0'
									className='amount-input'
									value={formatNumber(outputAmount)}
									readOnly
								/>
							</div>
							<div
								className='currency-select-container'
								role='button'
								tabIndex={0}>
								{outputCurrency && (
									<div className='currency-display'>
										{renderCurrencyIcon(outputCurrency)}
										<span>{outputCurrency}</span>
									</div>
								)}
								<span className='dropdown-arrow'>▼</span>
								<select
									className='currency-select'
									value={outputCurrency}
									onChange={e => setOutputCurrency(e.target.value)}>
									{uniqueCurrencies.map(currency => (
										<option key={currency} value={currency}>
											{currency}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				<button
					type='submit'
					className='confirm-button'
					onClick={handleConfirmSwap}
					disabled={isSwapping}>
					{isSwapping ? 'Swapping...' : 'Swap'}
				</button>
			</form>
		</div>
	);
}

export default App;
