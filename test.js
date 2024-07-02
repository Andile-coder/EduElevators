const express = require("express");
const app = express();
const port = 3000;
const twilio = require("twilio");
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));

const mediaUrls = {
  image:
    "https://www.standardbank.co.za/file_source/SBG/Assets/Img/SA/Newsroom/SB_UniHack_600_x_300.jpg",
  pdf: "https://drive.google.com/file/d/1NhK0BN7MKJg3HUWQ7mY9_1hh_rEBqMap/view?usp=drive_link", // Replace with your image URL
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  // Extract sender's phone number from the request body
  const senderPhoneNumber = req.body.From;
  console.log("Sender Phone Number:", senderPhoneNumber);
  const accountSid = process.env.ACCOUNTSID;
  const authToken = process.env.AUTHTOKEN;
  const client = new twilio(accountSid, authToken);

  const incomingMessage = req.body.Body.trim().toLowerCase();

  let responseMessage;
  let mediaUrl = null;

  const responses = {
    goals:
      "Our goals are to revolutionize education with AI by creating personalized learning paths. Our target market includes students, educators, and schools.",
    problem:
      "The current problem in education is the lack of personalized learning paths and inadequate performance tracking.",
    solution:
      "Our solution is an AI platform that integrates with existing school systems to provide personalized learning and detailed performance tracking.",
    reason:
      "We proposed this solution to address the gaps in personalized education and to leverage AI for better learning outcomes.",
    funding:
      "Our funding approach involves seeking investments from educational grants, venture capital, and partnerships with educational institutions.",
    list: "Please choose one of the following options:\n1. Show our goals and target market\n2. Read detailed problem description\n3. Read the solution we proposed\n4. Why we proposed this solution\n5. Read our funding approach idea\n6. Resend the list\n7. GitHub code\n8. Send image",
    github: "You can find our GitHub code at: https://github.com/your-repo",
    image: "Happy UniHack2024", // Placeholder for image response
  };
  switch (incomingMessage) {
    case "1":
    case "show our goals our target market":
      responseMessage = responses.goals;
      break;
    case "2":
    case "read detailed problem description":
      responseMessage = responses.problem;
      break;
    case "3":
    case "read the solution we proposed":
      responseMessage = responses.solution;
      break;
    case "4":
    case "why we proposed this solution":
      responseMessage = responses.reason;
      break;
    case "5":
    case "read our funding approach idea":
      responseMessage = responses.funding;
      break;
    case "6":
    case "resend the list":
      responseMessage = responses.list;
      break;
    case "7":
    case "github code":
      responseMessage = responses.github;
      break;
    case "8":
    case "send image":
      responseMessage = responses.image;
      mediaUrl = mediaUrls.image;
      break;
    case "9":
    case "send pdf":
      responseMessage = responses.pdf;
      mediaUrl = mediaUrls.pdf;
      break;
    default:
      responseMessage =
        "I'm sorry, I didn't understand that. Please choose a valid option from the list:\n" +
        responses.list;
      break;
  }

  // Send a response message back to the sender
  const messageOptions = {
    body: responseMessage,
    to: `${senderPhoneNumber}`,
    from: "whatsapp:+14155238886",
  };

  if (mediaUrl) {
    messageOptions.mediaUrl = mediaUrl;
  }
  client.messages
    .create(messageOptions)
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
