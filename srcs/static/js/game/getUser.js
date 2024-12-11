import { fetchAuthData } from '../user/fetchData.js';
import { showErrorMessages } from '../user/tools.js';
import gameVar from './pong/var.js';

export async function getUserInfos()
{
        const response = await fetchAuthData('/user/private/')
		if (response.status == 200)
		{
			gameVar.userName = response.data.username;
			gameVar.avatarUrl = response.data.avatar;
		}
		else
			showErrorMessages(response.data.message, "error")
}



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