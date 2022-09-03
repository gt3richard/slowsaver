<script>
    import { loanAmount, loanTerm, interestRate } from './stores';
</script>

<label>
    <span>Loan Amount:</span>
    <input bind:value={$loanAmount} >
</label>

<label>
    <span>Loan Term:</span>
    <input bind:value={$loanTerm}>
</label>

<label>
    <span>Interest Rate:</span>
    <input bind:value={$interestRate}>
</label>

<style>
	label { display: flex }
	input, p { margin: 6px }
</style>