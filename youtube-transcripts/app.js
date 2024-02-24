const express=require('express')
const app=express()
const path=require('path')
const axios=require('axios')
const FormData = require('form-data');


//for to pdf
const PDFDocument = require('pdfkit');
const url=require('url')


//modules required 
const fs=require('fs')
const YoutubeMp3Downloader=require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')

//deepgram api key
const deepgram = new Deepgram('ccb8597f37a0e52273575912ff27c96193d796cb')


const Path=path.join(__dirname,"./public");
app.set("views",Path);

app.set("view engine","ejs");

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.use(express.static('./public'))

//downloadinf function
const YD = new YoutubeMp3Downloader({
    ffmpegPath: ffmpeg,
    outputPath: './',
    youtubeVideoQuality: 'highestaudio'
  })
  

//routes
app.get('/',(req,res)=>{
    res.render('input')
})


//downloading pdf
app.post('/api/toText',(req,res)=>{
    const {name}=req.body
    console.log(typeof name)
    const inputUrl=url.parse(name,true)
    const data=inputUrl.query
    const id=data.v
    console.log(inputUrl)
    YD.download(id)
    YD.on('progress', data => {
        console.log(data.progress.percentage + '% downloaded')
        // res.send(data.progress.percentage + '% downloaded')
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
      
        const result = await deepgram.transcription
                .preRecorded(file, options)
                .catch(e => console.log(e))
        const transcript = result.results.channels[0].alternatives[0].transcript
      
        fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`)
        fs.unlinkSync(videoFileName)
         
         const textFile=`${videoFileName}.txt`
        //  console.log(textFile)

        const filePath=`./${textFile}`;
        let filedata='';
        const fd=fs.readFileSync(filePath, 'utf8');

        // create a document the same way as above
        const doc = new PDFDocument;
        // add your content to the document here, as usual
        doc.text(fd);
        // get a blob when you're done
        doc.pipe(fs.createWriteStream(`./public/pdf/${textFile}.pdf`));
        doc.end();

        //render chatting html page
        res.render('try')

})

})

                            //chat with pdf

            //functions for chat

const uploadPdfAndGetSourceId=async(filePath)=>{
  try {
    const formData=new FormData()
    
  } catch (error) {
    console.error('error while uploading pdf :',error.message);
    throw error
    
  }
}






app.post('/chat',(req,res)=>{
    const {ques}=req.body



})


app.listen(5000,(req,res)=>{
    console.log('server is listening on port 5000...')
})



