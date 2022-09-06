<script>
    export let name;
    export let percentage = 0;
    export let amount;
</script>

<div class="row my-3">
    <div class="col-6 my-auto"><h4>{name}</h4></div>
    {#if percentage}
    <div class="col-3 my-auto"><h4>{percentage * 100}%</h4></div>
    {/if}
    <div class="col-3"><h4>$<span class="amount">{amount.toLocaleString()}</span></h4><span class="secondary-color">per month</span></div>
</div>

<style>
    .amount {
        padding-left: .5em;
        padding-right: 1em;
        border-bottom: 1px solid white;
    }
    h4 {
        font-size: 1.2em;
    }
</style>