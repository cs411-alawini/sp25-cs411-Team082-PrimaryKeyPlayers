import pool from './connections';
import { getFavoriteTeams } from './database';
export async function getFavoritePlayers(user_id:number) {
    const[rows] = await pool.query(
        'SELECT favorite_id, favorite_type FROM user_favorite WHERE user_id = ?',
        [user_id]
    );
    return rows;
}

export async function addFavoritePlayer(user_id:number, favorite_type:string) {
    const[rows] = await pool.query(
        'INSERT INTO user_favorite (user_id, favorite_type) VALUES (?, ?)',
        [user_id, favorite_type]
    );
    return rows;
}

export async function deleteFavoritePlayer(user_id:number, favorite_id:number) {
    const[rows] = await pool.query(
        'DELETE FROM user_favorite WHERE user_id = ? AND favorite_id = ?',
        [user_id, favorite_id]
    );
    return rows;
}


