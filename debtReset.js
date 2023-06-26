const cron = require('node-cron');
const Debt = require('./models/debtModel');

const resetDebts = () => {
  // Run at midnight on the first day of each month
  cron.schedule('0 0 1 * *', async () => {
    try {
      // Get all debts
      const debts = await Debt.find();

      // Group debts by user
      const debtsByUser = {};
      debts.forEach((debt) => {
        if (!debtsByUser[debt.user]) {
          debtsByUser[debt.user] = [];
        }
        debtsByUser[debt.user].push(debt);
      });
      // Update debts for each user
      for (const userId in debtsByUser) {
        if (Object.hasOwnProperty.call(debtsByUser, userId)) {
          const userDebts = debtsByUser[userId];
          const totalDebt = userDebts.reduce((acc, cur) => acc + cur.amount, 0);
          const latestDebt = userDebts[userDebts.length - 1];
          latestDebt.amount = totalDebt;
          await latestDebt.save();
        }
      }

      console.log('Debts reset for all users.');
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = resetDebts;
