<script>
    import { inputActive } from '../stores';

    import LoanInput from './LoanInput.svelte';
    import Progress from './Progress.svelte';

    export let loans;
    export let actions = null;
    export let readonly = false;

    export let type;
</script>

<div class="col-6 m-auto">
    {#each loans as { name, payment, amount, value}, index}
    <Progress type={type} index={index} amount={amount} value={actions && actions.length > 0 ? actions[index].value : value} isDebt={actions && actions.length > 0 && actions[index].action === "Payoff" ? false : true} name={name} payment={actions && actions.length > 0 ? actions[index].action : payment} />
    {/each}
    {#if !readonly}
        {#if $inputActive === type}
            <LoanInput type={type} />
        {:else}
        <div class="add mb-3" on:click={() => $inputActive = type}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
        </div>
        {/if}
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