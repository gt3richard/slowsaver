<script>
    export let data;
    export let paycheck;
</script>

<div class="section col-12 col-md-4 my-auto">
    <h3>-{data.name}</h3>
    <p class="tertiary-color">{data.description}</p>

    <h3 class="secondary-color">${paycheck.toLocaleString()}</h3>
</div>

<style>
    .section {
        padding: 2em;
    }
    p {
        padding-top: 1em;
    }
</style>