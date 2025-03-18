const sharp = require('sharp');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

/**
 * 
 * @param {*} media webp input
 * @param {*} options options
 * @returns 
 */
async function webp2img(media, options = {}) {
    const { format = 'png', outputPath = 'output.png' } = options;

    return new Promise((resolve, reject) => {
        sharp(media)
            .toFormat(format)
            .toFile(outputPath, (err, info) => {
                if (err) reject(err);
                else resolve(outputPath);
            });
    });
}

async function webp2vid(media, options = {}) {
    const { format = 'mp4', outputPath = 'output.mp4' } = options;

    return new Promise((resolve, reject) => {
        ffmpeg(media)
            .inputFormat('webp')
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}

module.exports = {
    webp2img,
    webp2vid
}