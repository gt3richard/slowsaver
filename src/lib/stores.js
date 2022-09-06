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
    let paycheck = income / 12 * .5;
    let funds = cash;
    let monthlyFunds = paycheck;
    let activeStage = 1;
    
    let snowballing = true;
    let payments = 0;


    //// STAGE 1
    let emergencyFund = 0;
    let emergencyFundAction = "";
    let creditCard = [];
    let creditCardAction = "";

    // Emergency Funds
    if(funds - Content.EmergencyFund.amount >= 0) {
        emergencyFund = Content.EmergencyFund.amount;
        funds = funds - Content.EmergencyFund.amount;
        emergencyFundAction = `Put $${emergencyFund} into a regular savings account.`;
    } else {
        if(funds) {
            emergencyFund = funds;
            funds = 0;
            emergencyFundAction = `Put $${emergencyFund} into a regular savings account.`;
        }

        if (monthlyFunds) {
            let balance = Content.EmergencyFund.amount - emergencyFund;
            let months = Math.ceil(balance / paycheck);

            if(monthlyFunds - balance > 0) {
                monthlyFunds = monthlyFunds - balance;
                emergencyFundAction += `Deposit $${balance} from your paycheck.`
            } else {
                monthlyFunds = 0;
                emergencyFundAction += `Deposit $${paycheck} each month for ${months} months.`
            }
            payments += months;
        }
    }

    // Credit Card
    let lines = creditCards;
    let actions = [];
    let actionText = "";
    for(let i = 0; i < lines.length; i++) {
        if(funds - lines[i].amount >= 0) {
            funds = funds - lines[i].amount;
            actions.push({ action: "Payoff", value: lines[i].amount })
            actionText += `${actionText ? 'Then use' : 'Use'} cash to payoff ${lines[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - lines[i].amount > 0) {
                    monthlyFunds = monthlyFunds - lines[i].amount;
                    actions.push({ action: "Payoff", value: lines[i].amount })
                    actionText += `${actionText ? 'Then use' : 'Use'} paycheck to payoff ${lines[i].name}`
                } else {
                    let balance = lines[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        actionText += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                actions.push({ action: "Minimum", value: lines[i].amount * .1 })
            }
        }
    }
    creditCard = actions;
    creditCardAction = actionText;

    //// STAGE 2
    let savingsFund = 0;
    let savingsFundAction = "";
    let retirementFund = [];
    let retirementFundAction = "";

    if(funds + monthlyFunds > 0) {
        activeStage = 2;
    }

    // Savings Fund
    if(funds - (Content.Savings.percentage * income) >= 0) {
        savingsFund = Content.Savings.percentage * income;
        funds = funds - (Content.Savings.percentage * income);
        savingsFundAction = `Put $${savingsFund} into a high yield savings account.`;
    } else {
        if(funds) {
            savingsFund = funds;
            funds = 0;
            savingsFundAction = `Put $${savingsFund} into a high yield savings account.`;
        }

        if (monthlyFunds) {
            let balance = (Content.Savings.percentage * income) - savingsFund;
            let months = Math.ceil(balance / paycheck);
            monthlyFunds = 0;
            savingsFundAction += `Deposit $${paycheck} each month for ${months} months.`
            payments += months;
        }
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
    lines = personalLoans;
    actions = [];
    actionText = "";
    for(let i = 0; i < lines.length; i++) {
        if(funds - lines[i].amount >= 0) {
            funds = funds - lines[i].amount;
            actions.push({ action: "Payoff", value: lines[i].amount })
            actionText += `${actionText ? 'Then use' : 'Use'} cash to payoff ${lines[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - lines[i].amount > 0) {
                    monthlyFunds = monthlyFunds - lines[i].amount;
                    actions.push({ action: "Payoff", value: lines[i].amount })
                    actionText += `${actionText ? 'Then use' : 'Use'} paycheck to payoff ${lines[i].name}`
                } else {
                    let balance = lines[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        actionText += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                actions.push({ action: "Minimum", value: lines[i].amount * .1 })
            }
        }
    }
    personalLoan = actions;
    personalLoanAction = actionText;

    // Auto Loan
    lines = autoLoans;
    actions = [];
    actionText = "";
    for(let i = 0; i < lines.length; i++) {
        if(funds - lines[i].amount >= 0) {
            funds = funds - lines[i].amount;
            actions.push({ action: "Payoff", value: lines[i].amount })
            actionText += `${actionText ? 'Then use' : 'Use'} cash to payoff ${lines[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - lines[i].amount > 0) {
                    monthlyFunds = monthlyFunds - lines[i].amount;
                    actions.push({ action: "Payoff", value: lines[i].amount })
                    actionText += `${actionText ? 'Then use' : 'Use'} paycheck to payoff ${lines[i].name}`
                } else {
                    let balance = lines[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        actionText += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                actions.push({ action: "Minimum", value: lines[i].amount * .1 })
            }
        }
    }
    autoLoan = actions;
    autoLoanAction = actionText;

    // Student Loan
    lines = studentLoans;
    actions = [];
    actionText = "";
    for(let i = 0; i < lines.length; i++) {
        if(funds - lines[i].amount >= 0) {
            funds = funds - lines[i].amount;
            actions.push({ action: "Payoff", value: lines[i].amount })
            actionText += `${actionText ? 'Then use' : 'Use'} cash to payoff ${lines[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - lines[i].amount > 0) {
                    monthlyFunds = monthlyFunds - lines[i].amount;
                    actions.push({ action: "Payoff", value: lines[i].amount })
                    actionText += `${actionText ? 'Then use' : 'Use'} paycheck to payoff ${lines[i].name}`
                } else {
                    let balance = lines[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        actionText += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                actions.push({ action: "Minimum", value: lines[i].amount * .1 })
            }
        }
    }
    studentLoan = actions;
    studentLoanAction = actionText;

    //// STAGE 4
    let mortgageLoan = [];
    let mortgageLoanAction = "";
    let investment = [];
    let investmentAction = "";

    if(funds + monthlyFunds > 0) {
        activeStage = 4;
    }

    // Mortgage Loan
    lines = mortgageLoans;
    actions = [];
    actionText = "";
    for(let i = 0; i < lines.length; i++) {
        if(funds - lines[i].amount >= 0) {
            funds = funds - lines[i].amount;
            actions.push({ action: "Payoff", value: lines[i].amount })
            actionText += `${actionText ? 'Then use' : 'Use'} cash to payoff ${lines[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - lines[i].amount > 0) {
                    monthlyFunds = monthlyFunds - lines[i].amount;
                    actions.push({ action: "Payoff", value: lines[i].amount })
                    actionText += `${actionText ? 'Then use' : 'Use'} paycheck to payoff ${lines[i].name}`
                } else {
                    let balance = lines[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        actionText += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                actions.push({ action: "Minimum", value: lines[i].amount * .1 })
            }
        }
    }
    mortgageLoan = actions;
    mortgageLoanAction = actionText;

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