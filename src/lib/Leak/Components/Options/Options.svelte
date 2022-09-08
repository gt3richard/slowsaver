<script>
    import Leak from "./Leak.svelte";

    export let options = [];
    export let type;
</script>

<div class="options col-12">
    <div class="d-flex flex-wrap">
        {#each options as { name, cost }, index}
        <Leak name={name} cost={cost} index={index} type={type} />
        {/each}
    </div>
</div>

<style>
    .options {
        padding:2em;
    }
</style>