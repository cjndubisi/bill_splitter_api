import resolver from '../resolver';

describe('Resolver', () => {
  it('resolver debts', () => {
    const sample = {
      users: ['a', 'b', 'c'],
      history: [
        { payer: 'a', amount: 90, users: ['a', 'b', 'c'] },
        { payer: 'b', amount: 12, users: ['a', 'b', 'c'] },
        { payer: 'c', amount: 60, users: ['a', 'b', 'c'] },
        { payer: 'a', amount: 9, users: ['a', 'b', 'c'] },
        { payer: 'a', amount: 6, users: ['a', 'b', 'c'] },
      ],
    };

    const resolved = resolver(sample);
    expect(resolved['a']).toBe(46);
    expect(resolved['b']).toBe(-47);
    expect(resolved['c']).toBe(1);
  });
});
