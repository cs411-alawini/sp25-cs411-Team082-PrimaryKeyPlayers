import React, { useState } from 'react';
function App() {
  const [modals, setModals] = useState({
    addPlayer: false,
    addTeam: false,
    searchPlayer: false,
    removePlayer: false,
    removeTeam: false,
    searchTeam: false,
    addFavorite:false, // add new modal here (04.27)
  });
  const toggleModal = (modalName, show = true) => {
    setModals((prev) => ({ ...prev, [modalName]: show }));
  };
  const handleAddPlayerSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    alert("Player added successfully!");
    toggleModal("addPlayer", false);
    e.target.reset();
  };
  const handleAddTeamSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    alert("Team added successfully!");
    toggleModal("addTeam", false);
    e.target.reset();
  };
  const handleSearchPlayerSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    const searchName = e.target.searchPlayerName.value.trim();
    try {
      const res = await fetch(`/api/players?player_name=${encodeURIComponent(searchName)}`);
      const data = await res.json();
      if(!data || data.length === 0) {
        alert('No player is found');
      } else {
        const p = Array.isArray(data) ? data[0]:data;
        alert(`${p.Player}(${p.Team}) - PPG ${p.PTS}`);
      }
    } catch(err) {
      console.error(err);
      alert('Server Error: Please Check Your Console');
    }
    toggleModal("searchPlayer", false);
    e.target.reset();
  };
  const handleRemovePlayerSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    const playerId = e.target.removePlayerId.value;
    alert("Removing player with ID: " + playerId);
    toggleModal("removePlayer", false);
    e.target.reset();
  };
  const handleRemoveTeamSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    const teamId = e.target.removeTeamId.value;
    alert("Removing team with ID: " + teamId);
    toggleModal("removeTeam", false);
    e.target.reset();
  };
  const handleSearchTeamSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    const teamName = e.target.searchTeamName.value;
    alert("Searching for team: " + teamName);
    toggleModal("searchTeam", false);
    e.target.reset();
  };
  // add new handleaddfavoritesubmit here (04.27)
  const handleAddFavoriteSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    const userId = e.target.userId.value;
    const favoriteId = e.target.favoriteId.value;
    const favoriteType = e.target.favoriteType.value;
    alert(`Add Favorite:\nUserId:${userId}\nFavorite ID:${favoriteId}\nFavorite Type:${favoriteType}`);
    toggleModal("addFavorite", false);
    e.target.reset();
  };
  return (
    <div className="bg-gray-100 text-gray-900">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Primary Key Predictions</h1>
          <button className="bg-[#171719] text-white px-4 py-2 rounded hover:bg-[#2a2a2a]">
            Sign In
          </button>
        </header>
        {/* 2. Section for Game Analysis and Player Compare */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Game Analysis</h2>
            <p className="mb-4">
              Select a game to view detailed analysis and predictions.
            </p>
            <select className="w-full border rounded p-2">
              <option disabled defaultValue>
                Select a game
              </option>
              <option>Game 1</option>
              <option>Game 2</option>
              <option>Game 3</option>
            </select>
            <button className="mt-4 bg-[#171719] text-white px-4 py-2 rounded hover:bg-[#2a2a2a]">
              View Analysis
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Player Comparison</h2>
            <p className="mb-4">
              Compare player statistics to predict the outcomes!
            </p>
            <input
              type="text"
              placeholder="Search for a player"
              className="w-full border rounded p-2 mb-4"
            />
            <button className="bg-[#171719] text-white px-4 py-2 rounded hover:bg-[#2a2a2a]">
              Search
            </button>
          </div>
        </section>
        <section>
          {/* 3. Manage Data Section  */}
          <h2 className="text-2xl font-bold mb-6">Manage Your Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              id="addPlayerBox"
              onClick={() => toggleModal("addPlayer", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Add Player</h3>
              <p className="mt-2">Enter your player's details.</p>
            </div>
            <div
              id="addTeamBox"
              onClick={() => toggleModal("addTeam", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Add Team</h3>
              <p className="mt-2">Enter your team's information.</p>
            </div>
            <div
              id="searchPlayerBox"
              onClick={() => toggleModal("searchPlayer", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Search Player</h3>
              <p className="mt-2">Find a player by their name.</p>
            </div>
            <div
              id="removePlayerBox"
              onClick={() => toggleModal("removePlayer", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Remove Player</h3>
              <p className="mt-2">Remove a player's record.</p>
            </div>
            <div
              id="removeTeamBox"
              onClick={() => toggleModal("removeTeam", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Remove Team</h3>
              <p className="mt-2">Remove a team record.</p>
            </div>
            <div
              id="searchTeamBox"
              onClick={() => toggleModal("searchTeam", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Search Team</h3>
              <p className="mt-2">Find teams by name.</p>
            </div>  
            {/* Add "AddFavoriteBox" Button (04.27) */}
            <div
              id="addFavoriteBox"
              onClick={() => toggleModal("addFavorite", true)}
              className="bg-[#171719] text-white p-6 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">Add Favorite</h3>
              <p className="mt-2">Add yoru favorite player or team here.</p>
            </div>
          </div>
        </section>
      </div>
      {/* Modals */}
      {/* Add AddFavoriteBox Modal 04.27 */}
      {modals.addFavorite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded shadow p-6 w-full max-w-md">
          <h3 className="text-2xl font-bold mb-4">Add Favorite</h3>
          <form onSubmit={handleAddFavoriteSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="userId">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                className="w-full border rounded p-2"
                placeholder="Enter User ID"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="favoriteId">
                Favorite ID
              </label>
              <input
                type="text"
                id="favoriteId"
                name="favoriteId"
                className="w-full border rounded p-2"
                placeholder="Enter Team ID or Player Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="favoriteType">
                Favorite Type
              </label>
              <select
                id="favoriteType"
                name="favoriteType"
                className="w-full border rounded p-2"
                required
              >
                <option value = "">Select Type</option>
                <option value = "team">Team</option>
                <option value = "player">Player</option>
                </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toggleModal("addFavorite", false)}
                className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
      {modals.addPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add Player</h3>
            <form onSubmit={handleAddPlayerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="playerName">
                  Player Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  name="playerName"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="playerPosition">
                  Position
                </label>
                <input
                  type="text"
                  id="playerPosition"
                  name="playerPosition"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="teamId">
                  Team ID
                </label>
                <input
                  type="text"
                  id="teamId"
                  name="teamId"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("addPlayer", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modals.addTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add Team</h3>
            <form onSubmit={handleAddTeamSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="teamName">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="arena">
                  Arena
                </label>
                <input
                  type="text"
                  id="arena"
                  name="arena"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="teamIdInput">
                  Team ID
                </label>
                <input
                  type="text"
                  id="teamIdInput"
                  name="teamIdInput"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("addTeam", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modals.searchPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Search Player</h3>
            <form onSubmit={handleSearchPlayerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="searchPlayerName">
                  Player Name
                </label>
                <input
                  type="text"
                  id="searchPlayerName"
                  name="searchPlayerName"
                  className="w-full border rounded p-2"
                  placeholder="Enter player name"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("searchPlayer", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modals.removePlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Remove Player</h3>
            <form onSubmit={handleRemovePlayerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="removePlayerId">
                  Player ID
                </label>
                <input
                  type="text"
                  id="removePlayerId"
                  name="removePlayerId"
                  className="w-full border rounded p-2"
                  placeholder="Enter Player ID to remove"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("removePlayer", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modals.removeTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Remove Team</h3>
            <form onSubmit={handleRemoveTeamSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="removeTeamId">
                  Team ID
                </label>
                <input
                  type="text"
                  id="removeTeamId"
                  name="removeTeamId"
                  className="w-full border rounded p-2"
                  placeholder="Enter Team ID to remove"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("removeTeam", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modals.searchTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Search Team</h3>
            <form onSubmit={handleSearchTeamSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="searchTeamName">
                  Team Name
                </label>
                <input
                  type="text"
                  id="searchTeamName"
                  name="searchTeamName"
                  className="w-full border rounded p-2"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal("searchTeam", false)}
                  className="px-4 py-2 mr-4 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171719] text-white rounded hover:bg-[#2a2a2a]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
