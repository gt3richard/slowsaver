<script>
    import Percentage from "./Percentage.svelte";

    export let accounts;
</script>

<div class="col-6 m-auto">
    {#each accounts as { name, percentage, amount}}
    <Percentage name={name} percentage={percentage} amount={amount || 0} />
    {/each}
</div>