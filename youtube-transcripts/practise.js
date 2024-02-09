const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const formData = new FormData();
formData.append(
  "file",
  fs.createReadStream("./Demo3.pdf")
);

const options = {
  headers: {
    "x-api-key": "sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5",
    ...formData.getHeaders(),
  },
};
const srcId = '';
const response  = async(await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, options));
//   .then((response) => {
//     console.log("Source ID:", response.data.sourceId);
//     srcId = response.data.sourceId;
//   })
//   .catch((error) => {
//     console.log("Error:", error.message);
//     console.log("Response:", error.response.data);
//   });
// console.log(`hellloooo  ${srcId}`);
  const config = {
    headers: {
      "x-api-key": "sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5",
      "Content-Type": "application/json",
    },
  };
  
  const data = {
    sourceId: response.data.sourceId,
    messages: [
      {
        role: "user",
        content: "give an appropriate title for the passage.",
      },
    ],
  };

  axios
  .post("https://api.chatpdf.com/v1/chats/message", data, config)
  .then((response) => {

    console.log("Result:", response.data.content);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    console.log("Response:", error.response.data);
  });
  