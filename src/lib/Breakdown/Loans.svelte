<script>
    import Progress from './Progress.svelte';

    export let loans;
    export let actions = null;
</script>

<div class="col-6 m-auto">
    {#each loans as { name, payment, amount, value}, index}
    <Progress amount={amount} value={actions && actions.length > 0 ? actions[index].value : value} isDebt={actions && actions.length > 0 && actions[index].action === "Payoff" ? false : true} name={name} payment={actions && actions.length > 0 ? actions[index].action : payment} />
    {/each}
</div>

<style>
    .bi {
        margin-bottom: 2em;
    }
</style>