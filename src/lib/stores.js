import { writable, derived } from 'svelte/store';

export const loanAmount = writable(0);
export const loanTerm = writable(0);
export const interestRate = writable(0);
export const extraPayment = writable(0);


function calculateMonthlyPayments(principal, rate, term) {
    const mRate = rate / 12;
    const termRate = (1 + mRate) ** term;
    return principal * mRate * (termRate/(termRate - 1))
}

function calculateRemainingBalance(principal, apy, numOfPayments, payment) {
    const pv = principal
    const r = apy / 12;
    const n = numOfPayments;
    const p = payment;

    return (pv * ((1 + r) ** n)) - (p * ((((1 + r) ** n) - 1) / r));
}

function calculateMonthlySchedule(principal, rate, term, extra) {
    // Static numbers
    const monthlyPayment = calculateMonthlyPayments(principal, rate, term);
    const finalCost = monthlyPayment * term;
    const finalInterest = finalCost - principal;
    
    // Iteration
    let schedule = [];
    let pastBalance = principal;
    let pastReducedBalance = principal;
    
    // Running Totals
    let sumPayment = 0;
    let sumExtraPayment = 0;
    let sumInterestPaid = 0;
    let sumInterestSaved = 0;

    // Savings
    let monthlyRate = (.01/12);
    let sumSavings = 0;
    
    for (let month = 1; month <= term; month++) {
        // Loan status
        let balance = calculateRemainingBalance(principal, rate, month, monthlyPayment)
        let reducedBalance = calculateRemainingBalance(principal, rate, month, monthlyPayment + extra)
        
        //Payment 
        let extraPayment = !reducedBalance ? Math.max(pastReducedBalance, 0) : parseFloat(extra);
        sumPayment += monthlyPayment;
        sumExtraPayment += extraPayment;
        
        // Cost breakdown
        let cost = Math.max(finalCost - sumPayment, 0);
        let interest = cost - balance;
        
        // Payment breakdown
        let interestPaid = pastBalance * (rate/12);
        let principalPaid = pastBalance - balance;
        
        // Early Payoff
        let reducedInterest = pastReducedBalance * (rate/12);
        let reducedPrincipal = monthlyPayment - reducedInterest + extra;
        

        //sumInterestSaved += interestSaved;

        // Savings
        sumSavings = (sumSavings * (1 + monthlyRate)) + extraPayment;
        let savingsAtPayoff = 0//sumSavings + (monthlyRate * (term - payments))*sumSavings;

        //Profit
        let savingsProfit = savingsAtPayoff - sumInterestSaved;
        let payoffProfit = sumExtraPayment + sumInterestSaved;

        schedule.push({ 
            month: month,
            cost: cost.toFixed(2),
            payment: monthlyPayment.toFixed(2),
            balance: balance.toFixed(2),
            interest: interest.toFixed(2),
            toInterest: interestPaid.toFixed(2),
            toPrincipal: principalPaid.toFixed(2),
            extra: reducedPrincipal.toFixed(2),
            interestSaved: reducedInterest.toFixed(2),
            reducedBalance: reducedBalance.toFixed(2),
            invested: sumExtraPayment.toFixed(2),
            savings: sumSavings.toFixed(2),
            payoff: savingsAtPayoff.toFixed(2),
            savingsProfit: savingsProfit.toFixed(2),
            payoffProfit: payoffProfit.toFixed(2),
            diff: (payoffProfit - savingsProfit).toFixed(2),
        })

        pastBalance = balance;
        pastReducedBalance = reducedBalance;
    }
    return schedule;
}

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, interestRate, extraPayment],
    $store => calculateMonthlySchedule($store[0], $store[2], $store[1], $store[3])
);