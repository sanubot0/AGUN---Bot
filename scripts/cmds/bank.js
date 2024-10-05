module.exports = {
  config: {
    name: "bank",
    description: "Deposit or withdraw money from the bank and earn interest",
    guide: {
      vi: "",
      en: "Bank:\nInterest - Balance - Withdraw - Deposit - Transfer - Richest - Loan - PayLoan"
    },
    category: "economy",
    countDown: 5,
    role: 0,
    author: "Loufi | SiAM"
  },
  
  onStart: async function ({ args, message, event, api, usersData }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);
    
    const userMoney = await usersData.get(event.senderID, "money");
    const userData = await usersData.get(event.senderID) || {};  // Get all user data
    const bankData = userData.data?.bank || { bank: 0, lastInterestClaimed: Date.now(), loan: 0, loanPayed: true };

    const user = event.senderID;
    const info = await api.getUserInfo(user);
    const username = info[user].name;

    const command = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const recipientUID = args[2];

    switch (command) {
      case "deposit":
        if (isNaN(amount) || amount <= 0) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏Please enter a valid amount 🔁•");
        }
        if (userMoney < amount) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏You don't have the required amount✖•");
        }

        bankData.bank += amount;
        await usersData.set(event.senderID, { money: userMoney - amount, "data.bank": bankData });

        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏Successfully deposited ${amount} $ into your bank account✅•`);

      case "withdraw":
        const balance = bankData.bank || 0;

        if (isNaN(amount) || amount <= 0) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏Please enter the correct amount 😪");
        }

        if (amount > balance) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏The requested amount is greater than the available balance in your bank account...🗿");
        }

        bankData.bank = balance - amount;
        await usersData.set(event.senderID, { money: userMoney + amount, "data.bank": bankData });

        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏Successfully withdrew ${amount}$ from your bank account•`);

      case "balance":
        const bankBalance = bankData.bank !== undefined && !isNaN(bankData.bank) ? bankData.bank : 0;
        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏Your bank balance is: ${bankBalance}$ •\n❏To withdraw money:\ntype:\n${p}Bank Withdraw 'your withdrawal amount'•\n❏To earn interest:\ntype:\n${p}Bank Interest•`);

      case "interest":
        const interestRate = 0.001; // 0.1% daily interest rate
        const lastInterestClaimed = bankData.lastInterestClaimed || Date.now();
        const currentTime = Date.now();
        const timeDiffInSeconds = (currentTime - lastInterestClaimed) / 1000;
        const interestEarned = bankData.bank * (interestRate / 970) * timeDiffInSeconds;
        
        if (bankData.bank <= 0) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏You don't have any money in your bank account to earn interest.💸🥱");
        }

        bankData.lastInterestClaimed = currentTime;
        bankData.bank += interestEarned;

        await usersData.set(event.senderID, { "data.bank": bankData });

        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏You have earned interest of ${interestEarned.toFixed(2)} $ . It has been successfully added to your account balance..✅`);

      case "loan":
        const maxLoanAmount = 100000;
        const userLoan = bankData.loan || 0;
        const loanPayed = bankData.loanPayed !== undefined ? bankData.loanPayed : true;

        if (!amount) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏Please enter a valid loan amount..❗");
        }

        if (amount > maxLoanAmount) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏The maximum loan amount is 100000 ‼");
        }

        if (!loanPayed && userLoan > 0) {
          return message.reply(`[🏦 Bank Bot 🏦]\n\n❏You cannot take a new loan until you pay off your current loan..😑\nYour current loan to pay: ${userLoan}$`);
        }

        bankData.loan += amount;
        bankData.loanPayed = false;
        bankData.bank += amount;

        await usersData.set(event.senderID, { "data.bank": bankData });

        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏You have successfully taken a loan of ${amount}$. Please note that loans must be repaid within a certain period.😉`);

      case "payloan":
        const loanBalance = bankData.loan || 0;

        if (isNaN(amount) || amount <= 0) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏Please enter a valid amount to repay your loan..❗");
        }

        if (loanBalance <= 0) {
          return message.reply("[🏦 Bank Bot 🏦]\n\n❏You don't have any pending loan payments.😄");
        }

        if (amount > loanBalance) {
          return message.reply(`[🏦 Bank Bot 🏦]\n\n❏The amount required to pay off the loan is greater than your due amount. Please pay the exact amount.😊\nYour total loan: ${loanBalance}$`);
        }

        if (amount > userMoney) {
          return message.reply(`[🏦 Bank Bot 🏦]\n\n❏You do not have ${amount}$ in your balance to repay the loan.❌\nType ${p}bal\nto view your current main balance..🫵`);
        }

        bankData.loan -= amount;

        if (bankData.loan === 0) {
          bankData.loanPayed = true;
        }

        await usersData.set(event.senderID, { money: userMoney - amount, "data.bank": bankData });

        return message.reply(`[🏦 Bank Bot 🏦]\n\n❏Successfully repaid ${amount}$ towards your loan.✅\n\nto check type:\n${p}bank balance\n\nAnd your current loan to pay: ${bankData.loan}$`);

      default:
        return message.reply(`===[🏦 Bank Bot 🏦]===\n\n❏Please use one of the following commands:\n⭔ ${p}Bank Deposit\n⭔ ${p}Bank Withdraw\n⭔ ${p}Bank Balance\n⭔ ${p}Bank Interest\n⭔ ${p}Bank Transfer\n⭔ ${p}Bank Richest\n⭔ ${p}Bank Loan\n⭔ ${p}Bank PayLoan`);
    }
  }
};