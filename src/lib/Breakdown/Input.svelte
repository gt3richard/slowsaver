<script>
    import { profile } from '../stores';

</script>

<div class="row">
    <div class="col">
        <h4 class="input">
            Annual Income $<input type=number bind:value={$profile.income} placeholder="0">
        </h4>
        <h4 class="input">
            Total Cash $<input type=number bind:value={$profile.cash} placeholder="0">
        </h4>
    </div>
</div>

<style>
    .input {
        padding: 1em;
    }
    input {
        border: none;
        background-color: transparent;
        border-bottom: 1px solid white;
        padding-left: 1em;
    }
</style>