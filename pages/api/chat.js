import {
    Configuration,
    OpenAIApi
} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);
export default async function (req, res) {
    let reply = '';
    const message = req.body.Body || '';
    console.log(message);
    try {
        const response = await openAI.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.Body,
            max_tokens: 256,
            temperature: 0.5,
        });
        reply = response.data.choices[0].text;
    } catch (error) {
        reply = 'There was an issue not caused by you'
    }

    // send response
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(reply.toString());
    // res.status(200).json({ result: response.data.choices[0].text });
    // console.log(response.data.choices[0].text)
};


// Note: This assumes you have already installed the openai package.





// export default async function handler(req, res) {
//     const { message } = req.body.Body
//     const response = await openAI.createCompletion({
//         model: "text-davinci-003", // required
//         prompt: `${message}`, // completion based on this
//         temperature: 0.6, //
//         n: 1,
//         max_tokens: 50,
//         // stop: "."
//     });
//     // res.status(200).json(response.data.choices[0].text)
//     // console.log(response.data.choices[0].text)

//     res.writeHead(200, {
//         'Content-Type': 'application/json'
//     });
//     res.end(response.data.choices[0].text);
// }