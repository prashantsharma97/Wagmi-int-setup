/** @format */

import {
  getAccount,
  sendTransaction,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { parseEther } from "viem";

import { config } from "./WagmiConfig.jsx";

export const Hooks = () => {
  let { address } = getAccount(config);

  const sendTransactions = async (walletAddress, amount) => {
    const result = await sendTransaction(config, {
      account: address,
      to: walletAddress,
      value: parseEther(amount),
    });

    const txHash = await waitForTransactionReceipt(config, {
      hash: result,
    });

    console.log("txHash", result, txHash);

    if (txHash.status) {
      return {
        status: true,
        hash: result,
        message: "Transaction Sent Successfully!",
      };
    } else {
      return {
        status: false,
        hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        message: "Transaction Failed!",
      };
    }
  };

  return { sendTransactions: sendTransactions };
};
