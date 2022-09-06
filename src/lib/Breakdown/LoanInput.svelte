<script>
    import { inputActive } from '../stores';

    export let name = "";
    export let amount = null;
</script>

<div class="row m-auto mb-3">
    <div class="col p-2">
        <input bind:value={name} placeholder="name">
    </div>
    <div class="col p-2">
        <input type=number bind:value={amount} placeholder="balance">
    </div>
    <div class="col p-2">
        <button type="button" class="btn btn-success" on:click={() => $inputActive = ""}>Save</button>
        <button type="button" class="btn btn-secondary" on:click={() => $inputActive = ""}>Close</button>
    </div>
</div>

<style>
    input {
        border: none;
        background-color: transparent;
        border-bottom: 1px solid white;
    }
</style>