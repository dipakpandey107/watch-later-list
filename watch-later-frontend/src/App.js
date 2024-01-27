// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const fetchWatchLaterList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/watch-later');
      setWatchLaterList(response.data);
    } catch (error) {
      console.error('Error fetching watch later list:', error);
    }
  };

  useEffect(() => {
    fetchWatchLaterList();
    // Set dummy genres and platforms
    setGenres(['Comedy', 'Action', 'Drama', 'Sci-Fi']);
    setPlatforms(['Netflix', 'Amazon Prime', 'Hulu', 'Disney+']);
  }, []);

  return (
    <div className="App">
      <WatchList
        watchLaterList={watchLaterList}
        setFormVisible={setFormVisible}
        setEditMode={setEditMode}
        setFormData={setFormData}
        fetchWatchLaterList={fetchWatchLaterList}
      />
      <WatchForm
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        editMode={editMode}
        formData={formData}
        fetchWatchLaterList={fetchWatchLaterList}
        genres={genres}
        platforms={platforms}
      />
    </div>
  );
};

// WatchList component

const WatchList = ({ watchLaterList, setFormVisible, setEditMode, setFormData, fetchWatchLaterList }) => {
  const handleEditItem = (item) => {
    setFormVisible(true);
    setEditMode(true);
    setFormData(item);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/watch-later/${id}`);
      fetchWatchLaterList();
    } catch (error) {
      console.error('Error deleting watch later item:', error);
    }
  };

  const handleOpenLink = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="watch-list-container">
      <h1>Watch Later List</h1>
      <table className="watch-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Platform</th>
            <th>Genre</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {watchLaterList.map((item) => (
            <tr key={item._id}>
              <td>
                <button className="link-button" onClick={() => handleOpenLink(item.link)}>
                  {item.name}
                </button>
              </td>
              <td>{item.platform}</td>
              <td>{item.genre}</td>
              <td>
                <button className="link-button" onClick={() => handleOpenLink(item.link)}>
                  {item.link}
                </button>
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEditItem(item)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteItem(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-button" onClick={() => setFormVisible(true)}>
        Add
      </button>
    </div>
  );
};


const WatchForm = ({ formVisible, setFormVisible, editMode, formData, fetchWatchLaterList, genres, platforms }) => {
  const [watchLaterData, setWatchLaterData] = useState({
    name: '',
    platform: '',
    genre: '',
    link: '',
  });

  useEffect(() => {
    if (editMode) {
      setWatchLaterData(formData);
    } else {
      setWatchLaterData({
        name: '',
        platform: '',
        genre: '',
        link: '',
      });
    }
  }, [editMode, formData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await axios.put(`http://localhost:3001/api/watch-later/${formData._id}`, watchLaterData);
      } else {
        await axios.post('http://localhost:3001/api/watch-later', watchLaterData);
      }

      setFormVisible(false);
      fetchWatchLaterList();
    } catch (error) {
      console.error('Error submitting watch later item:', error);
    }
  };
  const handleCancel = () => {
    // Reset the form fields when cancel is clicked
    setWatchLaterData({
      name: '',
      platform: '',
      genre: '',
      link: '',
    });
    setFormVisible(false);
  };

  return (
    <div className="watch-form" style={{ display: formVisible ? 'block' : 'none' }}>
      <h2>{editMode ? 'Edit Watch Later Item' : 'Add Watch Later Item'}</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={watchLaterData.name} onChange={(e) => setWatchLaterData({ ...watchLaterData, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Platform:</label>
          <select
            value={watchLaterData.platform}
            onChange={(e) => setWatchLaterData({ ...watchLaterData, platform: e.target.value })}
          >
            <option value="">Select Platform</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <select
            value={watchLaterData.genre}
            onChange={(e) => setWatchLaterData({ ...watchLaterData, genre: e.target.value })}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Link:</label>
          <input type="text" value={watchLaterData.link} onChange={(e) => setWatchLaterData({ ...watchLaterData, link: e.target.value })} />
        </div>
        <div className="button-group">
          <button type="submit">{editMode ? 'Update' : 'Add'}</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default App;
