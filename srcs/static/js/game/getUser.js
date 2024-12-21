import { fetchAuthData } from '../user/fetchData.js';
import { showErrorMessages } from '../user/tools.js';
import { sendScoreInfo } from './pong/network.js';
import gameVar from './pong/var.js';

export async function getUserInfos()
{
        const response = await fetchAuthData('/user/private/')
		if (response.status == 200)
		{
			if (gameVar.playerIdx === 1)
			{
				gameVar.userName = response.data.username;
				gameVar.userAvatar = response.data.avatar;
				sendScoreInfo(gameVar.gameSocket, 1, gameVar.userName, 0, 0);
			}
			if (gameVar.playerIdx === 2)
			{
				gameVar.opponentName = response.data.username;
				gameVar.opponentAvatar = response.data.avatar;
				sendScoreInfo(gameVar.gameSocket, 2, gameVar.opponentName, 0, 0);
			}
		}
		else
		{
			showErrorMessages(response);
		}
}

export async function getUserInfos2()
{
	const response = await fetchAuthData('/user/private/')
	if (response.status == 200)
	{
		gameVar.userName = response.data.username;
		gameVar.userAvatar = response.data.avatar;
	}
	else
	{
		showErrorMessages(response);
	}
}
// export async function getUserInfosB()
// {
//         const response = await fetchAuthData('/user/private/')
// 		if (response.status == 200)
// 		{
// 			gameVar.userName = response.data.username;
// 			gameVar.userAvatar = response.data.avatar;
// 		}
// 		else
// 		{
// 			showErrorMessages(response.data.message, "error");
// 		}
// }
export function displayUsers(users)
{
    // const scoreboardElement = document.getElementById('scoreboard');
    // scoreboardElement.innerHTML = '';
    users.forEach(user =>
	{
		console.log("user : ", user.username);
    });
    // users.forEach(user =>
	// {
    //     const userElement = document.createElement('div');
    //     userElement.innerHTML = `
    //         ${user.username} ${user.is_online ? '🟢' : '⚪'}
    //     `;
    //     scoreboardElement.appendChild(userElement);
    // });
}