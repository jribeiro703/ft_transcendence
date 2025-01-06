import brickVar from "./var.js";
import { getUserInfos } from "../getUser.js";
import gameVar from "../pong/var.js";

// export async function joinRoomB(roomName)
// {
// 	console.log("joinRoomB");
// 	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
// 	const gameSocket = new WebSocket(protocol + '//' + window.location.host + `/ws/brickout/${roomName}/`);

// 	gameSocket.onopen = function(e)
// 	{
// 		console.log('Game socket opened');
// 		try
// 		{
// 			gameSocket.send(JSON.stringify({ type: 'join_room' }));
// 			gameVar.gameSocket = gameSocket;
// 			if (gameVar.playerIdx == 1)
// 			{
// 				console.log("if player 1");
// 				getUserInfos();
// 				waitingPlayer();
// 			}
// 			if (gameVar.playerIdx == 2)
// 			{
// 				console.log("if player 2");
// 				getUserInfos();
// 				sendPlayerData(gameVar.gameSocket, gameVar.playerReady);
// 				waitingForSettingLive();
// 			}
// 		}
// 		catch (error)
// 		{
// 			console.error("error on send message: ", error);
// 		}
// 	};

// 	gameSocket.onmessage = function(e)
// 	{
// 		try
// 		{
// 			const data = JSON.parse(e.data);
// 			if (data.type === 'ping')
// 			{
// 				gameSocket.send(JSON.stringify({ type: 'pong' }));
// 			}
// 			else if (data.type == 'client_left')
// 			{
// 				gameVar.clientLeft = true;
// 				if (gameSocket && gameSocket.readyState === WebSocket.OPEN)
// 				{
// 					gameSocket.send(JSON.stringify({
//             		type: 'room_deleted',
//             		room_name: roomName
//         		}));
// 				}
// 			}
// 			else if (data.type == 'player_data')
// 			{
// 				gameVar.playerReady = data.player_data.playerReady;
// 			}
// 			// else if (data.type == 'game_data')
// 			// {
// 			// 	brickVar.gameStart = data.game_data.gameStart;
// 			// 	brickVar.currentServer = data.game_data.currentServer;
// 			// 	brickVar.startTime = data.game_data.startTime;
// 			// 	brickVar.clientLeft = data.game_data.clientLeft;
// 			// }
// 			else if (data.type == 'setting_data')
// 			{
// 				// brickVar.gameReady = data.setting_data.gameReady;
// 				brickVar.difficulty = data.setting_data.difficulty;
// 				brickVar.currLevel = data.setting_data.currentLevel;
// 			}
// 			else if (data.type == 'score_info_data')
// 			{
// 				brickVar.playerScore = data.score_info_data.score1;
// 				brickVar.opponentScore = data.score_info_data.score2;

// 				if (data.score_info_data.idx === 1)
// 				{
// 					console.log("recept 1 :", data.score_info_data.name);
// 					brickVar.userName = data.score_info_data.name;
// 				}
// 				if (data.score_info_data.idx === 2)
// 				{
// 					console.log("recept 2 :", data.score_info_data.name);
// 					brickVar.opponentName = data.score_info_data.name;
// 				}
// 			}
// 		}
// 		catch (error)
// 		{
// 			console.error("error process message", error);
// 		}
// 	};

// 	gameSocket.onerror = function(e)
// 	{
// 		console.error('Game socket error:', e);
// 	};

// 	gameSocket.onclose = function(e)
// 	{
// 		console.error('Game socket closed unexpectedly code : ', e.code, 'reason', e.reason);
// 	};
// }