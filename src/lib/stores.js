import { writable, derived } from 'svelte/store';

import { calculateMonthlySchedule } from './service';

export const loanAmount = writable(0);
export const loanTerm = writable(0);
export const interestRate = writable(0);
export const extraPayment = writable(0);

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, interestRate, extraPayment],
    ([$loanAmount, $loanTerm, $interestRate, $extraPayment]) => calculateMonthlySchedule($loanAmount, $loanTerm, $interestRate, $extraPayment)
);