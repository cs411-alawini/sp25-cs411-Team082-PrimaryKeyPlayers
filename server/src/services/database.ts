import { Teams } from '../models/teams';
import { PlayerStats } from '../models/players';
import { user } from '../models/user';
import { userFavorites } from '../models/user';

import { playerStatsData } from '../../../data/playerStatsData';
import { teamData } from '../../../data/teamData';
import { userData } from '../../../data/userData';
import { userFavoritesData } from '../../../data/userFavoritesData';

export async function getAllPlayers(): Promise<PlayerStats[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(playerStatsData as PlayerStats[]);
    }, 300);
  });
}

export async function getAllTeams(): Promise<Teams[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(teamData);
    }, 300);
  });
}

export async function getTeamByName(team_name: string): Promise<Teams[]> {
  const queryName = team_name.toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(teamData.filter(t => t.team_name.toLowerCase().includes(queryName)));
    }, 300);
  });
}

export async function getTeamById(team_id: string): Promise<Teams[]> {
  const queryName = team_id.toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(teamData.filter(t => t.team_id.toLowerCase().includes(queryName)));
    }, 300);
  });
}

export async function getPlayerByName(player_name: string): Promise<PlayerStats[]> {
  const queryName = player_name.toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(playerStatsData.filter(p => p.Player.toLowerCase().includes(queryName)) as PlayerStats[]);
    }, 300);
  });
}

export async function getAllUsers(): Promise<user[]> { 
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userData);
    }, 300);
  });
}

export async function addUser(user: Omit<user, "user_id">): Promise<user> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const maxUser_id = userData.length > 0 ? Math.max(...userData.map(u => u.user_id)) : 0;
      const newUser: user = {
        user_id: maxUser_id + 1,
        ...user,
      };
        userData.push(newUser);
        resolve(newUser);
    }, 300);
  });
}

export async function addFavorite(
  user_id: number,
  favorite_id: string,
  favorite_type: 'player' | 'team'
): Promise<userFavorites> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFavorite: userFavorites = {
        user_id,
        favorite_id,
        favorite_type
      };

      userFavoritesData.push(newFavorite);
      resolve(newFavorite);
    }, 300);
  });
}

export async function getFavoriteTeams(user_id: number): Promise<Teams[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const favoriteTeams = userFavoritesData
        .filter(f => f.user_id === user_id && f.favorite_type === 'team')
        .map(f => f.favorite_id);

      const teams = teamData.filter(t => favoriteTeams.includes(t.team_id));
      resolve(teams);
    }, 300);
  });
}

export async function getFavoritePlayers(user_id: number): Promise<PlayerStats[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const favoritePlayers = userFavoritesData
        .filter(f => f.user_id === user_id && f.favorite_type === 'player')
        .map(f => f.favorite_id);

      const players = playerStatsData.filter(p => favoritePlayers.includes(p.Player));
      resolve(players as PlayerStats[]);
    }, 300);
  });
}

export async function deleteUserById(user_id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = userData.findIndex(user => user.user_id === user_id);
      if (userIndex > -1) {
        userData.splice(userIndex, 1);
      }
      resolve();
    }, 300);
  });
}



