<script>
    import Percentage from "./Percentage.svelte";

    export let accounts;
    export let actions = null;
</script>

<div class="col-12 col-md-6 m-auto">
    {#each accounts as { name, description, percentage, amount}, index}
    <Percentage name={name} description={description} percentage={percentage} amount={actions && actions.length > 0 ? actions[index].value : amount || 0} />
    {/each}
</div>