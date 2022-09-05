<script>
    import { loanAmount, loanTerm, mortgageAPY, prePayment, monthlyPayment } from './stores';
</script>

<p>
    For a $<input type=number bind:value={$loanAmount} > mortgage 
    at <input type=number bind:value={$mortgageAPY}>% for <input type=number bind:value={$loanTerm}> months. 
    I want to add an additional payment of $<input type=number bind:value={$prePayment}> each 
    month for a total monthly payment of ${$monthlyPayment.toFixed(2)}
</p>

<style>
p {
    font-size: 1.5em;
    padding: 1.5em;
    margin: auto;
}
input {
    border: none;
    background: transparent;
    border-bottom: 1px solid #fff;
    outline: none;
    font-size: 1em;
    width:10%;
    text-align: center;
    font-weight: bold;
}
</style>