
/**
 * 
 * https://stackoverflow.com/questions/30842316/video-to-audio-file-convert-save-through-ffmpeg-in-node-js
 */

const ffmpeg = require('fluent-ffmpeg');

/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)        
 */
function convert(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .on('end', function() {              
            callback(null);
        }).on('error', function(err){
            console.log('error', err)  
            callback(err);
        }).run();
}

function copyWitoutAudio(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .noAudio().videoCodec('copy')
        .on('end', function() {              
            callback(null);
        }).on('error', function(err){
            console.log('error', err)
            callback(err);
        }).run();
}

function mergeMedia(aud, vid, output, callback) {
    ffmpeg()
        .input(aud)
        .input(vid)
        .output(output)
        .outputOptions(
          '-strict', '-2',
          '-map', '0:0',
          '-map', '1:0'
        ).on('end', function() {              
            callback(null);
        }).on('error', function(err){
            console.log('error', err)
            callback(err);
        }).run();
}

module.exports = {
    convert,
    copyWitoutAudio,
    mergeMedia,
}