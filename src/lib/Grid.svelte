<script>

import { monthlyPayment, outstandingBalance } from './stores';

</script>


<table>
    <tr>
        <th>Month</th>
        <th>Payment</th>
        <th>Outstanding Balance</th>
    </tr>
    {#each $outstandingBalance as {month, balance}}
    <tr>
        <td>{month + 1}</td>
        <td>{$monthlyPayment.toLocaleString("en-US")}</td>
        <td>{balance.toLocaleString("en-US")}</td>
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