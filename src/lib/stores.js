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

function calculateOutstandingBalance(principal, rate, term, payments, extra = 0) {
    const mRate = rate / 12;
    const termRate = (1 + mRate) ** term;
    const paymentRate = (1 + mRate) ** payments;
    return (principal * ((termRate - paymentRate)/(termRate - 1))) - (extra * payments)
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
    
    for (let payments = 1; payments <= term; payments++) {
        // Loan status
        let balance = calculateOutstandingBalance(principal, rate, term, payments)
        let reducedBalance = Math.max(calculateOutstandingBalance(principal, rate, term, payments, extra), 0)
        
        //Payment 
        let extraPayment = !reducedBalance ? Math.max(pastReducedBalance, 0) : parseFloat(extra);
        sumPayment += monthlyPayment;
        sumExtraPayment += extraPayment;
        
        // Cost breakdown
        let cost = Math.max(finalCost - sumPayment, 0);
        let interest = cost - balance;
        
        // Payment breakdown
        let principalPaid = pastBalance - balance;
        let interestPaid = pastBalance * (rate/12);
        sumInterestPaid += interestPaid;
        
        let interestSaved = reducedBalance > 0 ? interestPaid - (reducedBalance * (rate/12)) : 0;
        sumInterestSaved += interestSaved;

        // Savings
        sumSavings = (sumSavings * (1 + monthlyRate)) + extraPayment;
        let savingsAtPayoff = sumSavings + (monthlyRate * (term - payments))*sumSavings;

        //Profit
        let savingsProfit = savingsAtPayoff - sumInterestSaved;
        let payoffProfit = sumExtraPayment + sumInterestSaved;

        schedule.push({ 
            month: payments,
            cost: cost.toFixed(2),
            payment: monthlyPayment.toFixed(2),
            balance: balance.toFixed(2),
            interest: interest.toFixed(2),
            toInterest: interestPaid.toFixed(2),
            toPrincipal: principalPaid.toFixed(2),
            extra: extraPayment.toFixed(2),
            reducedBalance: reducedBalance.toFixed(2),
            interestSaved: sumInterestSaved.toFixed(2),
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