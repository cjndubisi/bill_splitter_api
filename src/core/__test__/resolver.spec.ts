import resolver from '../resolver';

describe('Resolver', () => {
  it.skip('resolver debts', () => {
    const sample = {
      users: ['a', 'b', 'c'],
      history: [
        { payer: 'a', amount: 90, participants: ['a', 'b', 'c'] },
        { payer: 'b', amount: 12, participants: ['a', 'b', 'c'] },
        { payer: 'c', amount: 60, participants: ['a', 'b', 'c'] },
        { payer: 'a', amount: 9, participants: ['a', 'b', 'c'] },
        { payer: 'a', amount: 6, participants: ['a', 'b', 'c'] },
      ],
    };

    const resolved = resolver(sample);
    expect(resolved['a']).toBe(46);
    expect(resolved['b']).toBe(-47);
    expect(resolved['c']).toBe(1);
  });

  it('can resolve 2 payments', () => {
    const sample = {
      users: ['a', 'b', 'c'],
      history: [
        { payer: 'a', amount: 90, participants: ['a', 'b', 'c'] },
        { payer: 'b', amount: 12, participants: ['a', 'b', 'c'] },
      ],
    };

    const expected = {
      a: { gets: { a: 0, b: 30, c: 30 }, debts: { a: 0, b: -4, c: 0 } },
      b: { gets: { a: 4, b: 0, c: 4 }, debts: { a: -30, b: 0, c: 0 } },
      c: { gets: { a: 0, b: 0, c: 0 }, debts: { a: -30, b: -4, c: 0 } },
    };

    const details = resolver(sample);
    expect(JSON.stringify(expected)).toEqual(JSON.stringify(details));
  });

  it('can resolve one payment made by all member', () => {
    const sample = {
      users: ['a', 'b', 'c'],
      history: [
        { payer: 'a', amount: 90, participants: ['a', 'b', 'c'] },
        { payer: 'b', amount: 12, participants: ['a', 'b', 'c'] },
        { payer: 'c', amount: 60, participants: ['a', 'b', 'c'] },
        { payer: 'a', amount: 9, participants: ['a', 'b', 'c'] },
        { payer: 'a', amount: 6, participants: ['a', 'b', 'c'] },
      ],
    };
  });
});
