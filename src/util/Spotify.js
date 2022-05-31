const clientId = '45956edb965b4ccd952b7f751b55173a';
const redirectUri = 'http://localhost:3000/';
let accessToken = '';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            console.log('accessToken: ', accessToken);
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken = null, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            console.log('accessToken: ', accessToken);
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async getUserId() {
        const accessToken = Spotify.getAccessToken();
        console.log(accessToken);
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse.id;
            }
        } catch (error) {
            console.log(error);
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();

        try {
            if (term) {
                const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    if (!jsonResponse.tracks) {
                        return [];
                    }
                    return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    async savePlaylist(name, tracks) {
        if (!name || !tracks) {
            return;
        }

        let trackUris = tracks.map(track => track.uri);
        console.log(trackUris);

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let playlistId = '';
        const userId = await Spotify.getUserId();
        console.log(userId);

        try {
            const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers,
                method: 'POST',
                body: JSON.stringify({ name })
            });
            if (createPlaylist.ok) {
                const createPlaylistResponse = await createPlaylist.json();
                playlistId = createPlaylistResponse.id;
                console.log(playlistId);
            }
        } catch (error) {
            console.log(error);
        }

        try {
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        } catch (error) {
            console.log(error);
        }
    },

    async getDeviceId() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
                headers
            });
            console.log(response);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse.devices[0].id;
            }
        } catch (error) {
            console.log(error);
        }
    },

    async playTrack(track) {
        const trackUri = track.uri;
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const deviceId = await Spotify.getDeviceId();


        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            headers,
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] })
        });
    }
};

export default Spotify;