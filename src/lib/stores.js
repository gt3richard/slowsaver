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
    for(let i = 0; i < creditCards.length; i++) {
        if(funds - creditCards[i].amount >= 0) {
            funds = funds - creditCards[i].amount;
            creditCard.push({ action: "Payoff", value: creditCards[i].amount })
            creditCardAction += `${creditCardAction ? 'Then use' : 'Use'} cash to payoff ${creditCards[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - creditCards[i].amount > 0) {
                    monthlyFunds = monthlyFunds - creditCards[i].amount;
                    creditCard.push({ action: "Payoff", value: creditCards[i].amount })
                    creditCardAction += `${creditCardAction ? 'Then use' : 'Use'} paycheck to payoff ${creditCards[i].name}`
                } else {
                    let balance = creditCards[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        creditCardAction += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        creditCard.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        creditCardAction += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        creditCard.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            creditCardAction += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            creditCardAction += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
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
    for(let i = 0; i < personalLoans.length; i++) {
        if(funds - personalLoans[i].amount >= 0) {
            funds = funds - personalLoans[i].amount;
            personalLoan.push({ action: "Payoff", value: personalLoans[i].amount })
            personalLoanAction += `${personalLoanAction ? 'Then use' : 'Use'} cash to payoff ${personalLoans[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - personalLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - personalLoans[i].amount;
                    personalLoan.push({ action: "Payoff", value: personalLoans[i].amount })
                    personalLoanAction += `${personalLoanAction ? 'Then use' : 'Use'} cash to payoff ${personalLoans[i].name}.`
                } else {
                    let balance = personalLoans[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        personalLoanAction += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        personalLoan.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        personalLoanAction += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        personalLoan.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            personalLoanAction += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            personalLoanAction += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                personalLoan.push({ action: "Minimum", value: personalLoans[i].amount * .1 })
            }
        }
    }

    // Auto Loan
    for(let i = 0; i < autoLoans.length; i++) {
        if(funds - autoLoans[i].amount >= 0) {
            funds = funds - autoLoans[i].amount;
            autoLoan.push({ action: "Payoff", value: autoLoans[i].amount })
            autoLoanAction += `${autoLoanAction ? 'Then use' : 'Use'} cash to payoff ${autoLoans[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - autoLoans[i].amount >= 0) {
                    monthlyFunds = monthlyFunds - autoLoans[i].amount;
                    autoLoan.push({ action: "Payoff", value: autoLoans[i].amount })
                    autoLoanAction += `${autoLoanAction ? 'Then use' : 'Use'} cash to payoff ${autoLoans[i].name}.`
                } else {
                    let balance = autoLoans[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        autoLoanAction += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        autoLoan.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        autoLoanAction += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        autoLoan.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            autoLoanAction += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            autoLoanAction += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
                }
            } else {
                autoLoan.push({ action: "Minimum", value: autoLoans[i].amount * .1 })
            }
        }
    }

    // Student Loan
    for(let i = 0; i < studentLoans.length; i++) {
        if(funds - studentLoans[i].amount >= 0) {
            funds = funds - studentLoans[i].amount;
            studentLoan.push({ action: "Payoff", value: studentLoans[i].amount })
            studentLoanAction += `${studentLoanAction ? 'Then use' : 'Use'} cash to payoff ${studentLoans[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - studentLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - studentLoans[i].amount;
                    studentLoan.push({ action: "Payoff", value: studentLoans[i].amount })
                    studentLoanAction += `${studentLoanAction ? 'Then use' : 'Use'} cash to payoff ${studentLoans[i].name}.`
                } else {
                    let balance = studentLoans[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        studentLoanAction += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        studentLoan.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        studentLoanAction += `Then payoff with $${balance} from your paycheck.`
                    } else {
                        studentLoan.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            studentLoanAction += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            studentLoanAction += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                    }
                    payments += months;
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
            mortgageLoanAction += `${mortgageLoanAction ? 'Then use' : 'Use'} cash to payoff ${mortgageLoans[i].name}.`
        } else {
            if(snowballing && monthlyFunds) {
                if(monthlyFunds - mortgageLoans[i].amount > 0) {
                    monthlyFunds = monthlyFunds - mortgageLoans[i].amount;
                    mortgageLoan.push({ action: "Payoff", value: mortgageLoans[i].amount })
                    mortgageLoanAction += `${mortgageLoanAction ? 'Then use' : 'Use'} cash to payoff ${mortgageLoans[i].name}.`
                } else {
                    let balance = mortgageLoans[i].amount;
                    let payment = 0;
                    if(funds) {
                        balance = balance - funds;
                        mortgageLoanAction += `Use $${funds} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        mortgageLoan.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        mortgageLoanAction += `Deposit $${balance} from your paycheck.`
                    } else {
                        mortgageLoan.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            mortgageLoanAction += `Pay $${monthlyFunds} this month, then pay $${paycheck} each month for ${months} months.`
                        } else {
                            mortgageLoanAction += `Then pay $${paycheck} each month for ${months} months.`
                        }
                        snowballing = false;
                        monthlyFunds = 0;
                        mortgageLoanAction += `Deposit $${paycheck} each month for ${months} months.`
                    }
                    payments += months;
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