const fs = require('fs')
const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')

const deepgram = new Deepgram('ccb8597f37a0e52273575912ff27c96193d796cb')
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: './',
  youtubeVideoQuality: 'highestaudio'
})

YD.download('Q4kR6vM8xvQ')

YD.on('progress', data => {
  console.log(data.progress.percentage + '% downloaded')
})

YD.on('finished', async (err, video) => {
  const videoFileName = video.file
  console.log(`Downloaded ${videoFileName}`)

  const file = {
    buffer: fs.readFileSync(videoFileName),
    mimetype: 'audio/mp3'
  }
  const options = {
    punctuate: true
  }

  const result = await deepgram.transcription.preRecorded(file, options).catch(e => console.log(e))
  const transcript = result.results.channels[0].alternatives[0].transcript

  fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`)
  fs.unlinkSync(videoFileName)
})
