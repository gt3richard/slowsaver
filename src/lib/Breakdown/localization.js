export const Content = {
    EmergencyFund: {
        name: "Emergency Fund",
        description: "Life is unpredictable and we should pull from this first instead of charging it to a credit card.",
        amount: 1000,
    },
    CreditCard: {
        name: "Credit Card",
        description: "These are the highest drain on your funds and the most expensive debt to have which is why we prioritize paying them off first.",
    },
    Savings: {
        name: "Savings",
        description: "Now let's create some financial security. Building up a nest egg will protect any future problems of job loss from causing you to stray from the plan.",
        percentage: .5
    },
    Retirement: {
        name: "Retirement",
        description: "With immediate financial security covered, let's make sure you're secure at old age. Just because you're retired doesn't mean the bills stop.",
        percentage: .15,
        Account: [
            { name: "401k / IRA" },
        ]
    },
    PersonalLoan: {
        name: "Personal Loan",
        description: "After credit cards these are the second highest interest rate loans so clean these up first.",
    },
    AutoLoan: {
        name: "Auto Loan",
        description: "Knock these out. Your goal should be to save and buy all future cars in cash and never need to see an auto loan again.",
    },
    StudentLoan: {
        name: "Student Loan",
        description: "If you have one of these it could be your largest balance other than a mortgage. Start chipping away at this because no bankrupcy can save you from this debt.",
    },
    Mortgage: {
        name: "Mortgage",
        description: "Paying off a mortgage is a guaranteed profit because for every dollar you pay extra you'll save on interest. And it will bring you closing to financial freedom.",
    },
    Investment: {
        name: "Investment",
        description: "You've made it to the end game. Use a no-fee broker like Vanguard to regularly invest in growth mutual funds.",
        Account: [
            { name: "Growth", percentage: 0.6, description: "Suggest: VIGAX" },
            { name: "Small Cap Growth", percentage: 0.2, description: "Suggest: VSGAX" },
            { name: "International", percentage: 0.2, description: "Suggest: VTIAX" },
        ]
    }
}