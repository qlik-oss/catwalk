import logic from '../../src/logic/logic';
import { data } from './sample-data';

describe('QueryModel', () => {
  it('should return a valid object for a field', () => {
    const model = new logic.QueryModel(data);
    expect(typeof (model)).toBe('object');
    expect(Object.keys(model.fields)).toContain('Fiscal Year');
    expect(Object.keys(model.fields)).toContain('Phone');
  });
});
