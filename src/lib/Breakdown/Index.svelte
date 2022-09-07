<script>    
    import Input from './Input.svelte';
    import Stage from './Components/Stage.svelte';
    import Section from './Components/Section.svelte';
    import Loans from './Components/Loans/Loans.svelte';
    import Funds from './Components/Funds/Funds.svelte';
    import Investments from './Components/Investments/Investments.svelte';
    import Action from './Components/Action.svelte';

    import { Content } from './localization';

    import { creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans, breakdown } from '../stores';
</script>

<div class="container text-center">
    <h1 class="header">The Breakdown</h1>
    <h4 class="subheader secondary-color">It'll take time but it'll be worth it</h4>
    <Input />
    <br><br>
    <div class="row {$breakdown.activeStage >= 1 ? "" : "dim"}">
        <Stage number={1} />
    </div>
    <div class="row {$breakdown.activeStage >= 1 ? "" : "dim"}">
        <Section data={Content.EmergencyFund}/>
        <Funds account={Content.EmergencyFund} amount={$breakdown.emergencyFund} />
        <Action description={$breakdown.emergencyFundAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 1 ? "" : "dim"}">
        <Section data={Content.CreditCard}/>
        <Loans loans={$creditCards} actions={$breakdown.creditCard} readonly={!($breakdown.activeStage >= 1)} type={"cc"} />
        <Action description={$breakdown.creditCardAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 2 ? "" : "dim"}">
        <Stage number={2} />
    </div>
    <div class="row {$breakdown.activeStage >= 2 ? "" : "dim"}">
        <Section data={Content.Savings}/>
        <Funds account={Content.Savings} amount={$breakdown.savingsFund} />
        <Action description={$breakdown.savingsFundAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 2 ? "" : "dim"}">
        <Section data={Content.Retirement}/>
        <Investments accounts={Content.Retirement.Account} actions={$breakdown.retirementFund} />
        <Action description={$breakdown.retirementFundAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 3 ? "" : "dim"}">
        <Stage number={3} />
    </div>
    <div class="row {$breakdown.activeStage >= 3 ? "" : "dim"}">
        <Section data={Content.PersonalLoan}/>
        <Loans loans={$personalLoans} actions={$breakdown.personalLoan} readonly={!($breakdown.activeStage >= 3)} type={"pl"} />
        <Action description={$breakdown.personalLoanAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 3 ? "" : "dim"}">
        <Section data={Content.AutoLoan}/>
        <Loans loans={$autoLoans} actions={$breakdown.autoLoan} readonly={!($breakdown.activeStage >= 3)} type={"al"}/>
        <Action description={$breakdown.autoLoanAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 3 ? "" : "dim"}">
        <Section data={Content.StudentLoan}/>
        <Loans loans={$studentLoans} actions={$breakdown.studentLoan} readonly={!($breakdown.activeStage >= 3)} type={"sl"} />
        <Action description={$breakdown.studentLoanAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 4 ? "" : "dim"}">
        <Stage number={4} />
    </div>
    <div class="row {$breakdown.activeStage >= 4 ? "" : "dim"}">
        <Section data={Content.Mortgage}/>
        <Loans loans={$mortgageLoans} actions={$breakdown.mortgageLoan} readonly={!($breakdown.activeStage >= 4)} type={"ml"}  />
        <Action description={$breakdown.mortgageLoanAction} />
    </div>
    <div class="row {$breakdown.activeStage >= 4 ? "" : "dim"}">
        <Section data={Content.Investment}/>
        <Investments accounts={Content.Investment.Account} actions={$breakdown.investment} />
        <Action description={$breakdown.investmentAction} />
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
    .dim {
        display: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: .4;
        z-index: 2;
    }
</style>