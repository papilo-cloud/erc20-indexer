import express from 'express'
import cors from 'cors'
import { Alchemy, Network, Utils } from 'alchemy-sdk'
import pLimit from 'p-limit'
import dotenv from 'dotenv'

dotenv.config()
// 10 concurrent metadata requests, to avoid being throttled
const limit = pLimit(10)

const app = express()
app.use(cors())
app.use(express.json())

const config = {
    apiKey: process.env.API_KEY,
    network: Network.ETH_SEPOLIA
}
const alchemy = new Alchemy(config);

app.post('/token-balances', async (req, res) => {
    const {address} = req.body
    if(!address) {
        return res.status(400).json({
            error: 'Missing Address'
        })
    }
    try {
        const balances = await alchemy.core.getTokenBalances(address)
        const nonZeroTokens = balances.tokenBalances.filter(t => 
            (t.tokenBalance) > 0
        )
        // console.log( (nonZeroTokens))

        const metadataCache = {};
        async function getMetadataCached(address) {
            if (metadataCache[address]) {
                return metadataCache[address]
            }
            const metadata = await alchemy.core.getTokenMetadata(address)
            metadataCache[address] = metadata;
            return metadata
        }
        const tokenMetaData = nonZeroTokens.map(t => 
            limit(() => getMetadataCached(t.contractAddress))
        )
        const tokenDataObject = await Promise.all(tokenMetaData)

        res.json({
            balances,
            tokenDataObject
        })

    } catch (err) {
        console.error('Alchemy proxy error:', err.response?.data || err.message);
        res.status(500).json({
            error: 'Failed to fetch from Alchemy'
        })
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})