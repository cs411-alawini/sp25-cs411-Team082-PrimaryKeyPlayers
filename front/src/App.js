import React, { useState, useEffect } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchPlayerName, setSearchPlayerName] = useState('');
  const [searchTeamName, setSearchTeamName] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [favorites, setFavorites] = useState({ players: [], teams: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [topTeamsList, setTopTeamsList] = useState([]);
  const [topPtsList, setTopPtsList] = useState([]);

const fetchTopPts = async () => {
  try {
    const res = await fetch('/api/advanced/topPts');
    const data = await res.json();
    setTopPtsList(data);
  } catch (err) {
    console.error('Failed to fetch top players by points', err);
  }
};

useEffect(() => {
  if (currentPage === 'home') {
    fetchTopTeams();
    fetchTopPts(); 
  }
}, [currentPage]);


const fetchTopTeams = async () => {
  try {
    const res = await fetch('/api/advanced/topmin');
    const data = await res.json();
    setTopTeamsList(data);
  } catch (err) {
    console.error('Failed to fetch top teams', err);
  }
};

useEffect(() => {
  if (currentPage === 'home') {
    fetchTopTeams();
  }
}, [currentPage]);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/api/players/by-team/${selectedTeam.team_abbr}`)
        .then(res => res.json())
        .then(data => setTeamPlayers(data))
        .catch(err => console.error('Failed to fetch team players', err));
    }
  }, [selectedTeam]);

  const fetchAllPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
      setCurrentPage('players');
    } catch (err) {
      console.error('Failed to fetch players', err);
    }
  };

  const fetchAllTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      setTeams(data);
      setCurrentPage('teams');
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const searchPlayers = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/players?player_name=${encodeURIComponent(searchPlayerName)}`);
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Failed to search players', err);
    }
  };

  const searchTeams = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teams?team_name=${encodeURIComponent(searchTeamName)}`);
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Failed to search teams', err);
    }
  };

  //adding and viewing favorite teams / players

  const fetchFavoriteTeams = async () => {
    const res = await fetch(`/api/favorites/teams/${currentUser.userId}`);
    const data = await res.json();
    setTeams(data);
    setCurrentPage('teams');
  }
  const fetchFavoritePlayers = async () => {
    const res = await fetch(`/api/favorites/players/${currentUser.userId}`);
    const data = await res.json();
    setPlayers(data);
    setCurrentPage('players');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.userId) {
      setCurrentUser({ username, userId: data.userId });
      setShowLogin(false);
      alert('Login Successful!');
    } else {
      alert('Login Failed!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.message === 'User created successfully') {
      alert('Signup Successful! Now login.');
      setShowSignup(false);
    } else {
      alert('Signup Failed!');
    }
  };

  const addFavorite = async (favoriteId, favoriteType) => {
    if (!currentUser) {
      alert('Please log in to add favorites.');
      return;
    }
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.userId, favorite_id: favoriteId, favorite_type: favoriteType })
    });
    alert('Added to Favorites!');
  };

  const renderHome = () => (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold">Primary Key Predictions</h1>
  
      <button onClick={fetchAllPlayers} className="bg-blue-600 text-white px-6 py-3 rounded text-lg">
        View All Players
      </button>
      <button onClick={fetchAllTeams} className="bg-green-600 text-white px-6 py-3 rounded text-lg">
        View All Teams
      </button>
  
      {currentUser && (
        <>
          <button onClick={fetchFavoriteTeams} className="bg-purple-600 text-white px-6 py-3 rounded text-lg">
            View Favorite Teams
          </button>
          <button onClick={fetchFavoritePlayers} className="bg-purple-600 text-white px-6 py-3 rounded text-lg">
            View Favorite Players
          </button>
        </>
      )}
  
      {/* Top Players in Minutes Played and Points Section */}
      {topTeamsList.length > 0 && (
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Top Players in Minutes Played and Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTeamsList.map((player) => (
              <div
                key={player.player_id || player.PlayerAdditional}
                className="p-6 bg-white rounded shadow hover:shadow-lg cursor-pointer text-center"
                onClick={() => { setSelectedPlayer(player); setCurrentPage('playerDetail'); }}
              >
                <h3 className="text-2xl font-bold">{player.Player}</h3>
                <p className="text-gray-700">Team: {player.Team}</p>
                <p className="text-gray-700">Points Per Game: {player.PTS}</p>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Top Scoring Players Section */}
      {topPtsList.length > 0 && (
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Top Scoring Players (Most Points)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPtsList.map((player) => (
              <div
                key={player.player_id || player.PlayerAdditional}
                className="p-6 bg-white rounded shadow hover:shadow-lg cursor-pointer text-center"
                onClick={() => { setSelectedPlayer(player); setCurrentPage('playerDetail'); }}
              >
                <h3 className="text-2xl font-bold">{player.Player}</h3>
                <p className="text-gray-700">Team: {player.Team}</p>
                <p className="text-gray-700">Points Per Game: {player.PTS}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  

  const renderPlayers = () => (
    <div>
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <button onClick={() => setCurrentPage('home')} className="mt-6 bg-gray-600 text-white px-4 py-2 rounded">Back to Home</button>
      <form onSubmit={searchPlayers} className="mb-6">
        <input
          type="text"
          placeholder="Search Player"
          value={searchPlayerName}
          onChange={(e) => setSearchPlayerName(e.target.value)}
          className="border p-2 rounded mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.PlayerAdditional}
            className="p-4 bg-white rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => { setSelectedPlayer(player); setCurrentPage('playerDetail'); }}
          >
            <h2 className="font-bold text-xl">{player.Player}</h2>
            <p>Team: {player.Team}</p>
            <p>Position: {player.Pos}</p>
            <p>Year: {player.Year}</p>
            <button
              onClick={(e) => { e.stopPropagation();
              addFavorite(player.player_id, 'player');}}
              className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">Add to Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeams = () => (
    <div>
      <button onClick={() => setCurrentPage('home')} className="mt-6 bg-gray-600 text-white px-4 py-2 rounded">Back to Home</button>
      <form onSubmit={searchTeams} className="mb-6">
        <input
          type="text"
          placeholder="Search Team"
          value={searchTeamName}
          onChange={(e) => setSearchTeamName(e.target.value)}
          className="border p-2 rounded mr-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.team_id}
            className="p-4 bg-white rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => { setSelectedTeam(team); setCurrentPage('teamDetail'); }}
          >
            <h2 className="font-bold text-xl">{team.team_name}</h2>
            <p>City: {team.city}</p>
            <p>Arena: {team.arena}</p>
            <button
              onClick={(e) => { e.stopPropagation();
              addFavorite(team.team_id, 'team');}}
              className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">Add to Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
  
      <h2 className="text-xl font-semibold mt-4 mb-2">Favorite Players:</h2>
      <ul>
        {favorites.players.map(p => (
          <li key={p.PlayerAdditional}>{p.Player}</li>
        ))}
      </ul>
  
      <h2 className="text-xl font-semibold mt-6 mb-2">Favorite Teams:</h2>
      <ul>
        {favorites.teams.map(t => (
          <li key={t.team_id}>{t.team_name}</li>
        ))}
      </ul>
  
      <button onClick={() => setCurrentPage('home')} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">Back to Home</button>
    </div>
  );
  

  const renderAuthModal = (type) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4">{type === 'login' ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={type === 'login' ? handleLogin : handleSignup}>
          <input type="text" name="username" placeholder="Username" className="w-full border p-2 mb-4 rounded" required />
          <input type="password" name="password" placeholder="Password" className="w-full border p-2 mb-4 rounded" required />
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Submit</button>
        </form>
        <button onClick={() => { type === 'login' ? setShowLogin(false) : setShowSignup(false); }} className="mt-4 text-red-500">Cancel</button>
      </div>
    </div>
  );

  const renderPlayerDetail = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{selectedPlayer.Player}</h2>
      <p>Team: {selectedPlayer.Team}</p>
      <p>Position: {selectedPlayer.Pos}</p>
      <p>Age: {selectedPlayer.Age || 'N/A'}</p>
      <p>Games Played: {selectedPlayer.G || 'N/A'}</p>
      <p>Points Per Game: {selectedPlayer.PTS || 'N/A'}</p>
      <p>Rebounds Per Game: {selectedPlayer.TRB || 'N/A'}</p>
      <p>Assists Per Game: {selectedPlayer.AST || 'N/A'}</p>
      <p>Field Goal Percentage: {selectedPlayer["FG%"] || 'N/A'}</p>
      <p>Three Point Percentage: {selectedPlayer["3P%"] || 'N/A'}</p>
      <p>Awards: {selectedPlayer.Awards || 'None'}</p>

      <button
              onClick={(e) => { e.stopPropagation();
              addFavorite(selectedPlayer.player_id, 'player');}}
              className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">Add to Favorites
            </button>
      <button
        onClick={() => setCurrentPage('players')}
        className="mt-4 ml-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back to Players
      </button>
    </div>
  );

  const renderTeamDetail = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{selectedTeam.team_name}</h2>
      <p>City: {selectedTeam.city}</p>
      <p>Arena: {selectedTeam.arena}</p>
      <h3 className="text-xl font-bold mt-6 mb-2">Players on this Team:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamPlayers.map(player => (
          <div
            key={player.PlayerAdditional}
            className="p-4 bg-white rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => { setSelectedPlayer(player); setCurrentPage('playerDetail'); }}
          >
            <h4 className="font-bold">{player.Player}</h4>
            <p>Position: {player.Pos}</p>
            <p>Points Per Game: {player.PTS}</p>
          </div>
        ))}
      </div>
      <button
        onClick={(e) => { e.stopPropagation();
        addFavorite(selectedTeam.team_id, 'team');}}
        className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">Add to Favorites
      </button>
      <button
        onClick={() => setCurrentPage('teams')}
        className="mt-4 ml-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back to Teams
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">PKP</h1>
        <div className="flex gap-4">
          {!currentUser && <button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>}
          {!currentUser && <button onClick={() => setShowSignup(true)} className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>}
          {currentUser && <span className="text-lg">Welcome, {currentUser.username}</span>}
        </div>
      </header>
      {currentPage === 'home' && renderHome()}
      {currentPage === 'players' && renderPlayers()}
      {currentPage === 'teams' && renderTeams()}
      {currentPage === 'favorites' && renderFavorites()}
      {showLogin && renderAuthModal('login')}
      {showSignup && renderAuthModal('signup')}
      {currentPage === 'playerDetail' && selectedPlayer && renderPlayerDetail()}
      {currentPage === 'teamDetail' && selectedTeam && renderTeamDetail()}
    </div>
  );
}

export default App;


