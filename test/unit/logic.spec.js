const logic = require('../../src/logic/logic');
const { data } = require('./sample-data');

describe('QueryModel', () => {
  it('fields should return a valid object', () => {
    const x = new logic.QueryModel(data);
    expect(x).to.be.an('object');
    expect(x.fields).to.include.all.keys('Fiscal Year', 'Phone');
  });
});
