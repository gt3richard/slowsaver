<script>
    import { profile } from '../stores';

</script>

<div class="row">
    <div class="col">
        <h2 class="input secondary-color">
            Starting with ${($profile.income / 12 * .5).toFixed(2)}
        </h2>
    </div>
</div>

<style>
    .input {
        padding: 1em;
    }
</style>