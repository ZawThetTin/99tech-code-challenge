import { useState, useEffect } from 'react';
import './App.css';
import type { Price } from './types/prices';

function App() {
	const [prices, setPrices] = useState<Price[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPrices = async () => {
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
				console.log(data);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch prices');
				setPrices([]);
			} finally {
				setLoading(false);
			}
		};

		fetchPrices();
	}, []);

	return (
		<>
			<div className='swap-container'>
				<form onSubmit={e => e.preventDefault()}>
					<div className='swap-section'>
						<div className='currency-input-group'>
							<label htmlFor='input-amount'>Amount</label>
							<div className='input-row'>
								<div className='amount-section'>
									<input
										id='input-amount'
										type='text'
										placeholder='0'
										className='amount-input'
									/>
									<span className='converted-value'>$34,408.24</span>
								</div>
								<select className='currency-select'>
									<option value='USD'>🇺🇸 USD</option>
									<option value='EUR'>🇪🇺 EUR</option>
									<option value='GBP'>🇬🇧 GBP</option>
								</select>
							</div>
						</div>

						<div className='swap-icon'>
							<button
								type='button'
								className='swap-button'
								aria-label='Swap currencies'>
								↓
							</button>
						</div>

						<div className='currency-input-group'>
							<label htmlFor='output-amount'>Converted to</label>
							<div className='input-row'>
								<div className='amount-section'>
									<input
										id='output-amount'
										type='text'
										placeholder='0'
										className='amount-input'
										readOnly
									/>
									<span className='converted-value'>kr393,492.63</span>
								</div>
								<select className='currency-select'>
									<option value='NOK'>🇳🇴 NOK</option>
									<option value='USD'>🇺🇸 USD</option>
									<option value='EUR'>🇪🇺 EUR</option>
								</select>
							</div>
						</div>
					</div>

					<button type='submit' className='confirm-button'>
						Swap
					</button>
				</form>
			</div>
		</>
	);
}

export default App;
