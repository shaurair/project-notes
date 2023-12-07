const { Server } = require('socket.io');
const mapConn = new Map();
let ioServer;

function setSocket(server) {
	ioServer = new Server(server);

	ioServer.on('connection', function connection(ioClient) {
		ioClient.on('message', function incoming(message) {
			try {
				const data = JSON.parse(message);
				if(data.type === 'memberId') {
					let memberId = data.memberId;
					if(!mapConn.has(memberId)) {
						mapConn.set(memberId, []);
					}
					ioClient.memberId = memberId;
					mapConn.get(memberId).push(ioClient);
				}
			}
			catch(error) {'ERROR while websocket connection:', console.error(error);}
		});

		ioClient.on('close', ()=>{
			try {
				if(ioClient.memberId) {
					let informedMemberId = ioClient.memberId;
					const memberConnections = mapConn.get(informedMemberId);
					const connectionIndex = memberConnections.indexOf(ioClient);
					if(connectionIndex !== -1) {
						memberConnections.splice(connectionIndex, 1);
					}
				}
			}
			catch(error) {'ERROR while websocket connection:', console.error(error);}
		})
	})
}

function checkUserConnected(memberId) {
	if(mapConn.has(memberId)) {
		if(mapConn.get(memberId).length > 0) {
			return true;
		}
	}

	return false;
}

function notify(memberId, message) {
	try {
		mapConn.get(memberId).forEach(connectedWs => {
			connectedWs.emit('message', JSON.stringify(message));
		})
	}
	catch(error) {'ERROR while websocket connection:', console.error(error);}
}

module.exports = {
	checkUserConnected,
	notify,
	setSocket
}