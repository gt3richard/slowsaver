<script>
    import { basicsLeak, subscriptionsLeak, habitsLeak } from '../../../stores';

    export let name;
    export let cost;
    export let index;
    export let type;

    function addLeak() {
        if(type === 'bas') {
            $basicsLeak.push({ name, cost});
            basicsLeak.set($basicsLeak);
        } else if (type === 'sub') {
            $subscriptionsLeak.push({ name, cost});
            subscriptionsLeak.set($subscriptionsLeak);
        } else if (type === 'hab') {
            $habitsLeak.push({ name, cost});
            habitsLeak.set($habitsLeak);
        }
    }

</script>

<div class="leak p-2 m-2" on:click={addLeak}>
    <span class="px-2">{`+ $${cost} ${name}`}</span>
</div>

<style>
    .leak {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        min-height:50px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.87);
        border: 1px solid #555555;
        border-radius: 10px;
        background-color: #555555;
    }
    .leak:hover {
        color: white;
        cursor: pointer;
    }
</style>