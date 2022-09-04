<script>

import { amortizationSchedule, interestRate } from './stores';

</script>


<table>
    <tr>
        <th colspan="6">Baseline</th>
        <th colspan="3" class="pp">Pre Payment</th>
    </tr>
    <tr>
        <th>Month</th>
        <th>Cost</th>
        <th>Payment</th>
        <th>Interest</th>
        <th>Principal</th>
        <th>Balance</th>
        <th class="pp">Interest</th>
        <th class="pp">Principal</th>
        <th class="pp">Balance</th>
        
        <!-- <th>Early Payoff Profit</th> -->
        <!-- <th>Invested</th> -->
        <!-- <th>Savings</th> -->
        <!-- <th>Savings at Payoff</th> -->
        <!-- <th>Savings Profit</th> -->
        <!-- <th>Diff</th> -->
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
        <td>{toInterest}</td>
        <td>{toPrincipal}</td>
        <td>{balance}</td>
        <!-- <td>{interest}</td> -->
        <td class="pp">{interestSaved}</td>
        <td class="pp">{extra}</td>
        <td class="pp">{reducedBalance}</td>
        
        <!-- <td>{payoffProfit}</td> -->
        <!-- <td>{invested}</td> -->
        <!-- <td>{savings}</td> -->
        <!-- <td>{payoff}</td> -->
        <!-- <td>{savingsProfit}</td> -->
        <!-- <td>{diff}</td> -->
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
th.pp {
    background-color: #e9c89d;
    border: solid 1px #e9c89d;
}
td.pp {
    background-color: #523815;
}
</style>