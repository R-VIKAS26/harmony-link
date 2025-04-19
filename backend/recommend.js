import { logAnalytics } from './utils/logger.js';

import express from 'express';
import axios from 'axios';

const router = express.Router();

const moodFilters = {
    calm: features => features.valence < 0.5 && features.energy < 0.5,
    energetic: features => features.energy > 0.7,
    happy: features => features.valence > 0.6,
    sad: features => features.valence < 0.3,
    chill: features => features.danceability > 0.5 && features.energy < 0.5,
};

router.get('/', async (req, res) => {
    const token = req.session.access_token;
    if (!token) return res.status(403).json({ error: 'Unauthorized' });

    const mood = req.query.mood?.toLowerCase();

    try {
        const topTracksRes = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: 'Bearer ' + token }
        });

        const trackIds = topTracksRes.data.items.map(track => track.id).slice(0, 20);
        const audioFeaturesRes = await axios.get(
            'https://api.spotify.com/v1/audio-features?ids=' + trackIds.join(','),
            { headers: { Authorization: 'Bearer ' + token } }
        );

        const enriched = topTracksRes.data.items.map((track, i) => ({
            ...track,
            mood: audioFeaturesRes.data.audio_features[i]
        }));

        const filterFn = moodFilters[mood] || (() => true);
        const filteredTracks = enriched.filter(t => filterFn(t.mood));

        logAnalytics({ mood, resultCount: filteredTracks.length });
        res.json({ recommendations: filteredTracks });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Recommendation fetch failed' });
    }
});

export default router;
