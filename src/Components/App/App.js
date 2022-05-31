import React from 'react';
import Spotify from '../../util/Spotify';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Player } from '../Player/Player';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [
        { name: 'It\'s My Life', artist: 'Ituana', album: 'More Than a Woman', id: 4 },
        { name: 'Sunday Morning', artist: 'Maroon 5', album: 'Songs About Jane', id: 5 },
        { name: 'Something Just Like This - Bossa Mix', artist: 'Purple Sparks', album: 'Something Just Like This - Bossa Mix', id: 6 }
      ],
      playlistName: 'My Playlist',
      playlistTracks: [
        { name: 'Song 1', artist: 'Artist 1', album: 'Album 1', id: 1 },
        { name: 'Song 2', artist: 'Artist 2', album: 'Album 1', id: 2 },
        { name: 'Song 3', artist: 'Artist 3', album: 'Album 3', id: 3 }
      ],
      currentTrack: '3CcGoFaDVUnbaZ4TeDEe4n'
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.playTrack = this.playTrack.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState(
      {playlistTracks: this.state.playlistTracks.concat(track)}
    );
  }
  removeTrack (track) {
    this.setState(
      {playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)}
    );
  }
  playTrack(track) {
    this.setState({currentTrack: track.id});
    Spotify.playTrack(track);
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks);
    alert(`Playlist ${this.state.playlistName} has been saved!`);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(term) {
    console.log(`Searching for ${term}`);
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <Player track={this.state.currentTrack} />
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
              onPlay={this.playTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist } 
              onPlay={this.playTrack}
            />
          </div>
        </div>
      </div>   
    );
  }
}
