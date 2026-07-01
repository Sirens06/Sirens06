import axios from 'axios';
import { MOCK_TRACKS, MockTrack } from '@/lib/mock-data';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  preview_url: string | null;
  popularity: number;
}

function mockToTrack(mock: MockTrack): SpotifyTrack {
  return {
    id: mock.id,
    name: mock.name,
    artists: [{ name: mock.artist }],
    album: { images: [{ url: mock.imageUrl }] },
    preview_url: mock.previewUrl,
    popularity: mock.popularity,
  };
}

function randomMockTrack(): SpotifyTrack {
  return mockToTrack(MOCK_TRACKS[Math.floor(Math.random() * MOCK_TRACKS.length)]);
}

class SpotifyService {
  private accessToken = '';
  private tokenExpiresAt = 0;
  private clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? '';
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';

  private get hasCredentials() {
    return Boolean(this.clientId && this.clientSecret);
  }

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

  // Falls back to curated mock tracks if credentials are missing or the API is unreachable.
  async getRandomTrack(limit = 20): Promise<SpotifyTrack> {
    if (!this.hasCredentials) return randomMockTrack();

    try {
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
    } catch (error) {
      console.warn('Spotify API unavailable, using mock track:', (error as Error).message);
      return randomMockTrack();
    }
  }

  // Falls back to mock tracks (ignoring playlistId) if credentials are missing or the API is unreachable.
  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    if (!this.hasCredentials) return MOCK_TRACKS.map(mockToTrack);

    try {
      const token = await this.ensureAccessToken();
      const response = await axios.get(
        `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.items.map((item: any) => item.track);
    } catch (error) {
      console.warn('Spotify API unavailable, using mock tracks:', (error as Error).message);
      return MOCK_TRACKS.map(mockToTrack);
    }
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
    return track.preview_url;
  }
}

export const spotifyService = new SpotifyService();
