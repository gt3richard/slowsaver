<script>
    import { loanAmount, loanTerm, mortgageAPY, prePayment } from './stores';
</script>

<table>
    <tr>
        <td><span>Loan Amount:</span></td>
        <td><input type=number bind:value={$loanAmount} ></td>
    </tr>
    <tr>
        <td><span>Loan Term:</span></td>
        <td><input type=number bind:value={$loanTerm}></td>
    </tr>
    <tr>
        <td><span>Interest Rate:</span></td>
        <td><input type=number bind:value={$mortgageAPY}></td>
    </tr>
    <tr>
        <td><span>Pre Payment:</span></td>
        <td><input type=number bind:value={$prePayment}></td>
    </tr>
</table>


<style>
table {
    margin: auto;
    padding: 1em;
}
</style>