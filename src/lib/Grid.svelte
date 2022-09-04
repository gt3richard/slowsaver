<script>

import { amortizationSchedule, interestRate } from './stores';

</script>


<table>
    <tr>
        <th>Month</th>
        <th>Cost</th>
        <th>Payment</th>
        <th>Outstanding Principal</th>
        <th>Outstanding Interest</th>
        <th>Principal</th>
        <th>Interest</th>
        <th>Extra Payment</th>
        <th>Reduced Principal</th>
        <th>Interest Saved</th>
        <th>Invested</th>
        <th>Savings</th>
        <th>Savings at Payoff</th>
        <th>Savings Profit</th>
        <th>Payoff Profit</th>
        <th>Diff</th>
    </tr>
    {#each $amortizationSchedule as {
        month,
        cost,
        payment,
        balance,
        interest,
        toPrincipal,
        toInterest,
        extra,
        reducedBalance,
        interestSaved,
        invested,
        savings,
        payoff,
        savingsProfit,
        payoffProfit,
        diff,
        }}
    <tr>
        <td>{month}</td>
        <td>{cost}</td>
        <td>{payment}</td>
        <td>{balance}</td>
        <td>{interest}</td>
        <td>{toPrincipal}</td>
        <td>{toInterest}</td>
        <td>{extra}</td>
        <td>{reducedBalance}</td>
        <td>{interestSaved}</td>
        <td>{invested}</td>
        <td>{savings}</td>
        <td>{payoff}</td>
        <td>{savingsProfit}</td>
        <td>{payoffProfit}</td>
        <td>{diff}</td>
    </tr>
    {/each}
</table>

<style>
table {
    border: solid 1px #DDEEEE;
    border-collapse: collapse;
    border-spacing: 0;
    font: normal 13px Arial, sans-serif;
    margin: auto;
}
th {
    background-color: #DDEFEF;
    border: solid 1px #DDEEEE;
    color: #336B6B;
    padding: 10px;
    text-align: left;
}
td {
    border: solid 1px #DDEEEE;
    color: #FFFFFF;
    padding: 10px;
}
</style>