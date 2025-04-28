import pool from './connections';
export async function getFavoritePlayers(user_id:number) {
    const[rows] = await pool.query(
        'SELECT favorite_id, favorite_type FROM user_favorite WHERE user_id = ?',
        [user_id]
    );
    return rows;
}
