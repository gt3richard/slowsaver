import { Content } from './localization';

export function calculateBreakdown(profile, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans) {
    let income = profile.income;
    let cash = profile.cash;
    let paycheck = parseFloat((income / 12 * .5).toFixed(2));
    let funds = cash;
    let monthlyFunds = parseFloat(paycheck.toFixed(2));
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
        emergencyFundAction = `Put $${emergencyFund.toLocaleString()} into a regular savings account.`;
    } else {
        if(funds) {
            emergencyFund = funds;
            funds = 0;
            emergencyFundAction = `Put $${emergencyFund.toLocaleString()} into a regular savings account.`;
        }

        if (monthlyFunds) {
            let balance = Content.EmergencyFund.amount - emergencyFund;
            let months = Math.ceil(balance / paycheck);

            if(monthlyFunds - balance > 0) {
                monthlyFunds = monthlyFunds - balance;
                emergencyFundAction += `Deposit $${balance.toLocaleString()} from your paycheck.`
            } else {
                monthlyFunds = 0;
                emergencyFundAction += `Deposit $${paycheck.toLocaleString()} each month for ${months} months.`
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
                        actionText += `Use $${funds.toLocaleString()} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance.toLocaleString()} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds.toLocaleString()} this month, then pay $${paycheck.toLocaleString()} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck.toLocaleString()} each month for ${months} months.`
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
        savingsFundAction = `Put $${savingsFund.toLocaleString()} into a high yield savings account.`;
    } else {
        if(funds) {
            savingsFund = funds;
            funds = 0;
            savingsFundAction = `Put $${savingsFund.toLocaleString()} into a high yield savings account.`;
        }

        if (monthlyFunds) {
            let balance = (Content.Savings.percentage * income) - savingsFund;
            let months = Math.ceil(balance / paycheck);
            monthlyFunds = 0;
            savingsFundAction += `Deposit $${paycheck.toLocaleString()} each month for ${months} months.`
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
                        actionText += `Use $${funds.toLocaleString()} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance.toLocaleString()} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds.toLocaleString()} this month, then pay $${paycheck.toLocaleString()} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck.toLocaleString()} each month for ${months} months.`
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
                        actionText += `Use $${funds.toLocaleString()} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance.toLocaleString()} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds.toLocaleString()} this month, then pay $${paycheck.toLocaleString()} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck.toLocaleString()} each month for ${months} months.`
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
                        actionText += `Use $${funds.toLocaleString()} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance.toLocaleString()} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds.toLocaleString()} this month, then pay $${paycheck.toLocaleString()} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck.toLocaleString()} each month for ${months} months.`
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
                        actionText += `Use $${funds.toLocaleString()} to pay down.`
                        payment = funds;
                        funds = 0;
                    }

                    let months = Math.ceil(balance / (paycheck));
                    if(monthlyFunds - balance > 0) {
                        actions.push({ action: balance, value: balance + payment });
                        monthlyFunds = monthlyFunds - balance;
                        actionText += `Then payoff with $${balance.toLocaleString()} from your paycheck.`
                    } else {
                        actions.push({ action: monthlyFunds, value: monthlyFunds + payment });
                        if(monthlyFunds !== paycheck) {
                            actionText += `Pay $${monthlyFunds.toLocaleString()} this month, then pay $${paycheck.toLocaleString()} each month for ${months} months.`
                        } else {
                            actionText += `Then pay $${paycheck.toLocaleString()} each month for ${months} months.`
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