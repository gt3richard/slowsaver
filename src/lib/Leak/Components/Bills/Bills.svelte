<script>
    export let bills = [];
</script>

<div class="bills col-12 my-auto">
    <div class="d-flex flex-wrap">
        {#each bills as { name, cost }}
        <div class="leak p-2 m-2">
            <span>{`$${cost} ${name}`}</span>
        </div>
        {/each}
    </div>
</div>

<style>
    .bills {
        padding: 2em;
    }
    .leak {
        font-weight: 500;
        color: #242424;
        border: 1px solid rgba(255, 255, 255, 0.87);
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.87);
    }
    .leak:hover {
        color: #636161;
        cursor: pointer;
    }
</style>