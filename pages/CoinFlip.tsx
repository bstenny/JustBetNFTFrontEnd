import { useEffect, useState } from "react";
import Web3 from "web3";
import { CoinFlipGameLINK } from "../lib/contracts/CoinFlipGameLINK";

const CoinFlip = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [coinChoice, setCoinChoice] = useState(false);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [contractOwner, setContractOwner] = useState("");
  const [minimumBet, setMinimumBet] = useState(0);

  const loadContract = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      const contract = new web3.eth.Contract(
          CoinFlipGameLINK.abi,
          contractAddress
      );
      const minimumBet = await contract.methods.minimumBet().call();
      const contractOwner = await contract.methods.owner().call();
      setContract(contract);
      setMinimumBet(minimumBet);
      setContractOwner(contractOwner);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setContractAddress("0xabc..."); // Your deployed contract address goes here
    loadContract();
  }, []);

  const handleCoinChoiceChange = (event) => {
    setCoinChoice(event.target.value === "heads");
  };

  const handleBetAmountChange = (event) => {
    setBetAmount(event.target.value);
  };

  const placeBet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const betAmountInWei = new Web3.utils.toWei(betAmount, "ether");
      await contract.methods
          .placeBet(coinChoice)
          .send({ from: accounts[0], value: betAmountInWei });
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div>
        <h1>Coin Flip Game</h1>
        <div>
          <label htmlFor="bet-amount">Bet Amount (in Ether)</label>
          <input
              type="number"
              min={minimumBet / 1e18}
              step={0.01}
              onChange={handleBetAmountChange}
          />
        </div>
        <div>
          <label htmlFor="coin-choice">Choose Heads or Tails:</label>
          <select id="coin-choice" onChange={handleCoinChoiceChange}>
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        </div>
        <button onClick={placeBet}>Place Bet</button>
      </div>
  );
};

export default CoinFlip;
