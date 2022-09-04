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

    const fv = (pv * ((1 + r) ** n)) - (p * ((((1 + r) ** n) - 1) / r));
    return Math.max(fv, 0);
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
        sumExtraPayment += !reducedBalance ? Math.max(pastReducedBalance, 0) : parseFloat(extra);
        sumPayment += monthlyPayment;
        let extraPayment = (reducedBalance ? sumExtraPayment : 0) 
        
        // Cost breakdown
        let cost = Math.max(finalCost - sumPayment, 0);
        
        // Payment breakdown
        let interestPaid = pastBalance * (rate/12);
        let principalPaid = pastBalance - balance;
        
        // Early Payoff
        let reducedInterest = pastReducedBalance * (rate/12);
        let reducedPrincipal = reducedBalance ? monthlyPayment - reducedInterest + extra : pastReducedBalance;
        sumInterestSaved += reducedBalance ? (interestPaid - reducedInterest): 0;
        let ppSavings = sumInterestSaved;
        let ppProfit = extraPayment + ppSavings;

        // Savings
        sumSavings = (sumSavings * (1 + monthlyRate)) + (reducedBalance ? parseFloat(extra) : 0);
        let hySavings = sumSavings + ((monthlyRate * (term - month)) * sumSavings);
        let hyProfit = hySavings - ppSavings;

        schedule.push({ 
            // Baseline
            month: month,
            cost: cost.toFixed(2),
            payment: monthlyPayment.toFixed(2),
            interest: interestPaid.toFixed(2),
            principal: principalPaid.toFixed(2),
            balance: balance.toFixed(2),
            // Pre Payment
            ppCost: 0,
            ppInterest: reducedInterest.toFixed(2),
            ppPrincipal: reducedPrincipal.toFixed(2),  
            ppBalance: reducedBalance.toFixed(2),
            ppSavings: ppSavings.toFixed(2),
            ppProfit: ppProfit.toFixed(2),
            // High Yield Interest
            hySavings: hySavings.toFixed(2),
            hyProfit: hyProfit.toFixed(2),
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