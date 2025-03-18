const yts = require('yt-search')

async function YoutubeSearch(query) {
    try {
        const result = await yts(query);
        if (!result.videos.length) return [];

        return result.videos.slice(0, 5).map(video => ({
            title: video.title,
            url: video.url,
            duration: video.timestamp,
            views: video.views
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}
