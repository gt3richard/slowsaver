<script>

import { amortizationSchedule, interestRate } from './stores';

</script>


<table>
    <tr>
        <th colspan="6">Baseline</th>
        <th colspan="5" class="pp">Pre Payment</th>
        <th colspan="2" class="hy">High Yield</th>
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
        <th class="pp">Savings</th>
        <th class="pp">Profit</th>

        <th class="hy">Savings</th>
        <th class="hy">Profit</th>
    </tr>
    {#each $amortizationSchedule as {
        month,
        cost,
        payment,
        interest,
        principal,
        balance,
        ppCost,
        ppInterest,
        ppPrincipal,
        ppBalance,
        ppSavings,
        ppProfit,
        hySavings,
        hyProfit,
        }}
    <tr>
        <td>{month}</td>
        <td>{cost}</td>
        <td>{payment}</td>
        <td>{interest}</td>
        <td>{principal}</td>
        <td>{balance}</td>
        <!-- <td>{interest}</td> -->
        <td class="pp">{ppInterest}</td>
        <td class="pp">{ppPrincipal}</td>
        <td class="pp">{ppBalance}</td>
        <td class="pp">{ppSavings}</td>
        <td class="pp">{ppProfit}</td>

        <td class="hy">{hySavings}</td>
        <td class="hy">{hyProfit}</td>
        
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
th.hy {
    background-color: #b8e99d;
    border: solid 1px #b8e99d;
}
td.hy {
    background-color: #1f5215;
}
</style>