import {
    Configuration,
    OpenAIApi
} from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);
export default async function handler(req, res) {
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    let messageResponse = new MessagingResponse();


    const sentMessage = req.body.Body || '';
    let replyToBeSent = "";
    if (sentMessage.trim().length === 0) {
        replyToBeSent = "We could not get your message. Please try again";
    } else {
        try {
            const completion = await openAI.createCompletion({
                model: "davinci:ft-personal:2nd-test-2023-02-13-04-32-32", // required
                prompt: req.body.Body, // completion based on this
                temperature: 0.9, //
                n: 1,
                max_tokens: 2048,
                top_p: 1,
                best_of: 1
                // frequency_penalty: 0.45
                // stop: "."
            });
            replyToBeSent = removeIncompleteText(completion.data.choices[0].text)

        } catch (error) {
            if (error.response) {
                replyToBeSent = "There was an issue with the server"
            } else { // error getting response
                replyToBeSent = "An error occurred during your request.";
            }
        }
    }

    messageResponse.message(replyToBeSent);
    // send response
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(messageResponse.toString());
}

function removeIncompleteText(inputString) {
    const match = inputString.match(/\b\.\s\d+/g);
    const removeAfter = match ? inputString.slice(0, inputString.lastIndexOf(match[match.length - 1])) : inputString;
    return removeAfter
}