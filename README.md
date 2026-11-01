# Cartwise — Smart Shopping Budget Optimizer

**DAA Assignment 2 | 0/1 Knapsack using Branch and Bound**

Cartwise is a browser-based application that selects a combination of products with maximum total usefulness/priority value without exceeding a given budget.

## Features
- Set a shopping budget in Indian Rupees.
- Add, remove and clear products.
- Load a sample catalogue.
- Solve the 0/1 Knapsack problem using Branch and Bound.
- View selected products, total spend, remaining budget and total value.
- Visualize explored and pruned search-tree states.
- View the fractional-knapsack upper bound used for pruning.
- Responsive interface; no server, database or external JavaScript libraries required.

## Run in Visual Studio Code
1. Extract the ZIP file.
2. Open Visual Studio Code.
3. Select **File → Open Folder**.
4. Choose the extracted `smart-shopping-budget-optimizer` folder.
5. Open `index.html`.
6. Recommended: install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.
7. Or open `index.html` directly in a browser.

## GitHub upload and publish
1. Sign in at https://github.com/.
2. Click **New repository**.
3. Repository name: `smart-shopping-budget-optimizer`.
4. Choose **Public**, then click **Create repository**.
5. Click **Add file → Upload files**.
6. Upload the four files from this folder: `index.html`, `style.css`, `script.js`, and `README.md`. Upload the files themselves, not the ZIP.
7. Commit with message `Add Cartwise DAA project`.
8. Open **Settings → Pages**.
9. Under **Build and deployment**, choose **Deploy from a branch**.
10. Select branch `main` and folder `/(root)`, then click **Save**.
11. Wait for deployment. GitHub Pages will show the published website link.

The URL format is `https://YOUR-GITHUB-USERNAME.github.io/smart-shopping-budget-optimizer/`. Replace the placeholder with your actual GitHub username. The link works after GitHub Pages has deployed.

## Algorithm
This is the 0/1 Knapsack problem:
- Each product has a cost (weight) and a value (priority score).
- A product is either selected once or not selected.
- The total cost must not exceed the budget.
- The objective is to maximize the sum of product values.

### Branch and Bound method
1. Sort products by decreasing value-to-cost ratio.
2. At each node, decide whether to include or exclude the next product.
3. Calculate an optimistic upper bound by filling the remaining budget fractionally in ratio order.
4. If the current cost exceeds the budget, prune the node.
5. If the upper bound cannot exceed the best value found so far, prune the node.
6. Otherwise continue exploring.
7. Keep the feasible combination with the highest value.

The fractional item is used only to calculate an optimistic bound; actual product selection remains indivisible (0/1).

## Complexity analysis
Let `n` be the number of products.
- Sorting: O(n log n).
- Bound calculation: O(n) per visited node in this straightforward implementation.
- Worst-case time: O(2^n) search, plus sorting and bound calculations; a conservative bound for this implementation is O(n·2^n).
- Recursive search space: O(n) stack depth, excluding the stored execution trace.
- The trace can store O(2^n) node records in the worst case.

## Test cases
| Test | Budget | Input | Expected result |
|---|---:|---|---|
| 1 | ₹5000 | Default sample catalogue | Feasible basket with maximum value; spend ≤ ₹5000 |
| 2 | ₹1 | Default sample catalogue | No product selected; value 0 |
| 3 | ₹5000 | One product: cost ₹500, value 10 | Select that product |
| 4 | ₹500 | Two products: A cost ₹500 value 10; B cost ₹501 value 20 | Select A only |
| 5 | ₹500 | No products | Show validation message |
| 6 | 0 | Any products | Ask for a budget greater than zero |

## Report checklist
Include:
- Problem statement and objectives
- 0/1 Knapsack model and Branch and Bound explanation
- Pseudocode and upper-bound explanation
- GUI screenshots
- Test cases and actual outputs
- Time and space complexity
- Conclusion and future improvements

Add your name, class, roll number and college details to your report before submission.
