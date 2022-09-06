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

function calculateBreakdown(income, cash, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans) {
    let funds = cash;
    let monthlyFunds = 0;
    let activeStage = 1;
    let snowballing = true;

    //// STAGE 1
    let emergencyFund = 0;
    let emergencyFundAction = "";
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

    // Credit Card
    for(let i = 0; i < creditCards.length; i++) {
        if(funds - creditCards[i].amount > 0) {
            funds = funds - creditCards[i].amount;
            creditCardAction.push({ action: "Payoff", value: creditCards[i].amount })
        } else {
            if(snowballing) {
                creditCardAction.push({ action: "500", value: 500 });
                snowballing = false;
            } else {
                creditCardAction.push({ action: "Minimum", value: creditCards[i].amount * .1 })
            }
        }
    }

    //// STAGE 2
    let savingsFund = 0;
    let savingsFundAction = "";

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


    //// STAGE 3
    let personalLoanAction = [];
    let autoLoanAction = [];
    let studentLoanAction = [];

    if(funds + monthlyFunds > 0) {
        activeStage = 3;
    }

    // Personal Loan
    for(let i = 0; i < personalLoans.length; i++) {
        if(funds - personalLoans[i].amount > 0) {
            funds = funds - personalLoans[i].amount;
            personalLoanAction.push({ action: "Payoff", value: personalLoans[i].amount })
        } else {
            if(snowballing) {
                personalLoanAction.push({ action: "500", value: 500 });
                snowballing = false;
            } else {
                personalLoanAction.push({ action: "Minimum", value: personalLoans[i].amount * .1 })
            }
        }
    }

    // Auto Loan
    for(let i = 0; i < autoLoans.length; i++) {
        if(funds - autoLoans[i].amount > 0) {
            funds = funds - autoLoans[i].amount;
            autoLoanAction.push({ action: "Payoff", value: autoLoans[i].amount })
        } else {
            if(snowballing) {
                autoLoanAction.push({ action: "500", value: 500 });
                snowballing = false;
            } else {
                autoLoanAction.push({ action: "Minimum", value: autoLoans[i].amount * .1 })
            }
        }
    }

    // Student Loan
    for(let i = 0; i < studentLoans.length; i++) {
        if(funds - studentLoans[i].amount > 0) {
            funds = funds - studentLoans[i].amount;
            studentLoanAction.push({ action: "Payoff", value: studentLoans[i].amount })
        } else {
            if(snowballing) {
                studentLoanAction.push({ action: "500", value: 500 });
                snowballing = false;
            } else {
                studentLoanAction.push({ action: "Minimum", value: studentLoans[i].amount * .1 })
            }
        }
    }

    //// STAGE 4
    let mortgageLoanAction = [];

    if(funds + monthlyFunds > 0) {
        activeStage = 4;
    }

    // Mortgage Loan
    for(let i = 0; i < mortgageLoans.length; i++) {
        if(funds - mortgageLoans[i].amount > 0) {
            funds = funds - mortgageLoans[i].amount;
            mortgageLoanAction.push({ action: "Payoff", value: mortgageLoans[i].amount })
        } else {
            if(snowballing) {
                mortgageLoanAction.push({ action: "500", value: 500 });
                snowballing = false;
            } else {
                mortgageLoanAction.push({ action: "Minimum", value: mortgageLoans[i].amount * .1 })
            }
        }
    }


    return { 
        activeStage,
        emergencyFund,
        emergencyFundAction,
        savingsFund,
        savingsFundAction,
        creditCardAction,
        personalLoanAction,
        autoLoanAction,
        studentLoanAction,
        mortgageLoanAction
    };
}

export const breakdown = derived(
    [income, cash, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans],
    ([$income, $cash, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans]) => 
        calculateBreakdown($income, $cash, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans)
);