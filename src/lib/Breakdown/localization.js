export const Content = {
    EmergencyFund: {
        name: "Emergency Fund",
        description: "",
        amount: 1000,
    },
    CreditCard: {
        name: "Credit Card",
        description: "",
    },
    Savings: {
        name: "Savings",
        description: "",
        percentage: .5
    },
    Retirement: {
        name: "Retirement",
        description: "",
        percentage: .15,
        Account: [
            { name: "401k / IRA" },
        ]
    },
    PersonalLoan: {
        name: "Personal Loan",
        description: "",
    },
    AutoLoan: {
        name: "Auto Loan",
        description: "",
    },
    StudentLoan: {
        name: "Student Loan",
        description: "",
    },
    Mortgage: {
        name: "Mortgage",
        description: "",
    },
    Investment: {
        name: "Investment",
        description: "",
        Account: [
            { name: "Growth", percentage: 0.6 },
            { name: "Small Cap Growth", percentage: 0.2 },
            { name: "International", percentage: 0.2 },
        ]
    }
}