<script>
    export let options = [];
</script>

<div class="options col-12">
    <div class="d-flex flex-wrap">
        {#each options as { name, cost }}
        <div class="leak p-2 m-2">
            <span>{`+ $${cost} ${name}`}</span>
        </div>
        {/each}
    </div>
</div>

<style>
    .options {
        padding:2em;
    }
    .leak {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.87);
        border: 1px solid #555555;
        border-radius: 10px;
        background-color: #555555;
    }
    .leak:hover {
        color: #a09d9d;
        cursor: pointer;
    }
</style>