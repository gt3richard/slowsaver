<script>    
    import Input from './Input.svelte';
    import Stage from './Components/Stage.svelte';
    import Bills from './Components/Bills/Bills.svelte';
    import Options from './Components/Options/Options.svelte';

    import { basicsLeak, subscriptionsLeak, habitsLeak } from '../stores';

    basicsLeak.set([
        { name: "Water", cost: 30 },
        { name: "Electricity", cost: 300 },
        { name: "Gas", cost: 20 },
        { name: "Mortgage", cost: 2000 },
        { name: "Internet", cost: 100 },
        { name: "Gardner", cost: 100 },
        { name: "Pool", cost: 150 },
        { name: "Cleaners", cost: 300 },
        { name: "Bug Sprayer", cost: 80 },
        { name: "Home Warrenty", cost: 50 },
    ]);

    let basicsOptions = [
        { name: "Water", cost: 30 },
        { name: "Electricity", cost: 300 },
        { name: "Gas", cost: 20 },
        { name: "Mortgage", cost: 2000 },
        { name: "Internet", cost: 100 },
        { name: "Gardner", cost: 100 },
        { name: "Pool", cost: 150 },
        { name: "Cleaners", cost: 300 },
        { name: "Bug Sprayer", cost: 80 },
        { name: "Home Warrenty", cost: 50 },
        { name: "Butler", cost: 1000 },
        { name: "HOA", cost: 80 },
        { name: "Boat", cost: 600 },
        { name: "Auto", cost: 900 },
    ];

    subscriptionsLeak.set([
        { name: "Netflix", cost: 16 },
        { name: "Spotify", cost: 15 },
        { name: "Disney +", cost: 5 },
        { name: "Hulu", cost: 17 },
    ]);

    let subscriptionsOptions = [
        { name: "Netflix", cost: 16 },
        { name: "Spotify", cost: 15 },
        { name: "Disney +", cost: 5 },
        { name: "Hulu", cost: 17 },
        { name: "Peacock", cost: 6 },
        { name: "Youtube", cost: 15 },
        { name: "Apple Music", cost: 10 },
        { name: "Apple TV", cost: 5 },
    ];

    habitsLeak.set([
        { name: "Starbucks", cost: 7 },
    ]);

    let habitsOptions = [
        { name: "Starbucks", cost: 7 },
        { name: "Gym", cost: 90 },
        { name: "Dinner", cost: 200 },
        { name: "Movies", cost: 39 },
    ];
</script>

<div class="container text-center">
    <h1 class="header">The Leak</h1>
    <h4 class="subheader secondary-color">Stop the bleeding and start saving</h4>
    <Input />
    <br><br>
    <div class="row">
        <Stage name={"Basics"} />
    </div>
    <div class="row">
        <Bills bills={$basicsLeak} />
        <hr class="dash">
        <Options options={basicsOptions.filter(f => !$basicsLeak.map(m => m.name).includes(f.name))} />
    </div>
    <div class="row">
        <Stage name={"Subscriptions"} />
    </div>
    <div class="row">
        <Bills bills={$subscriptionsLeak} />
        <hr class="dash">
        <Options options={subscriptionsOptions.filter(f => !$subscriptionsLeak.map(m => m.name).includes(f.name))} />
    </div>
    <div class="row">
        <Stage name={"Habits"} />
    </div>
    <div class="row">
        <Bills bills={$habitsLeak} />
        <hr class="dash">
        <Options options={habitsOptions.filter(f => !$habitsLeak.map(m => m.name).includes(f.name))} />
    </div>
</div>

<style>
    .header {
        font-weight: 700;
        padding-top: 1em;
    }
    .subheader {
        padding-bottom: 1em;
    }
    .dash {
        border-top: 3px dashed;
    }
</style>