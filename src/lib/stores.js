import { writable, derived } from 'svelte/store';

import { calculateMonthlySchedule } from './Amortization/service';
import { calculateMonthlyPayments } from './Amortization/calculations';
import { calculateBreakdown } from './Breakdown/render';

export const loanAmount = writable(0);
export const loanTerm = writable(0);
export const mortgageAPY = writable(0);
export const prePayment = writable(0);
export const savingsAPY = writable(0);

export const amortizationSchedule = derived(
    [loanAmount, loanTerm, mortgageAPY, prePayment, savingsAPY],
    ([$loanAmount, $loanTerm, $mortgageAPY, $prePayment, $savingsAPY]) =>
        calculateMonthlySchedule($loanAmount, $loanTerm, $mortgageAPY/100, $prePayment, $savingsAPY)
);

export const monthlyPayment = derived(
    [loanAmount, loanTerm, mortgageAPY, prePayment],
    ([$loanAmount, $loanTerm, $mortgageAPY, $prePayment]) =>
        calculateMonthlyPayments($loanAmount, $mortgageAPY/100, $loanTerm) + $prePayment
);

const storedProfile = JSON.parse(localStorage.getItem("storedProfile")) || { income: undefined, cash: undefined };
export const profile = writable(storedProfile);
profile.subscribe(value => {
    localStorage.setItem("storedProfile", JSON.stringify(value));
});

const storedCreditCards = JSON.parse(localStorage.getItem("storedCreditCards")) || [];
export const creditCards = writable(storedCreditCards);
creditCards.subscribe(value => {
    localStorage.setItem("storedCreditCards", JSON.stringify(value));
});

const storedPersonalLoans = JSON.parse(localStorage.getItem("storedPersonalLoans")) || [];
export const personalLoans = writable(storedPersonalLoans);
personalLoans.subscribe(value => {
    localStorage.setItem("storedPersonalLoans", JSON.stringify(value));
});

const storedAutoLoans = JSON.parse(localStorage.getItem("storedAutoLoans")) || [];
export const autoLoans = writable(storedAutoLoans);
autoLoans.subscribe(value => {
    localStorage.setItem("storedAutoLoans", JSON.stringify(value));
});

const storedStudentLoans = JSON.parse(localStorage.getItem("storedStudentLoans")) || [];
export const studentLoans = writable(storedStudentLoans);
studentLoans.subscribe(value => {
    localStorage.setItem("storedStudentLoans", JSON.stringify(value));
});

const storedMortgageLoans = JSON.parse(localStorage.getItem("storedMortgageLoans")) || [];
export const mortgageLoans = writable(storedMortgageLoans);
mortgageLoans.subscribe(value => {
    localStorage.setItem("storedMortgageLoans", JSON.stringify(value));
});

export const inputActive = writable("");
export const deleteActive = writable("");

export const breakdown = derived(
    [profile, creditCards, personalLoans, autoLoans, studentLoans, mortgageLoans],
    ([$profile, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans]) => 
        calculateBreakdown($profile, $creditCards, $personalLoans, $autoLoans, $studentLoans, $mortgageLoans)
);