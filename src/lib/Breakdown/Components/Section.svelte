<script>
    export let data;
</script>

<div class="section col-4 my-auto">
    <h3>{data.name}</h3>
    <p class="tertiary-color">{data.description}</p>
</div>

<style>
    .section {
        padding: 2em;
    }
    p {
        padding-top: 1em;
    }
</style>