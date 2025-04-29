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

  const addFavorite = async (userId, favoriteId, favoriteType) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, favorite_id: favoriteId, favorite_type: favoriteType }),
      });
      alert('Added to favorites!');
    } catch (err) {
      console.error('Failed to add favorite', err);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold">Primary Key Predictions</h1>
      <button onClick={fetchAllPlayers} className="bg-blue-600 text-white px-6 py-3 rounded text-lg">View All Players</button>
      <button onClick={fetchAllTeams} className="bg-green-600 text-white px-6 py-3 rounded text-lg">View All Teams</button>
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
          </div>
        ))}
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
        onClick={() => addFavorite(1, selectedPlayer.Player, 'player')}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        Add to Favorites
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
        onClick={() => addFavorite(1, selectedTeam.team_id, 'team')}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        Add to Favorites
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
      {currentPage === 'home' && renderHome()}
      {currentPage === 'players' && renderPlayers()}
      {currentPage === 'teams' && renderTeams()}
      {currentPage === 'playerDetail' && selectedPlayer && renderPlayerDetail()}
      {currentPage === 'teamDetail' && selectedTeam && renderTeamDetail()}
    </div>
  );
}

export default App;


