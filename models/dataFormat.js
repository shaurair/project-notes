const { format } = require('date-fns');

function setDateFormateSlash(date) {
	if(date === null) {
		return null
	}
	
	let formateDate = new Date(date);
	return format(formateDate, 'yyyy/MM/dd');
}

module.exports = {
	setDateFormateSlash
}