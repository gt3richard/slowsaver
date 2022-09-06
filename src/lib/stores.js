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
    let monthlyFunds = income / 12 * .5;
    let activeStage = 1;
    let snowballing = true;

    //// STAGE 1
    let emergencyFund = 0;
    let emergencyFundAction = "";
    let creditCard = [];
    let creditCardAction = "";

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
            creditCard.push({ action: "Payoff", value: creditCards[i].amount })
            creditCardAction += `${creditCardAction.length > 0 ? 'Then use' : 'Use'} cash to payoff ${creditCards[i].name}.`
        } else {
            if(snowballing) {
                if(monthlyFunds - creditCards[i].amount > 0) {
                    monthlyFunds = monthlyFunds - creditCards[i].amount;
                    creditCard.push({ action: "Payoff", value: creditCards[i].amount })
                    creditCardAction += `${creditCardAction.length > 0 ? 'Then use' : 'Use'} paycheck to payoff ${creditCards[i].name}`
                } else {
                    creditCard.push({ action: monthlyFunds, value: monthlyFunds });
                    monthlyFunds = 0;
                    snowballing = false;
                }
            } else {
                creditCard.push({ action: "Minimum", value: creditCards[i].amount * .1 })
            }
        }
    }

    //// STAGE 2
    let savingsFund = 0;
    let savingsFundAction = "";
    let retirementFund = [];
    let retirementFundAction = "";

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

    // Retirement
    if(monthlyFunds > 0) {
        retirementFund.push({ value: income / 12 * Content.Retirement.percentage });
        retirementFundAction = `Contribute ${Content.Retirement.percentage * 100}% of you annual income.`
    }

    //// STAGE 3
    let personalLoan = [];
    let personalLoanAction = "";
    let autoLoan = [];
    let autoLoanAction = "";
    let studentLoan = [];
    let studentLoanAction = "";

    if(funds + monthlyFunds > 0) {
        activeStage = 3;
    }

    // Personal Loan
    for(let i = 0; i < personalLoans.length; i++) {
        if(funds - personalLoans[i].amount > 0) {
            funds = funds - personalLoans[i].amount;
            personalLoan.push({ action: "Payoff", value: personalLoans[i].amount })
        } else {
            if(snowballing) {
                if(monthlyFunds - personalLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - personalLoans[i].amount;
                    personalLoan.push({ action: "Payoff", value: personalLoans[i].amount })
                } else {
                    personalLoan.push({ action: monthlyFunds, value: monthlyFunds });
                    monthlyFunds = 0;
                    snowballing = false;
                }
            } else {
                personalLoan.push({ action: "Minimum", value: personalLoans[i].amount * .1 })
            }
        }
    }

    // Auto Loan
    for(let i = 0; i < autoLoans.length; i++) {
        if(funds - autoLoans[i].amount > 0) {
            funds = funds - autoLoans[i].amount;
            autoLoan.push({ action: "Payoff", value: autoLoans[i].amount })
        } else {
            if(snowballing) {
                if(monthlyFunds - autoLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - autoLoans[i].amount;
                    autoLoan.push({ action: "Payoff", value: autoLoans[i].amount })
                } else {
                    autoLoan.push({ action: monthlyFunds, value: monthlyFunds });
                    monthlyFunds = 0;
                    snowballing = false;
                }
            } else {
                autoLoan.push({ action: "Minimum", value: autoLoans[i].amount * .1 })
            }
        }
    }

    // Student Loan
    for(let i = 0; i < studentLoans.length; i++) {
        if(funds - studentLoans[i].amount > 0) {
            funds = funds - studentLoans[i].amount;
            studentLoan.push({ action: "Payoff", value: studentLoans[i].amount })
        } else {
            if(snowballing) {
                if(monthlyFunds - studentLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - studentLoans[i].amount;
                    studentLoan.push({ action: "Payoff", value: studentLoans[i].amount })
                } else {
                    studentLoan.push({ action: monthlyFunds, value: monthlyFunds });
                    monthlyFunds = 0;
                    snowballing = false;
                }
            } else {
                studentLoan.push({ action: "Minimum", value: studentLoans[i].amount * .1 })
            }
        }
    }

    //// STAGE 4
    let mortgageLoan = [];
    let mortgageLoanAction = "";
    let investment = [];
    let investmentAction = "";

    if(funds + monthlyFunds > 0) {
        activeStage = 4;
    }

    // Mortgage Loan
    for(let i = 0; i < mortgageLoans.length; i++) {
        if(funds - mortgageLoans[i].amount > 0) {
            funds = funds - mortgageLoans[i].amount;
            mortgageLoan.push({ action: "Payoff", value: mortgageLoans[i].amount })
        } else {
            if(snowballing) {
                if(monthlyFunds - mortgageLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - mortgageLoans[i].amount;
                    mortgageLoan.push({ action: "Payoff", value: mortgageLoans[i].amount })
                } else {
                    mortgageLoan.push({ action: monthlyFunds, value: monthlyFunds });
                    monthlyFunds = 0;
                    snowballing = false;
                }
            } else {
                mortgageLoan.push({ action: "Minimum", value: mortgageLoans[i].amount * .1 })
            }
        }
    }

    // Investment
    if(monthlyFunds > 0) {
        for(let i = 0; i < Content.Investment.Account.length; i++) {
            investment.push({ value: monthlyFunds * Content.Investment.Account[i].percentage})
        }
        investmentAction = "Keep investing a portion of your remaining income accordingly."
    }

    return { 
        activeStage,
        emergencyFund,
        emergencyFundAction,
        savingsFund,
        savingsFundAction,
        retirementFund,
        retirementFundAction,
        creditCard,
        creditCardAction,
        personalLoan,
        personalLoanAction,
        autoLoan,
        autoLoanAction,
        studentLoan,
        studentLoanAction,
        mortgageLoan,
        mortgageLoanAction,
        investment,
        investmentAction
    };
}

export const breakdown = derived(
    [income, cash, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans],
    ([$income, $cash, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans]) => 
        calculateBreakdown($income, $cash, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans)
);