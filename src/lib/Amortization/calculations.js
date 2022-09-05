
export function calculateMonthlyPayments(principal, apy, numOfPayments) {
    const pv = principal
    const r = apy / 12;
    const n = numOfPayments;
    
    const p = pv * r * (((1 + r) ** n)/(((1 + r) ** n) - 1));
    return p;
}

export function calculateRemainingBalance(principal, apy, numOfPayments, payment) {
    const pv = principal
    const r = apy / 12;
    const n = numOfPayments;
    const p = payment;

    const fv = (pv * ((1 + r) ** n)) - (p * ((((1 + r) ** n) - 1) / r));
    return Math.max(fv, 0);
}