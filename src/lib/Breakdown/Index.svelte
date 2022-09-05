<script>
    import { income, cash } from '../stores';
    
    import Stage from './Stage.svelte';
    import Section from './Section.svelte';
    import Progress from './Progress.svelte';
    import Percentage from './Percentage.svelte';

    import { Content } from './localization';
</script>

<div class="container text-center">
    <div class="row">
        <h4 class="input">
            Annual Income $<input type=number bind:value={$income} placeholder="0">
        </h4>
        <h4 class="input">
            Total Cash $<input type=number bind:value={$cash} placeholder="0">
        </h4>
    </div>
    <Stage number={1} />
    <div class="row">
        <Section name={Content.EmergencyFund.name}/>
        <div class="col-6 m-auto">
            <Progress amount={Content.EmergencyFund.amount} value={600}/>
        </div>
    </div>
    <div class="row">
        <Section name={Content.CreditCard.name}/>
        <div class="col-6 m-auto">
            <Progress amount={100} value={60} isDebt={true} name={"Wells Fargo"} payment={"125"} />
            <Progress amount={100} value={40} isDebt={true} name={"Chase"} payment={"Minimum"} />
        </div>
    </div>
    <Stage number={2} />
    <div class="row">
        <Section name={Content.Savings.name}/>
        <div class="col-6 m-auto">
            <Progress amount={1000} value={600} />
        </div>
    </div>
    <div class="row">
        <Section name={Content.Retirement.name}/>
        <div class="col-6 m-auto">
            <Percentage name={Content.Retirement.percentage * 100 + "% of Annual Income"} amount={200} />
        </div>      
    </div>
    <Stage number={3} />
    <div class="row">
        <Section name={Content.PersonalLoan.name}/>
        <div class="col-6 m-auto">
            <Progress amount={100} value={60} isDebt={true} name={"Line of Credit"} payment={"Minimum"} />
        </div>
    </div>
    <div class="row">
        <Section name={Content.AutoLoan.name}/>
        <div class="col-6 m-auto">
            <Progress amount={100} value={60} isDebt={true} name={"Mercedes"} payment={"Minimum"} />
            <Progress amount={100} value={40} isDebt={true} name={"Porsche"} payment={"Minimum"} />
        </div>
    </div>
    <div class="row">
        <Section name={Content.StudentLoan.name}/>
        <div class="col-6 m-auto">
            <Progress amount={100} value={100} isDebt={true} name={"University of School"} payment={"Minimum"} />
        </div>
    </div>
    <Stage number={4} />
    <div class="row">
        <Section name={Content.Mortgage.name}/>
        <div class="col-6 m-auto">
            <Progress amount={100} value={100} isDebt={true} name={"Home"} payment={"Minimum"} />
        </div>
    </div>
    <div class="row">
        <Section name={Content.Investment.name}/>
        <div class="col-6 m-auto">
            <Percentage name={"Growth"} percentage={.4} amount={400} />
            <Percentage name={"Aggressive Growth"} percentage={.2} amount={200} />
            <Percentage name={"Small Cap"} percentage={.2} amount={200} />
            <Percentage name={"International"} percentage={.2} amount={200} />
        </div>
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