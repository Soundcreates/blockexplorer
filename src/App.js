import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
const RECIEVER_ADDRESS = "0xD77389d560F37c92880B09438Fe196Cb4da1947e";

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        //handling balance bigint problem
        const bigIntBalance = await alchemy.core.getBalance(accounts[0]);
        const balanceFormatted = Utils.formatEther(bigIntBalance);
        setBalance(balanceFormatted);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const sendEth = async () => {
    if (!address) return;
    console.log("Sending...");
    const bigintamount = Utils.parseEther(amount);

    try {
      const txRaw = await alchemy.core.sendTransaction({
        to: RECIEVER_ADDRESS,
        value: bigintamount,
      });
      console.log(txRaw);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  return (
    <div className="App">
      <h1>Block number: {blockNumber}</h1>
      <button onClick={connectWallet}>Connect wallet</button>
      <h1>Address: {address}</h1>
      <h1>Balance: {balance}</h1>
      <div>
        <p>Send to:</p>
        <input type="text" value={RECIEVER_ADDRESS} readOnly />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={() => sendEth()}>Send</button>
      </div>
    </div>
  );
}

export default App;
