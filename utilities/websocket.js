const WebSocket = require('ws')
const mapConn = new Map();
let wss;

function setServer(server) {
	wss = new WebSocket.Server({ server: server });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			try {
				const data = JSON.parse(message);
				if(data.type === 'memberId') {
					let memberId = data.memberId;
					if(!mapConn.has(memberId)) {
						mapConn.set(memberId, []);
					}
					ws.memberId = memberId;
					mapConn.get(memberId).push(ws);
				}
			}
			catch(error) {'ERROR while websocket connection:', console.error(error);}
		});

		ws.on('close', ()=>{
			try {
				if(ws.memberId) {
					let informedMemberId = ws.memberId;
					const memberConnections = mapConn.get(informedMemberId);
					const connectionIndex = memberConnections.indexOf(ws);
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
			connectedWs.send(JSON.stringify(message));
		})
	}
	catch(error) {'ERROR while websocket connection:', console.error(error);}
}

module.exports = {
	setServer,
	checkUserConnected,
	notify
}