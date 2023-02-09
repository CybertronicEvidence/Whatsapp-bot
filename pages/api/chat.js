import {
    Configuration,
    OpenAIApi
} from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

const message = req.body.Body || '';

const openaiCompletion = async (prompt = 'Who is Elon Musk?') => {
    const response = await openAI.createCompletion({
        prompt,
        max_tokens: 100,
        n: 1,
        stop: "",
        temperature: 0.5,
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export default async (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const completion = await openaiCompletion(text);
        return res.json({
            result: completion.choices[0].text,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};