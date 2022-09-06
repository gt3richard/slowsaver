<script>
    import Progress from './Progress.svelte';

    export let loans;
    export let actions = null;
    export let readonly = false;
</script>

<div class="col-6 m-auto">
    {#each loans as { name, payment, amount, value}, index}
    <Progress amount={amount} value={actions && actions.length > 0 ? actions[index].value : value} isDebt={actions && actions.length > 0 && actions[index].action === "Payoff" ? false : true} name={name} payment={actions && actions.length > 0 ? actions[index].action : payment} />
    {/each}
    {#if !readonly}
    <div class="add">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
    </div>
    {/if}
</div>

<style>
    .bi {
        margin-bottom: 2em;
    }
    .add {
        background-color: #313131;
        height: 1em;
        margin: 1em 2em;
    }
    .add:hover {
        background-color: #464545;
    }
</style>