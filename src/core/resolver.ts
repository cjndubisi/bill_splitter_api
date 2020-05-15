interface Case {
  payer: string;
  amount: number;
  participants: string[];
}

interface GroupHistory {
  // all users since the creation of group
  // deleted users will be listed
  users: string[];
  history: Case[];
}

const resolver = (group: GroupHistory) => {
  const history = group.history;
  const users = group.users;

  const itemStatement = history.map((item) => {
    let result: { [key: string]: any } = {};
    const split = item.amount / item.participants.length;

    return item.participants.reduce((acc, next) => {
      if (next === item.payer) {
        return acc;
      }

      acc[item.payer] = acc[item.payer] || {};
      acc[next] = acc[next] || {};
      acc[item.payer].debts = {};
      acc[next].gets = {};

      acc[item.payer].gets = {
        ...(acc[item.payer].gets || {}),
        ...{ [next]: split },
      };
      acc[next].debts = {
        ...(acc[item.payer].debts || {}),
        ...{ [item.payer]: split * -1 },
      };
      return acc;
    }, result);
  });

  const details = itemStatement.reduce((acc, next, index) => {
    // get all debts and gets for each user
    users.forEach((user) => {
      acc[user] = acc[user] || {};
      const accGets = acc[user].gets || {};
      const accDebts = acc[user].debts || {};
      const nextGets = next[user].gets || {};
      const nextDebts = next[user].debts || {};

      const allGets = [accGets, nextGets].reduce((a, b) => {
        users.forEach((item) => (a[item] = (a[item] || 0) + (b[item] || 0)));
        return a;
      }, {});

      const allDebts = [accDebts, nextDebts].reduce((a, b) => {
        users.forEach((item) => (a[item] = (a[item] || 0) + (b[item] || 0)));
        return a;
      }, {});
      acc[user].gets = allGets;
      acc[user].debts = allDebts;
    });
    return acc;
  }, {});

  return details
};

export default resolver;
