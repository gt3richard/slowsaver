import { calculateMonthlyPayments, calculateRemainingBalance } from './calculations';

/**
 * @param {number} principal
 * @param {number} term
 * @param {number} mortgageAPY
 * @param {number} prePayment
 * @param {number} savingsAPY
 */
export function calculateMonthlySchedule(principal, term, mortgageAPY, prePayment, savingsAPY) {
    // Static numbers
    const hyInterestRate = (savingsAPY / 12);
    const monthlyRate = (mortgageAPY / 12);
    const monthlyPayment = calculateMonthlyPayments(principal, mortgageAPY, term);
    const finalCost = monthlyPayment * term;
    
    // Iteration
    let schedule = [];
    let pastBalance = principal;
    let pastReducedBalance = principal;
    
    // Running Totals
    let sumExtraPayment = 0;
    let sumInterestSaved = 0;
    let sumSavings = 0;
    
    for (let month = 1; month <= term; month++) {
        // Loan status
        let balance = calculateRemainingBalance(principal, mortgageAPY, month, monthlyPayment)
        let ppBalance = calculateRemainingBalance(principal, mortgageAPY, month, monthlyPayment + prePayment)
        let paidOff = !pastReducedBalance;
        let ppPaymentNeeded = !!ppBalance;

        // Payment
        let cost = Math.max(finalCost - (monthlyPayment * (term - month)), 0);
        let interestPaid = pastBalance * monthlyRate;
        let principalPaid = pastBalance - balance;

        // Early Payoff
        sumExtraPayment += ppPaymentNeeded ? prePayment : pastReducedBalance;
        let ppInterest = pastReducedBalance * monthlyRate;
        let ppPrincipal = ppPaymentNeeded ? monthlyPayment - ppInterest + prePayment : pastReducedBalance;
        sumInterestSaved += !paidOff ? (interestPaid - ppInterest): 0;
        let ppSavings = (!paidOff ? sumInterestSaved : 0);
        let ppProfit = (!paidOff ? sumExtraPayment : 0)  + ppSavings;

        // Savings
        sumSavings = (ppPaymentNeeded ? prePayment : 0) + (sumSavings * (1 + hyInterestRate));
        let hySavings = !paidOff ? sumSavings + ((hyInterestRate * (term - month)) * sumSavings) : 0;
        let hyProfit = hySavings - ppSavings;

        // Analysis
        let analysis = (hyProfit - ppProfit)/sumExtraPayment * 100;

        pastBalance = balance;
        pastReducedBalance = ppBalance;

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
            ppInterest: ppInterest.toFixed(2),
            ppPrincipal: ppPrincipal.toFixed(2),  
            ppBalance: ppBalance.toFixed(2),
            ppSavings: ppSavings.toFixed(2),
            ppProfit: ppProfit.toFixed(2),
            // High Yield Interest
            hySavings: hySavings.toFixed(2),
            hyProfit: hyProfit.toFixed(2),
            // Analysis
            analysis: analysis.toFixed(2),
        })
    }
    return schedule;
}