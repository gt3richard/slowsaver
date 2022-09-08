<script>
    import Leak from './Leak.svelte';

    export let bills = [];
    export let type;

</script>

<div class="bills col-12 my-auto">
    <div class="d-flex flex-wrap">
        {#each bills as { name, cost }, index}
            <Leak name={name} cost={cost} index={index} type={type} />
        {/each}
    </div>
</div>

<style>
    .bills {
        padding: 2em;
    }
    
</style>