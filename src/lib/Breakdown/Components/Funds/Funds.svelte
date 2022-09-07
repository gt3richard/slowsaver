<script>
    import { profile } from '../../../stores';

    import Progress from './Progress.svelte';

    export let account;
    export let amount = 0;
</script>

<div class="col-6 m-auto">
    <Progress amount={account.amount || account.percentage * $profile.income || 10000 } value={amount}/>
</div>