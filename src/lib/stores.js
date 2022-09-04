import { writable, derived } from 'svelte/store';

import { calculateMonthlySchedule } from './service';

export const loanAmount = writable(0);
export const loanTerm = writable(0);
export const mortgageAPY = writable(0);
export const prePayment = writable(0);
export const savingsAPY = writable(0);

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, mortgageAPY, prePayment, savingsAPY],
    ([$loanAmount, $loanTerm, $mortgageAPY, $prePayment, $savingsAPY]) => 
        calculateMonthlySchedule($loanAmount, $loanTerm, $mortgageAPY, $prePayment, $savingsAPY)
);