<script>
    import { inputActive, creditCards, studentLoans, autoLoans, personalLoans, mortgageLoans } from '../stores';

    export let name = "";
    export let balance = null;
    export let type;

    function addLoan(type, name, balance) {
        let data = { name: name, payment: "Minimum", amount: balance, value: balance };
        let byAmount = (a, b) => a.amount - b.amount;
        if(type === "cc") {
            $creditCards.push(data);
            creditCards.set($creditCards.sort(byAmount));
        } else if (type === "pl") {
            $personalLoans.push(data);
            personalLoans.set($personalLoans.sort(byAmount));
        } else if (type === "al") {
            $autoLoans.push(data);
            autoLoans.set($autoLoans.sort(byAmount));
        } else if (type === "sl") {
            $studentLoans.push(data);
            studentLoans.set($studentLoans.sort(byAmount));
        } else if (type === "ml") {
            $mortgageLoans.push(data);
            mortgageLoans.set($mortgageLoans.sort(byAmount));
        }
        clearInput();
    }

    function clearInput() {
        name = "";
        balance = null;
        $inputActive = ""
    }
</script>

<div class="row m-auto mb-3">
    <div class="col p-2">
        <input bind:value={name} placeholder="name">
    </div>
    <div class="col p-2">
        <input type=number bind:value={balance} placeholder="balance">
    </div>
    <div class="col p-2">
        <button type="button" class="btn btn-success" on:click={() => addLoan(type, name, balance) }>Save</button>
        <button type="button" class="btn btn-secondary" on:click={() => clearInput()}>Close</button>
    </div>
</div>

<style>
    input {
        border: none;
        background-color: transparent;
        border-bottom: 1px solid white;
    }
</style>