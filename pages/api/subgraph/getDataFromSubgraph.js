
const axios = require("axios");

const apiKey = process.env.API_KEY;
const subgraphURL = 'https://api.studio.thegraph.com/query/72239/hoody-base/version/latest';

export default async function getDataFromSubgraph(req, res) {
    const { query } = req.body;

    try {
        const result = await axios.post(subgraphURL, {
            query,
        });

        res.status(200).json({
            isSuccess: true,
            data: result.data.data,
        });
        return { isSuccess: true, data: result.data.data };
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            data: "",
        });
    }
}
