const token = require('./token');

test('check encode and decode', ()=>{
	let payload = {
		'id': 1,
		'email': 'test@test.com'
	};
	let userToken = token.encode(payload);

	expect(userToken).not.toMatch(/test@test.com/);

	let decodeMember = token.decode(userToken);
	expect(decodeMember.id).toBe(payload.id);
	expect(decodeMember.email).toBe(payload.email);
})