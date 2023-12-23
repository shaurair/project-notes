const dataFormat = require('./dataFormat');

test('check date formate transformation', ()=>{
	expect(dataFormat.setDateFormateSlash('2023-12-01')).toBe('2023/12/01');
	expect(dataFormat.setDateFormateSlash(null)).toBe(null);
})