import { calculateMonthlyPayments, calculateRemainingBalance } from './calculations';

export function calculateMonthlySchedule(principal, term, rate, extra) {
    // Static numbers
    const hyInterestRate = (.01 / 12);
    const monthlyRate = (rate / 12);
    const monthlyPayment = calculateMonthlyPayments(principal, rate, term);
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
        let balance = calculateRemainingBalance(principal, rate, month, monthlyPayment)
        let ppBalance = calculateRemainingBalance(principal, rate, month, monthlyPayment + extra)
        let paidOff = !pastReducedBalance;
        let ppPaymentNeeded = !!ppBalance;

        // Payment
        let cost = Math.max(finalCost - (monthlyPayment * (term - month)), 0);
        let interestPaid = pastBalance * monthlyRate;
        let principalPaid = pastBalance - balance;

        // Early Payoff
        sumExtraPayment += ppPaymentNeeded ? parseFloat(extra) : pastReducedBalance;
        let ppInterest = pastReducedBalance * monthlyRate;
        let ppPrincipal = ppPaymentNeeded ? monthlyPayment - ppInterest + parseFloat(extra) : pastReducedBalance;
        sumInterestSaved += !paidOff ? (interestPaid - ppInterest): 0;
        let ppSavings = (!paidOff ? sumInterestSaved : 0);
        let ppProfit = (!paidOff ? sumExtraPayment : 0)  + ppSavings;

        // Savings
        sumSavings = (ppPaymentNeeded ? parseFloat(extra) : 0) + (sumSavings * (1 + hyInterestRate));
        let hySavings = !paidOff ? sumSavings + ((hyInterestRate * (term - month)) * sumSavings) : 0;
        let hyProfit = hySavings - ppSavings;

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
            analysis: ((hyProfit - ppProfit)/sumExtraPayment * 100).toFixed(2),
        })
    }
    return schedule;
}