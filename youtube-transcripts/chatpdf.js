const express = require('express');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = 3000;

// Function to upload PDF file and return source ID
const uploadPDFAndGetSourceId = async (filePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const options = {
            headers: {
                'x-api-key': 'sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5', // Replace with your API key
                ...formData.getHeaders(),
            },
        };

        const response = await axios.post('https://api.chatpdf.com/v1/sources/add-file', formData, options);
        return response.data.sourceId;
    } catch (error) {
        console.error('Error uploading PDF:', error.message);
        throw error;
    }
};

// Function to send a message to the PDF chat
const sendMessageToPDF = async (sourceId, message) => {
    try {
        const config = {
            headers: {
                'x-api-key': 'sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5', // Replace with your API key
                'Content-Type': 'application/json',
            },
        };

        const data = {
            sourceId: sourceId,
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        };

        const response = await axios.post('https://api.chatpdf.com/v1/chats/message', data, config);
        return response.data.content;
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }
};

// // Route for streaming response messages
// app.get('/stream-messages/:sourceId', async (req, res) => {
//     const sourceId = req.params.sourceId;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     // Set up axios request
//     const config = {
//         headers: {
//             'x-api-key': 'sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5', // Replace with your API key
//             'Content-Type': 'application/json',
//         },
//         responseType: 'stream',
//     };

//     const data = {
//         stream: true,
//         sourceId: sourceId,
//         messages: [
//             {
//                 role: 'user',
//                 content: 'give an appropriate title for this passage',
//             },
//         ],
//     };

//     try {
//         const response = await axios.post('https://api.chatpdf.com/v1/chats/message', data, config);

//         response.data.on('data', (chunk) => {
//             const text = chunk.toString();
//             res.write(`data: ${text}\n\n`);
//         });

//         response.data.on('end', () => {
//             console.log('End of stream');
//             res.end();
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.end();
//     }
// });

// Upload PDF file, send message, and start server
const startServer = async () => {
    try {
        const sourceId = await uploadPDFAndGetSourceId('./Demo3.pdf'); // Replace with your PDF file path
        console.log('PDF uploaded successfully. Source ID:', sourceId);
        let question = 'give me 5 bullet points about what we learnt in this keep the formating';
        const messageResult = await sendMessageToPDF(sourceId,question);
        console.log('\n\nMessage Result:', messageResult);

        // Start the server after uploading PDF and sending message
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Start the server
startServer();
