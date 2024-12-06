import gameVar from "./var.js";

export function getElementGameSelection()
{
	gameVar.settingBtn1 = document.getElementById('settingBtn1');
	gameVar.settingBtn2 = document.getElementById('settingBtn2');
	gameVar.playBtn = document.getElementById('playBtn');
	gameVar.playBtn2 = document.getElementById('playBtn2');
	gameVar.playBtn3 = document.getElementById('playBtn3');
	gameVar.playBtn4 = document.getElementById('playBtn4');
}

export function getElementLobby()
{
	gameVar.createRoomBtn = document.getElementById('createRoomBtn');
	gameVar.roomView = document.getElementById('roomView');
	gameVar.roomsContainer = document.getElementById('roomsContainer');
	gameVar.noRoomsMessage = document.getElementById('noRoomsMessage');
	gameVar.refreshBtn = document.getElementById('refreshBtn');
	gameVar.settingBtn = document.getElementById('settingBtn');

	gameVar.roomView.style.display = 'block';
	gameVar.refreshBtn.style.display = 'block';
	gameVar.settingBtn.style.display = 'block';
}
export function getBtnById()
{
	gameVar.powerUpSelection = document.getElementById('powerUpSelection');
	gameVar.btnPowerUp = document.getElementById('btnPowerUp');
	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.footLevel = document.getElementById('footLevel');
	gameVar.tennisLevel = document.getElementById('tennisLevel');
	gameVar.saveBtn = document.getElementById('saveBtn');
}