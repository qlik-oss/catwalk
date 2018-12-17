const logic = require('../../src/logic/logic');
const { data } = require('./sample-data');

describe('QueryModel', () => {
  it('should return a valid object for a field', () => {
    const x = new logic.QueryModel(data);

    console.log(x.otherTablesOfField('Account'));

    expect(x).to.be.an('object');
    expect(x.fields).to.include.all.keys('Fiscal Year', 'Phone');
  });
});
