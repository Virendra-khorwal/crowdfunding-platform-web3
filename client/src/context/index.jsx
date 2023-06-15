import { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x34C178a8FA49161A30e585B173D428101111f718"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({ args:[
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]});

      console.log("Contract call successful", data);
    } catch (error) {
      console.log("Contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campagin,i) => ({
      owner: campagin.owner,
      title: campagin.title,
      description: campagin.description,
      target: ethers.utils.formatEther(campagin.target.toString()),
      deadline: campagin.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campagin.amountCollected.toString()),
      image: campagin.image,
      pId: i,
    }));

    return parsedCampaigns;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        connect,
        getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);