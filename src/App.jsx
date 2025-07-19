
import { useState } from 'react';
import axios from 'axios'
import { ethers } from 'ethers'
import Grid from './Grid';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setloading] = useState(false)
  const [ensName, setEnsName] = useState(null)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setUserAddress(accounts[0])

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const name = await provider.lookupAddress(userAddress)

        if (name) {
          setEnsName(name)
        } else {
          setEnsName(null)
        }

        console.log('Found account', accounts[0])
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('Please install Metamask...')
    }
  }

  async function getTokenBalance() {
    // Getting the response from a proxy server
    setloading(true)
    try {
      const response = await axios.post('http://localhost:3001/token-balances', 
        {address: userAddress}
      )

      setResults(response.data.balances)
      setTokenDataObjects(response.data.tokenDataObject)
      setHasQueried(true)
    } catch (error) {
      console.error(error);
      
    } finally{
      setloading(false)
    }
   
  }
  return (
    <div className='relative flex flex-col justify-center items-center w-full min-h-screen bg-gray-100'>
      <div className='flex items-center gap-4 flex-col w-2xl self-center py-5 rounded-2xl bg-white '>
          <h1 className='font-bold text-3xl'>ERC-20 TOKEN INDEXER</h1>
          <div className='flex pb-10 gap-1 w-full border-b-2 border-b-gray-200 px-12'>
            <input 
              className=' p-2 rounded-xl outline-0 w-full border-gray-200 border-2'
              type="text"
              placeholder='Enter address...'
              onChange={e => setUserAddress(e.target.value)}
              value={userAddress} />
              {
                !userAddress ? (
                  <button className='bg-blue-700 py-3 w-55 px-5 text-white text-lg rounded-xl cursor-pointer'
                   onClick={connectWallet}>Connect Wallet</button>
                ) : (
                  <button
                    disabled={loading}
                    onClick={getTokenBalance}
                    className='bg-blue-700 py-3 px-5 w-55 text-white text-lg rounded-xl cursor-pointer'>
                    {loading ? 'Loading...' : 'Search'}
                  </button>
                )
              }
          </div>

          <div className='w-full px-12'>
            <h2 className='my-2 font-medium text-2xl'>Token Balances</h2>
            <div className='flex justify-between text-gray-600 items-center font-semibold text-lg bg-gray-100 py-4 px-6 rounded-l'>
              <div className='flex gap-11'>
                <p>#</p>
                <p>Token</p>
              </div>
              <p>Balance</p>
            </div>
            { hasQueried && <Grid results={results} tokenDataObjects={tokenDataObjects} />}
        </div>
      </div>
      
    </div>
  );
}

export default App;
