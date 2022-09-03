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

function calculateOutstandingBalance(principal, rate, term, payments) {
    const mRate = rate / 12;
    const termRate = (1 + mRate) ** term;
    const paymentRate = (1 + mRate) ** payments;
    return principal * ((termRate - paymentRate)/(termRate - 1))
}

function calculateMonthlySchedule(principal, rate, term) {
    let schedule = [];
    let monthlyPayment = calculateMonthlyPayments(principal, rate, term);
    let previousRemainingBalance = principal;
    for (let i = 0; i <= term; i++) {
        let remainingBalance = calculateOutstandingBalance(principal, rate, term, i)
        let principalPaid = previousRemainingBalance - remainingBalance;
        let interestPaid = monthlyPayment - principalPaid;
        if(i > 0) {
            schedule.push({ 
                month: i,
                payment: monthlyPayment.toFixed(2),
                balance: remainingBalance.toFixed(2),
                toInterest: interestPaid.toFixed(2),
                toPrincipal: principalPaid.toFixed(2)
            })
        }
        previousRemainingBalance = remainingBalance;
    }
    return schedule;
}

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, interestRate],
    $store => calculateMonthlySchedule($store[0], $store[2], $store[1])
);