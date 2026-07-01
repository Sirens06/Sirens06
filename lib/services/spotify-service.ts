import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  preview_url: string | null;
  popularity: number;
}

class SpotifyService {
  private accessToken = '';
  private tokenExpiresAt = 0;
  private clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? '';
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';

  private async ensureAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }
    return this.getAccessToken();
  }

  // Server-side only: requires SPOTIFY_CLIENT_SECRET
  async getAccessToken() {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    return this.accessToken;
  }

  async getRandomTrack(limit = 20): Promise<SpotifyTrack> {
    const token = await this.ensureAccessToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/browse/new-releases`, {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    const albums = response.data.albums.items;
    const randomAlbum = albums[Math.floor(Math.random() * albums.length)];

    const trackResponse = await axios.get(
      `${SPOTIFY_API_URL}/albums/${randomAlbum.id}/tracks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { ...trackResponse.data.items[0], album: randomAlbum };
  }

  async getPlaylistTracks(playlistId: string) {
    const token = await this.ensureAccessToken();
    const response = await axios.get(
      `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.items.map((item: any) => item.track);
  }

  async getAudioFeatures(trackId: string) {
    const token = await this.ensureAccessToken();
    const response = await axios.get(
      `${SPOTIFY_API_URL}/audio-features/${trackId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  getPreviewClip(track: SpotifyTrack) {
    if (!track.preview_url) {
      throw new Error('Track has no preview available');
    }
    return track.preview_url;
  }
}

export const spotifyService = new SpotifyService();
