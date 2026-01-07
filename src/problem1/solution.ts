const sum_to_n_a = (n: number): number => {
	/**
	 * Straight forward and easier solution to loop from 1 to n and sum the values.
	 * Probably the first algorithm that comes to mind.
	 * Time Complexity: O(n)
	 * Space Complexity: O(1)
	 */

	let sum = 0;

	for (let i = 1; i <= n; i++) {
		sum += i;
	}

	return sum;
};

const sum_to_n_b = (n: number): number => {
	/**
	 * A different approach using the recursive method
	 * Time Complexity: O(n)
	 * Space Complexity: O(n) due to call stack
	 * Just a different approach. Not recommended for large n due to potential stack overflow
	 */

	if (n === 1) return 1;

	return n + sum_to_n_b(n - 1);
};

/**
 * Optimized solution using the mathematical formula
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * If we write down how we get the formula:
 *   We need to sum from 1 to n
 *   1 + 2 + 3 + ... + n
 *   If we think the sum in reverse:
 *   n + (n-1) + (n-2) + ... + 1
 *   If we merge both equations: (first item of first equation + first item of second equation), and so on:
 *   (1 + n) + (2 + (n-1)) + (3 + (n-2)) + ... + (n + 1)
 *   Each parenthesis equals to (n + 1) because (2 + (n-1)) = (n + 1), (3 + (n-2)) = (n + 1), and so on.
 *   There will be nth times of (n + 1) in total
 *   But since we added the sum twice, we need to divide it by 2
 *   Therefore, the final formula is: n * (n + 1) / 2
 *   That way, the computer only needs to do 3 operations regardless of the size of n
 */
const sum_to_n_c = (n: number): number => (n * (n + 1)) / 2;

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));
