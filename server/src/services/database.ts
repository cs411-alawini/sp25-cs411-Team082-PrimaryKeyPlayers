import { Teams } from '../models/teams';
import { PlayerStats } from '../models/players';
import { user } from '../models/user';
import { userFavorites } from '../models/user';
import pool from './connections';
import { RowDataPacket } from 'mysql2';

import { playerStatsData } from '../../../data/playerStatsData';
import { teamData } from '../../../data/teamData';
import { userData } from '../../../data/userData';
import { userFavoritesData } from '../../../data/userFavoritesData';

export async function getAllPlayers(): Promise<PlayerStats[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM players ORDER BY Rk ASC');
  return rows as PlayerStats[];
}

export async function getAllTeams(): Promise<Teams[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM teams');
  return rows as Teams[];
}

export async function getTeamByName(team_name: string): Promise<Teams[]> {
  const query = 'SELECT * FROM teams WHERE LOWER(team_name) LIKE ?';
  const [rows] = await pool.query<RowDataPacket[]>(query, [`%${team_name.toLowerCase()}%`]);
  return rows as Teams[];
}

export async function getTeamById(team_id: string): Promise<Teams[]> {
  const query = 'SELECT * FROM teams WHERE LOWER(team_id) = ?';
  const [rows] = await pool.query<RowDataPacket[]>(query, [team_id.toLowerCase()]);
  return rows as Teams[];
}

export async function getPlayerByName(player_name: string): Promise<PlayerStats[]> {
  const query = 'SELECT * FROM players WHERE LOWER(Player) LIKE ?';
  const [rows] = await pool.query<RowDataPacket[]>(query, [`%${player_name.toLowerCase()}%`]);
  return rows as PlayerStats[];
}

export async function getAllUsers(): Promise<user[]> { 
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
  return rows as user[];
}

export async function addUser(newUser: Omit<user, "user_id">): Promise<user> {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const [result] = await pool.query<any>(query, [newUser.username, newUser.email, newUser.password]);
  return {
    user_id: result.insertId,
    ...newUser,
  };
}

export async function addFavorite(
  user_id: number,
  favorite_id: string,
  favorite_type: 'player' | 'team'
): Promise<userFavorites> {
  const query = 'INSERT INTO user_favorite (user_id, favorite_id, favorite_type) VALUES (?, ?, ?)';
  await pool.query(query, [user_id, favorite_id, favorite_type]);
  return { user_id, favorite_id, favorite_type };
}

export async function getFavoriteTeams(user_id: number): Promise<Teams[]> {
  const query = `
    SELECT t.* FROM teams t
    JOIN user_favorite uf ON t.team_id = uf.favorite_id
    WHERE uf.user_id = ? AND uf.favorite_type = 'team'
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [user_id]);
  return rows as Teams[];
}

export async function getFavoritePlayers(user_id: number): Promise<PlayerStats[]> {
  const query = `
    SELECT p.* FROM players p
    JOIN user_favorite uf ON p.Player = uf.favorite_id
    WHERE uf.user_id = ? AND uf.favorite_type = 'player'
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [user_id]);
  return rows as PlayerStats[];
}

export async function deletePlayer(player_id: number): Promise<void> {
  const query = 'DELETE FROM players WHERE Rk=?';
  await pool.query(query,[player_id]);
}

export async function deleteUserById(user_id: number): Promise<void> {
  const query = 'DELETE FROM user WHERE user_id = ?';
  await pool.query(query, [user_id]);
}

export const removeFavorite = async (favorite_id: number) => {
  await pool.query('DELETE FROM favorites WHERE favorite_id = ?', [favorite_id]);
};

//newly added addfavoritewithlog to satisfy 1 transaction requirement 0427
export async function addFavoriteWithLog(user_id:number,favorite_id: string,favorite_type:'player' | 'team'): Promise <void> {
    const connection = await pool.getConnection();
    try{
      await connection.beginTransaction();
      await connection.query(
        ` INSERT INTO user_favorite(user_id, favorite_id, favorite_type) VALUES(?,?,?)`,
        [user_id,favorite_id,favorite_type]
      );
      await connection.query(
        ` INSERT INTO favorite_log(user_id, favorite_id, favorite_type, action) VALUES(?,?,?,?)`,
        [user_id,favorite_id,favorite_type,'Added']
      );
      await connection.commit();
    } catch(err){
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
}
// Update backend call stored procedure for add user (4.28)
export async function addUserWithProcedure(username: string, email:string, password:string): Promise<void> {
  const query = 'CALL sp_addUser(?,?,?)';
  await pool.query(query,[username,email,password]);
}
export async function addPlayer(player_name: string, position:string, team_id:string) {
  const[result] = await pool.query(
    'INSERT INTO player (player_name, position, team_id) VALUES(?,?,?)',
    [player_name, position, team_id]
  );
  return result;
}

