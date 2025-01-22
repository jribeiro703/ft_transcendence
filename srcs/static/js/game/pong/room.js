import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import { sendPlayerData, sendScoreInfo, sendSettingData } from "./network.js";
import { renderPageGame } from "../HistoryManager.js";
import { startLiveGame } from "./start.js";
import { getUserInfosRemote } from "../getUser.js";
import { initGame, initListenerB } from "../brickout/init.js";
import { kickOut } from "./draw.js";
import { clearPongVar } from "./reset.js";

export async function createPrivateRoom()
{
    clearPongVar();

    gameVar.private = true;
    gameVar.liveMatch = true;
    gameVar.game = 'pong';
    gameVar.playerIdx = 1;

    renderPageGame("playPongRemote", true);
    const roomName = await createNewRoom();
    return roomName;
} 


export async function joinPrivateRoom(roomName)
{
    clearPongVar();

    gameVar.private = true;
    gameVar.liveMatch = true;
    gameVar.game = 'pong';
    gameVar.playerIdx = 2;
    gameVar.playerReady = true;

    renderPageGame("playPongRemoteSecondP", true);
    await joinRoom(roomName);
}

export function createNewRoom(joinRoomCallback)
{
    if (gameVar.private)
    {
        return new Promise((resolve) => 
        {
            const roomName = `privatePongRoom_${Math.floor(Math.random() * 10000)}`;
            gameVar.playerIdx = 1;
            joinRoom(roomName);
            resolve(roomName);
        });
    }
    else
    {
        var roomName;
        if (gameVar.game === "pong")
            roomName = `PongRoom_${Math.floor(Math.random() * 10000)}`;
        else if (gameVar.game === "brickout")
            roomName = `BrickRoom_${Math.floor(Math.random() * 10000)}`;
        const inter = setInterval(() =>
        {
            if (gameVar.tournament)
            {
                sendRoomNameData(gameVar.lobbySocket, roomName);
                sendSettingData(gameVar.lobbySocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
            }
        }, 1000);

        if (gameVar.game === "pong")
        {
            gameVar.playerIdx = 1;
            joinRoom(roomName);
        }
        else if (gameVar.game === "brickout")
        {
            brickVar.playerIdx = 1;
            joinRoom(roomName);
        }
    }
}

export function waitPlayerPong()
{
    gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
    gameVar.ctx.font = "40px Arial";
    gameVar.ctx.fillStyle = "#455F78";
    gameVar.ctx.fillText("Waiting for opponent...", gameVar.canvasW / 4, gameVar.canvasH / 2);
    gameVar.ctx.strokeStyle = "#1F2E4D";
    gameVar.ctx.lineWidth = 1;
    gameVar.ctx.strokeText("Waiting for opponent...", gameVar.canvasW / 4, gameVar.canvasH / 2);

    if (!gameVar.private)
        sendSettingData(gameVar.lobbySocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
    else
        sendSettingData(gameVar.gameSocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
}

export function waitPlayerBrick()
{
    brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
    brickVar.ctx.font = "40px Arial";
    brickVar.ctx.fillStyle = "#455F78";
    brickVar.ctx.fillText("Waiting for opponent...", brickVar.canvasW / 4, brickVar.canvasH / 2);
    brickVar.ctx.strokeStyle = "#1F2E4D";
    brickVar.ctx.lineWidth = 1;
    brickVar.ctx.strokeText("Waiting for opponent...", brickVar.canvasW / 4, brickVar.canvasH / 2);
    sendSettingData(gameVar.lobbySocket, brickVar.gameReady, brickVar.difficulty, brickVar.currLevel);
}

export function finishPlayerWaitPong(waitingInterval)
{
    gameVar.gameReady = true;
    clearInterval(waitingInterval);
    sendSettingData(gameVar.gameSocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
    sendScoreInfo(gameVar.gameSocket, 1, gameVar.userName, 0, 0);
    startLiveGame();
}

export function finishPLayerWaitBrick(waitingInterval)
{
    brickVar.gameReady = true;
    clearInterval(waitingInterval);
    sendSettingData(gameVar.gameSocket, brickVar.gameReady, brickVar.difficulty, brickVar.currLevel);
    sendScoreInfo(gameVar.gameSocket, 1, gameVar.userName, 0, 0);
    initGame();
}

export function waitingPlayer()
{
    const waitingInterval = setInterval(() =>
    {
        gameVar.waitingInterval = waitingInterval;
        if (!gameVar.playerReady)
        {
            if (gameVar.game === "pong")
                waitPlayerPong();
            else if (gameVar.game === "brickout")
                waitPlayerBrick();
        }
        else
        {
            if (gameVar.game === "pong")
                finishPlayerWaitPong(waitingInterval);
            else if (gameVar.game === "brickout")
                finishPLayerWaitBrick(waitingInterval);
        }
    }, 2000);
}

export function waitingPlayerTournament()
{
    let waitTime = 0;
    const maxWaitTime = 120;
    const waitingInterval = setInterval(() =>
    {
        waitTime += 2;
        if (waitTime >= maxWaitTime)
        {
            kickOut();
            return;
        }
        if (!gameVar.playerReady)
        {
            if (gameVar.game === "pong")
                waitPlayerPong();
            else if (gameVar.game === "brickout")
                waitPlayerBrick();
        }
        else
        {
            if (gameVar.game === "pong")
                finishPlayerWaitPong(waitingInterval);
            else if (gameVar.game === "brickout")
                finishPLayerWaitBrick(waitingInterval);
        }
    }, 2000);
}

export function checkPlayerIdx()
{
    if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1)
    {
        // console.log("player 1 left : ", gameVar.clientLeft);
        getUserInfosRemote();
        if (gameVar.tournament)
            waitingPlayerTournament();
        else
            waitingPlayer();
    }
    if (gameVar.playerIdx === 2 || brickVar.playerIdx === 2)
    {
        console.log("player 2");
        getUserInfosRemote();
        sendPlayerData(gameVar.gameSocket, gameVar.playerReady);
        waitingForSettingLive();
    }
}

export async function joinRoom(roomName)
{
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const gameSocket = new WebSocket(protocol + "//" + window.location.host + `/ws/pong/${roomName}/`);
    gameSocket.onopen = function (e)
    {
        try
        {
            gameSocket.send(JSON.stringify({ type: "join_room" }));
            gameVar.gameSocket = gameSocket;
            checkPlayerIdx();
            document.dispatchEvent(new CustomEvent("multiplayerGame",
            {
                detail: {
                multiplayer_game: true,
                },
            }),
            );
        }
        catch (error)
        {
            console.log("Error in onopen:", error);
        }
    };

    gameSocket.onmessage = function (e)
    {
        try
        {
            const data = JSON.parse(e.data);
            if (data.type === "ping")
            {
                gameSocket.send(JSON.stringify({ type: "pong" }));
            }
            else if (data.type == "client_left")
            {
                // console.log("received client Left");
                gameVar.clientLeft = true;
                if (gameSocket && gameSocket.readyState === WebSocket.OPEN)
                    {
                        gameSocket.send(JSON.stringify(
                        {
                            type: "room_deleted",
                            room_name: roomName,
                        }));
                    }
            }
            else if (data.type == "ball_data")
            {
                gameVar.x = data.ball_data.x;
                gameVar.y = data.ball_data.y;
            }
            else if (data.type == "direction_data")
            {
                gameVar.dx = data.direction_data.dx;
                gameVar.dy = data.direction_data.dy;
                gameVar.init_dx = data.direction_data.initDx;
                gameVar.init_dy = data.direction_data.initDy;
            }
            else if (data.type == "paddle_data")
            {
                if (data.paddle_data.playerIdx == 1)
                    gameVar.playerPaddleY = data.paddle_data.paddle_y;
                if (data.paddle_data.playerIdx == 2)
                    gameVar.player2PaddleY = data.paddle_data.paddle_y;
            }
            else if (data.type == "player_data")
            {
                gameVar.playerReady = data.player_data.playerReady;
            }
            else if (data.type == "game_data")
            {
                // console.log("received client left : ", data.game_data.clientLeft);
                gameVar.gameStart = data.game_data.gameStart;
                gameVar.currentServer = data.game_data.currentServer;
                gameVar.startTime = data.game_data.startTime;
                gameVar.clientLeft = data.game_data.clientLeft;
            }
            else if (data.type == "setting_data")
            {
                if (gameVar.game === "pong")
                {
                    gameVar.gameReady = data.setting_data.gameReady;
                    gameVar.difficulty = data.setting_data.difficulty;
                    gameVar.currentLevel = data.setting_data.currentLevel;
                }
                else if (gameVar.game === "brickout")
                {
                    brickVar.gameReady = data.setting_data.gameReady;
                    brickVar.difficulty = data.setting_data.difficulty;
                    brickVar.currLevel = data.setting_data.currentLevel;
                }
            }
            else if (data.type == "score_info_data")
            {
                gameVar.playerScore = data.score_info_data.score1;
                gameVar.aiScore = data.score_info_data.score2;
                if (data.score_info_data.idx === 1)
                    gameVar.userName = data.score_info_data.name;
                if (data.score_info_data.idx === 2)
                    gameVar.opponentName = data.score_info_data.name;
            }
            else if (data.type === "scoreB_info_data")
            {
                if (data.scoreB_info_data.idx === 1)
                {
                    brickVar.playerScore = data.scoreB_info_data.score;
                    brickVar.playerLives = data.scoreB_info_data.lives;
                }
                if (data.scoreB_info_data.idx === 2)
                {
                    brickVar.opponentScore = data.scoreB_info_data.score;
                    brickVar.opponentLives = data.scoreB_info_data.lives;
                }
            }
        } catch (error) {
            console.error("error process message", error);
        }
    };

    gameSocket.onerror = function (e)
    {
        console.error("Game socket error:", e);
    };

    gameSocket.onclose = function (e)
    {
        console.error("Game socket closed unexpectedly code : ", e.code, "reason", e.reason);
    };

    return gameSocket;
}

export function findGameScore()
{
    if (gameVar.game === "brickout")
    {
        if (data.score_info_data.idx === 1)
        {
            brickVar.playerScore = data.score_info_data.score1;
            brickVar.opponentScore = data.score_info_data.score2;
        }
        if (data.score_info_data.idx === 2)
        {
            brickVar.playerScore = data.score_info_data.sco;
        }
    }
}

export function delRooms()
{
    while (gameVar.rooms.length > 0)
        gameVar.rooms.pop();
}

export function updateRoomInfo(index, difficulty, level)
{
    const room = gameVar.rooms.find((room) => room.idx === index);

    if (room)
    {
        room.difficulty = difficulty;
        room.level = level;
    }
}

export function updateRoomList()
{
    var game;
    if (!gameVar.private)
        gameVar.roomsContainer.innerHTML = "";
    gameVar.rooms.forEach((room) =>
    {
        if (room.idx === null || room.idx === undefined)
            return;

        gameVar.noRoomsMessage.style.display = "none";
        if (room.name.charAt(0) === "P")
        {
            game = "Pong";
            room.visibility = 'Public'
        }
        else if (room.name.charAt(0) === "B")
        {
            game = "Brickout";
            room.visibility = 'Public'
        }
        else if (room.name.charAt(0) === 'p')
        {
            game = 'Pong';
            room.visibility = 'Private';
        }

        const roomItem = document.createElement("div");
        roomItem.className = "server-item";
        roomItem.innerHTML = `
                <div class="room-header">
                    <span class="room-name">${room.name}</span>
                    <button id="joinBtn" class="joinRoomBtn" ${room.status === "Started" ? "disabled" : ""}>Join</button>
                </div>
                <div class="room-info">
                    <span class="room-players">Players: ${room.players}/2</span>
                    <span class="room-difficulty">Difficulty: ${room.difficulty}</span>
                    <span class="room-level">Level: ${room.level}</span>
                    <span class="room-status">Status: ${room.status}</span>
                    <span class="room-game">Game: ${game}</span>
                    <span class="room-visibility">Acces: ${room.visibility}</span>
                </div>
            `;
        const joinBtn = roomItem.querySelector(".joinRoomBtn");

        joinBtn.addEventListener("click", () =>
        {
            if (gameVar.game === "pong" && game === "Pong" && room.visibility !== 'Private')
            {
                gameVar.playerReady = true;
                gameVar.playerIdx = 2;
                renderPageGame("playPongRemoteSecondP", true);
                joinRoom(room.name);
            }
            else if (gameVar.game === "brickout" && game === "Brickout" && room.visibility !== 'Private')
            {
                gameVar.playerReady = true;
                gameVar.playerIdx = 2;
                renderPageGame("playBrickoutRemoteSecondP", true);
                joinRoom(room.name);
            }
            else if (room.visibility === 'Public')
            {
                const gameSpan = roomItem.querySelector(".room-game");
                gameSpan.style.transition = "color 0.3s ease";
                gameSpan.style.color = "red";

                setTimeout(() => {
                    gameSpan.style.color = "";
                }, 300);
            }
            else if (room.visibility === 'Private')
            {
                const visiSpan = roomItem.querySelector(".room-visibility");
                visiSpan.style.transition = "color 0.3s ease";
                visiSpan.style.color = "red";

                setTimeout(() => {
                    visiSpan.style.color = "";
                }, 300);               
            }
        });
    gameVar.roomsContainer.appendChild(roomItem);
    });
}

export function waitingForSettingLive()
{
    const waitingInterval = setInterval(() =>
    {
        if (gameVar.game === "pong")
        {
            if (gameVar.currentLevel === null || gameVar.difficulty === null)
            {
                console.log("waiting for setting");
            } 
            else
            {
                clearInterval(waitingInterval);
                startLiveGame();
            }
        }
        else if (gameVar.game === "brickout")
        {
            if (brickVar.currLevel === null || brickVar.difficulty === null)
            {
                console.log("waiting for setting");
            } 
            else
            {
                initListenerB();
                initGame();
                clearInterval(waitingInterval);
            }
        }
    }, 2000);
}

export function checkRoom(rooms)
{
    if (rooms && Array.isArray(rooms))
    {
        gameVar.rooms = gameVar.rooms.filter((room) => rooms.includes(room.name));
        updateRoomList();
    }
}

export function getDateTime()
{
    var currentDateTime;
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR",
    {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const time = now.toLocaleTimeString("fr-FR",
    {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    currentDateTime = `${date} ${time}`;
    return currentDateTime;
}

export function roomNetwork()
{
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const tempSocket = new WebSocket(protocol + "//" + window.location.host + "/ws/pong/check_rooms/");
    gameVar.lobbySocket = tempSocket;
    var idx = 0;
    gameVar.refreshBtn.addEventListener("click", () =>
    {
        tempSocket.send(JSON.stringify({ type: "lobbyView" }));
        updateRoomList();
    });
    tempSocket.onopen = function (e)
    {
        tempSocket.send(JSON.stringify({ type: "lobbyView" }));
    };

    tempSocket.onmessage = function (e)
    {
        const data = JSON.parse(e.data);
        if (data.type === "looks_rooms")
        {
            if (data.rooms)
            {
                idx = gameVar.rooms.length;
                data.rooms.forEach((roomName) =>
                {
                    checkRoom(data.rooms);
                    const roomExists = gameVar.rooms.some((room) => room.name === roomName);
                    if (!roomExists)
                    {
                        const time = getDateTime();
                        if (gameVar.private)
                            addRoom(idx, roomName, "Waiting for opponent", 1, gameVar.difficulty, gameVar.currentLevel, time, "private");
                        else
                            addRoom(idx, roomName, "Waiting for opponent", 1, gameVar.difficulty, gameVar.currentLevel, time, "public");
                        idx++;
                    }
                });
            }
        }
        if (data.type == "norooms")
        {
            delRooms();
            gameVar.noRoomsMessage.style.display = "flex";
            updateRoomList();
        }
        if (data.type === "ping")
        {
            tempSocket.send(JSON.stringify({ type: "pong" }));
        }
        if (data.type === "setting_data")
        {
            idx--;
            updateRoomInfo(idx, data.setting_data.difficulty, data.setting_data.currentLevel);
            updateRoomList();
        }
    };
    tempSocket.onerror = function (event)
    {
        console.error("WebSocket error observed:", event);
    };

    tempSocket.onclose = function (event)
    {
        console.log("WebSocket closed:", event);
    };
}

export function addRoom(index, roomName, status, nbplayer, difficulty = null, level = null, time, visibility)
{
    if (!gameVar.rooms.some((room) => room.name === roomName))
    {
        gameVar.rooms.push(
        {
            idx: index,
            name: roomName,
            players: nbplayer,
            difficulty: difficulty,
            level: level,
            status: status,
            time: time,
            visibility: visibility,
        });
    }
}