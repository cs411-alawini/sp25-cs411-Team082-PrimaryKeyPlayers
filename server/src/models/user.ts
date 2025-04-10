export interface user {
    user_id : number;
    username: string;
    email: string;
    password: string;
}

export interface userFavorites {
    user_id: number;
    favorite_id: string;
    favorite_type: string; // 'team' or 'player'
}