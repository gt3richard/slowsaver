<script>
    import { loanAmount, loanTerm, interestRate, extraPayment } from './stores';
</script>

<table>
    <tr>
        <td><span>Loan Amount:</span></td>
        <td><input bind:value={$loanAmount} ></td>
    </tr>
    <tr>
        <td><span>Loan Term:</span></td>
        <td><input bind:value={$loanTerm}></td>
    </tr>
    <tr>
        <td><span>Interest Rate:</span></td>
        <td><input bind:value={$interestRate}></td>
    </tr>
    <tr>
        <td><span>Extra Payment:</span></td>
        <td><input bind:value={$extraPayment}></td>
    </tr>
</table>


<style>
table {
    margin: auto;
    padding: 1em;
}
</style>