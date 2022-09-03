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

    // Savings
    let monthlyRate = 1 + (.01/12);
    let sumSavings = 0;
    
    for (let i = 1; i <= term; i++) {
        // Loan status
        let balance = calculateOutstandingBalance(principal, rate, term, i)
        let reducedBalance = Math.max(calculateOutstandingBalance(principal, rate, term, i, extra), 0)
        
        //Payment 
        let extraPayment = !reducedBalance ? Math.max(pastReducedBalance, 0) : extra;
        sumPayment += monthlyPayment;
        sumExtraPayment += extraPayment;
        
        // Cost breakdown
        let cost = Math.max(finalCost - sumPayment, 0);
        let interest = cost - balance;
        
        // Payment breakdown
        let principalPaid = pastBalance - balance;
        let interestPaid = monthlyPayment - principalPaid;
        sumInterestPaid += interestPaid;
        
        let interestSaved = 0;

        // Savings
        sumSavings = (sumSavings * monthlyRate) + extraPayment;

        schedule.push({ 
            month: i,
            cost: cost.toFixed(2),
            payment: monthlyPayment.toFixed(2),
            balance: balance.toFixed(2),
            interest: interest.toFixed(2),
            toInterest: interestPaid.toFixed(2),
            toPrincipal: principalPaid.toFixed(2),
            extra: extraPayment.toFixed(2),
            reducedBalance: reducedBalance.toFixed(2),
            interestSaved: interestSaved.toFixed(2),
            invested: sumExtraPayment.toFixed(2),
            savings: (sumSavings - sumExtraPayment).toFixed(2)
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