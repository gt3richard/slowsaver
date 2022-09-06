<script>    
    import Input from './Input.svelte';
    import Stage from './Stage.svelte';
    import Section from './Section.svelte';
    import Loans from './Loans.svelte';
    import Funds from './Funds.svelte';
    import Investments from './Investments.svelte';
    import Action from './Action.svelte';

    import { Content } from './localization';

    import { income, cash, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans, breakdown } from '../stores';

    income.set(80000);
    cash.set(65100);
    creditCards.set([
        { name: "Wells Fargo", payment: "125", amount: 500, value: 500 },
        { name: "Chase", payment: "Minimum", amount: 800, value: 800 }
    ]);

    personalLoans.set([
        { name: "Line of Credit", payment: "Minimum", amount: 3000, value: 100 },
    ]);

    autoLoans.set([
        { name: "Mercedes", payment: "Minimum", amount: 10000, value: 100 },
        { name: "Porsche", payment: "Minimum", amount: 30000, value: 100 },
    ]);

    studentLoans.set([
        { name: "University of School", payment: "Minimum", amount: 20000, value: 100 },
    ]);

    mortgageLoans.set([
        { name: "Home", payment: "Minimum", amount: 450000, value: 500000 },
    ]);

    function isActive(stage) {
        return $breakdown.activeStage >= stage;
    }

</script>

<div class="container text-center">
    <Input />
    <div class="row {isActive(1) ? "" : "dim"}">
        <Stage number={1} />
    </div>
    <div class="row {isActive(1) ? "" : "dim"}">
        <Section name={Content.EmergencyFund.name}/>
        <Funds account={Content.EmergencyFund} amount={$breakdown.emergencyFund} />
        <Action description={$breakdown.emergencyFundAction} />
    </div>
    <div class="row {isActive(1) ? "" : "dim"}">
        <Section name={Content.CreditCard.name}/>
        <Loans loans={$creditCards} actions={$breakdown.creditCard} readonly={!isActive(1)} type={"cc"} />
        <Action description={$breakdown.creditCardAction} />
    </div>
    <div class="row {isActive(2) ? "" : "dim"}">
        <Stage number={2} />
    </div>
    <div class="row {isActive(2) ? "" : "dim"}">
        <Section name={Content.Savings.name}/>
        <Funds account={Content.Savings} amount={$breakdown.savingsFund} />
        <Action description={$breakdown.savingsFundAction} />
    </div>
    <div class="row {isActive(2) ? "" : "dim"}">
        <Section name={Content.Retirement.name}/>
        <Investments accounts={Content.Retirement.Account} actions={$breakdown.retirementFund} />
        <Action description={$breakdown.retirementFundAction} />
    </div>
    <div class="row {isActive(3) ? "" : "dim"}">
        <Stage number={3} />
    </div>
    <div class="row {isActive(3) ? "" : "dim"}">
        <Section name={Content.PersonalLoan.name}/>
        <Loans loans={$personalLoans} actions={$breakdown.personalLoan} readonly={!isActive(3)} type={"pl"} />
        <Action description={$breakdown.personalLoanAction} />
    </div>
    <div class="row {isActive(3) ? "" : "dim"}">
        <Section name={Content.AutoLoan.name}/>
        <Loans loans={$autoLoans} actions={$breakdown.autoLoan} readonly={!isActive(3)} type={"al"}/>
        <Action description={$breakdown.autoLoanAction} />
    </div>
    <div class="row {isActive(3) ? "" : "dim"}">
        <Section name={Content.StudentLoan.name}/>
        <Loans loans={$studentLoans} actions={$breakdown.studentLoan} readonly={!isActive(3)} type={"sl"} />
        <Action description={$breakdown.studentLoanAction} />
    </div>
    <div class="row {isActive(4) ? "" : "dim"}">
        <Stage number={4} />
    </div>
    <div class="row {isActive(4) ? "" : "dim"}">
        <Section name={Content.Mortgage.name}/>
        <Loans loans={$mortgageLoans} actions={$breakdown.mortgageLoan} readonly={!isActive(4)} type={"ml"}  />
        <Action description={$breakdown.mortgageLoanAction} />
    </div>
    <div class="row {isActive(4) ? "" : "dim"}">
        <Section name={Content.Investment.name}/>
        <Investments accounts={Content.Investment.Account} actions={$breakdown.investment} />
        <Action description={$breakdown.investmentAction} />
    </div>
</div>

<style>
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