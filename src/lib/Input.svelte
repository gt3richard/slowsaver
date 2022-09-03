<script>
    import { loanAmount, loanTerm, interestRate } from './stores';
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
</table>


<style>
table {
    margin: auto;
    padding: 1em;
}
</style>