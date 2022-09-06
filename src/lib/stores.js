import { writable, derived } from 'svelte/store';

import { Content } from './Breakdown/localization';


import { calculateMonthlySchedule } from './Amortization/service';
import { calculateMonthlyPayments } from './Amortization/calculations';

export const income = writable();
export const cash = writable();

export const loanAmount = writable(0);
export const loanTerm = writable(0);
export const mortgageAPY = writable(0);
export const prePayment = writable(0);
export const savingsAPY = writable(0);

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, mortgageAPY, prePayment, savingsAPY],
    ([$loanAmount, $loanTerm, $mortgageAPY, $prePayment, $savingsAPY]) =>
        calculateMonthlySchedule($loanAmount, $loanTerm, $mortgageAPY/100, $prePayment, $savingsAPY)
);

export const monthlyPayment = derived(
    [loanAmount, loanTerm, mortgageAPY, prePayment],
    ([$loanAmount, $loanTerm, $mortgageAPY, $prePayment]) =>
        calculateMonthlyPayments($loanAmount, $mortgageAPY/100, $loanTerm) + $prePayment
);

export const creditCards = writable([]);
export const personalLoans = writable([]);
export const autoLoans = writable([]);
export const studentLoans = writable([]);
export const mortgageLoans = writable([]);

function calculateBreakdown(income, cash, creditCards) {
    let funds = cash;
    let monthlyFunds = 0;
    let activeStage = 1;
    let emergencyFund = 0;
    let emergencyFundAction = "";
    let savingsFund = 0;
    let savingsFundAction = "";
    let creditCardAction = [];

    // Emergency Funds
    if(funds - Content.EmergencyFund.amount > 0) {
        emergencyFund = Content.EmergencyFund.amount;
        funds = funds - Content.EmergencyFund.amount;
        emergencyFundAction = `Put $${emergencyFund} into a regular savings account.`;
    } else {
        emergencyFund = funds;
        funds = 0;
        emergencyFundAction = `Put $${emergencyFund} into a regular savings account.`;
    }

    let snowballCard = true;
    for(let i = 0; i < creditCards.length; i++) {
        if(funds - creditCards[i].amount > 0) {
            funds = funds - creditCards[i].amount;
            creditCardAction.push({ action: "Payoff", value: creditCards[i].amount })
        } else {
            if(snowballCard) {
                creditCardAction.push({ action: "500", value: 500 });
                snowballCard = false;
            } else {
                creditCardAction.push({ action: "Minimum", value: creditCards[i].amount * .1 })
            }
        }
    }

    if(funds + monthlyFunds > 0) {
        activeStage = 2;
    }

    // Savings Fund
    if(funds - (Content.Savings.percentage * income) > 0) {
        savingsFund = Content.Savings.percentage * income;
        funds = funds - (Content.Savings.percentage * income);
        savingsFundAction = `Put $${savingsFund} into a high yield savings account.`;
    } else {
        savingsFund = funds;
        funds = 0;
        savingsFundAction = `Put $${savingsFund} into a high yield savings account.`;
    }

    return { 
        activeStage,
        emergencyFund,
        emergencyFundAction,
        savingsFund,
        savingsFundAction,
        creditCardAction
    };
}

export const breakdown = derived(
    [income, cash, creditCards],
    ([$income, $cash, $creditCards]) => calculateBreakdown($income, $cash, $creditCards)
);