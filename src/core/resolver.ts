interface Case {
  payer: string;
  amount: number;
  users: string[];
}

interface GroupHistory {
  // all users singe the creation on group
  // deleted users will be listed
  users: string[];
  history: Case[];
}

const resolver = (group: GroupHistory) => {
  const cases = group.history;
  const itemStatement = cases.map((element) => {
    let result: { [key: string]: number } = {};
    const split = element.amount / element.users.length;
    result[element.payer] = split * (element.users.length - 1);
    return element.users.reduce((acc, next) => {
      if (Object.keys(acc).indexOf(next) !== -1) {
        return acc;
      }
      result[next] = split * -1;
      return result;
    }, result);
  });

  let initial: { [key: string]: number } = {};
  return group.users.reduce((acc, item) => {
    acc[item] = itemStatement.reduce((prev, next) => prev + next[item], 0);
    return acc;
  }, initial);
};

export default resolver;
