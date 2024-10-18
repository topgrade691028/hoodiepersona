import { readContract, writeContract, waitForTransaction } from "@wagmi/core";
import { parseEther, formatEther } from "viem";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CommunityWallet, nftRarityDic, URLs } from "./constants";
import {
  HoodyTokenContract,
  HoodyGangContract,
  HoodyGangStakeContract,
  HoodyTraitsContract,
  HoodyMigrateContract,
  HoodyTraitsMarketplaceContract,
  HoodyBuildingBlockContract,
} from "./contracts";
import { getMigratedOGs } from "./subgraph";

const CustomSuccessToast = ({ message, link }) => (
  <div
    style={{
      color: "white",
      padding: "10px",
    }}
  >
    <div>{message}</div>
    <a
      href={`https://etherscan.io/tx/${link}`}
      target="_blank"
      className="border-b-2 border-white"
    >
      {link}{" "}
    </a>
  </div>
);

export const getPublicPrice = async () => {
  const price = await readContract({
    ...HoodyGangContract,
    functionName: "PUBLIC_PRICE",
    args: []
  });

  return price;
}
/** function to mint hoody nft */
export const publicMint = async (referAddress, amount, value) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyGangContract,
      functionName: "publicMint",
      args: [referAddress, amount],
      value: value,
    });

    const data = await waitForTransaction({ hash });
    if (data.status == "success") {
      toast.success(
        <CustomSuccessToast message="Mint Successful." link={hash} />
      );
    } else {
      toast.error("Mint failed.");
    }
  } catch (e) {
    console.log(e);
    toast.error("Mint failed.");
  }
};

export const wlMint = async (amount, wlType, proof, price) => {
  try {
    let hash;
    hash = (await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyGangContract,
      functionName: "wlMint",
      args: [amount, wlType, proof],
      value: price * BigInt(amount),
    })).hash;

    const data = await waitForTransaction({ hash });
    if (data.status == "success") {
      toast.success(
        <CustomSuccessToast message="Mint Successful." link={hash} />
      );
    } else {
      toast.error("Mint failed.");
    }

  } catch (e) {
    console.log(e);
    toast.error("Mint failed.");
  }
};

/* function to get update signature */
const getTraitsSign = async (address, msg, traits) => {
  let data = {
    stakeSign: false,
    minter: address,
    msg: msg,
    traits: traits,
  };
  try {
    const res = await axios.post(`${URLs.HoodyBackendURL}/createSign`, data, { withCredentials: true }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (e) {
    console.log(e, "============error============");
    return null;
  }
};

/* function to get stake signature */
const getStakeSign = async (address, tokenIds, rarities) => {
  let data = {
    stakeSign: true,
    holder: address,
    tokenIds: tokenIds,
    rarities: rarities,
  };
  try {
    const res = await axios.post(`${URLs.HoodyBackendURL}/createSign`, data, { withCredentials: true }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (e) {
    console.log(e, "============error============");
    return null;
  }
};

/** function to get hoody points */

export const getHoodyPoints = async (account) => {
  const points = await readContract({
    ...HoodyTokenContract,
    functionName: "balanceOf",
    args: [account],
  });

  return formatEther(points);
};

/** function to get claimable hoody points reward */

export const getClaimablePoints = async (account) => {
  const points = await readContract({
    ...HoodyGangStakeContract,
    functionName: "calcTotalCreditsByHolder",
    args: [account],
  });

  return formatEther(points);
};

/** function to stake nfts */

export const stakeNFTs = async (address, tokens) => {
  try {
    let tokenIDs = [];
    let rarities = [];

    tokens.map((item) => {
      tokenIDs.push(item.tokenId);
      rarities.push(nftRarityDic[item.metadata.rarity]);
    });

    const sign = await getStakeSign(address, tokenIDs, rarities);
    if (sign.isSuccess) {
      const { hash } = await writeContract({
        mode: "recklesslyUnprepared",
        ...HoodyGangStakeContract,
        functionName: "stake",
        args: [tokenIDs, rarities, sign.signature],
      });
      await waitForTransaction({ hash });
      toast.success(
        <CustomSuccessToast message="Staked Successfully!" link={hash} />
      );
      return true;
    } else {
      toast.error("Falied in staking.");
      return false;
    }
  } catch (e) {
    console.log(e, "============error in staking==========");
    return false;
  }
};

export const unStakeNFTs = async (tokenIDs) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",

      ...HoodyGangStakeContract,
      functionName: "unstake",
      args: [tokenIDs],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="UnStaked Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in unstaking==========");
    return false;
  }
};

export const claimHoodyPoints = async () => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyGangStakeContract,
      functionName: "claimCredit",
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Claimed Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in claiming==========");
    return false;
  }
};

export const buyTraitsFromStore = async (traits, totalPrice) => {
  try {
    let traitIDs = [];
    let traitAmounts = [];
    traits.map((item) => {
      traitIDs.push(item.trait.traitID);
      traitAmounts.push(item.buySellCount);
    });

    let fixTotal = parseInt(totalPrice * 1000000) / 1000000;
    fixTotal = Math.round(fixTotal * 10000) / 10000

    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsContract,
      functionName: "buyTraitsFromStore",
      args: [traitIDs, traitAmounts],
      value: parseEther(fixTotal.toString()),
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Buy traits Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in claiming==========");
    return false;
  }
};

const unpinData = async (uri) => {
  if (uri.includes("ipfs")) {
    const metadata = (
      await axios.get(URLs.HoodyGateway + newURI.split("://")[1])
    ).data;
    const data = {
      imageHash: metadata.image.split("//")[1],
      jsonHash: newURI.split("//")[1],
    };
    const res = await axios.post(`${URLs.HoodyBackendURL}/unPin`, data, { withCredentials: true }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

/** function to update nft */
export const updateMyNFT = async (
  account,
  tokenId,
  attributes,
  imageURL,
  jsonURL,
  traits
) => {
  let newURI = "";

  try {
    const oldTraits = [];
    const newTraits = [];
    traits = traits.filter((trait) => trait.value != "NONE")

    traits.map((item) => {
      newTraits.push(item.traitID.toString());
    });
    attributes.map((item) => {
      oldTraits.push(item.traitID.toString());
    });

    if (JSON.stringify(oldTraits.sort()) === JSON.stringify(newTraits.sort())) {
      toast.warn("Please update any traits.");
      return false;
    }

    const data = {
      tokenId: tokenId,
      imageHash: imageURL.split("//")[1],
      jsonHash: jsonURL.split("//")[1],
      traits: traits,
    };

    const res = await axios.post(`${URLs.HoodyBackendURL}/uploadNFT`, data, { withCredentials: true }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.isSuccess) {
      const traitIDs = [];

      newURI = `ipfs://${res.data.hash}`;
      oldTraits.map((id) => {
        traitIDs.push(id);
      });

      newTraits.map((id) => {
        traitIDs.push(id);
      });
      const msg = `${newURI}${tokenId}`;

      const signData = await getTraitsSign(account, msg, traitIDs);
      if (signData.isSuccess) {
        const { hash } = await writeContract({
          mode: "recklesslyUnprepared",
          ...HoodyGangContract,
          functionName: "updateNFT",
          args: [tokenId, newURI, oldTraits, newTraits, signData.signature],
        });

        await waitForTransaction({ hash });

        await axios.post(`${URLs.HoodyBackendURL}/refreshMetaData`, { id: tokenId }, { withCredentials: true }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        await axios.post(`${URLs.HoodyBackendURL}/unPin`, data, { withCredentials: true }, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setTimeout(() => {
          (() => {
            toast.success(
              <CustomSuccessToast message="Update Successfully." link={hash} />
            );
          })();
        }, 4000);

        return true;
      } else {
        toast.error("Falied in sign data.");
        await unpinData(newURI);
        return false;
      }
    } else {
      if (res.data.isExist) {
        toast.warn("This PFP already exists.");
      } else {
        toast.error("Falied in upload metadata to IPFS. Please try again.");
      }
      return false;
    }
  } catch (e) {
    await unpinData(newURI);
    toast.error("Falied in update nft. Please try again.");
    console.log(e.message, "============error============");
    return false;
  }
};

/** function to list trait on marketplace */
export const listTraitOnMarket = async (traitID, price, amount) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsMarketplaceContract,
      functionName: "listNewTrait",
      args: [traitID, parseEther(price.toString()), amount],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Listed Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in listing==========");
    return false;
  }
};

export const addTraitOnMarket = async (traitID, amount) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsMarketplaceContract,
      functionName: "addMoreTraits",
      args: [traitID, amount],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Added Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in adding==========");
    return false;
  }
};

export const updateTraitPriceOnMarket = async (traitID, price) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsMarketplaceContract,
      functionName: "updateTraitPrice",
      args: [traitID, parseEther(price.toString())],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Updated Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in updating price==========");
    return false;
  }
};

export const downTraitFromMarket = async (traitID, amount) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsMarketplaceContract,
      functionName: "downTrait",
      args: [traitID, amount],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Downed Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in dowing trait==========");
    return false;
  }
};

export const buyTraitsFromMarket = async (traits) => {
  try {
    let holders = [];
    let traitIDs = [];
    let traitAmounts = [];
    let totalPrice = 0;
    traits.map((item) => {
      holders.push(item.trait.holder);
      traitIDs.push(item.trait.traitID);
      traitAmounts.push(item.buySellCount);
      totalPrice += item.trait.price * item.buySellCount;
    });
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsMarketplaceContract,
      functionName: "buyTraits",
      args: [holders, traitIDs, traitAmounts],
      value: parseEther(totalPrice.toString()),
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Bought Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log(e, "============error in dowing trait==========");
    return false;
  }
};

export const getOGs = async (address) => {
  const ogs = await getMigratedOGs(address);

  const res = await axios.post(
    `${URLs.HoodyBackendURL}/getOGs`,
    { account: address }, { withCredentials: true },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let OGHoody = [];
  if (res.data.isSuccess) {
    const ogData = res.data.data
    ogData.map((item) => {
      if (ogs.filter((og) => og.ogID == item.identifier).length > 0)
        OGHoody.push({ og: item, isMigrate: true });
      else OGHoody.push({ og: item, isMigrate: false });
    });
  }

  return OGHoody;
};

export const ogMigrate = async (address, ogData) => {
  try {
    const traitsRes = await axios.post(
      `${URLs.HoodyBackendURL}/getOGTraits`,
      { id: ogData.identifier }, { withCredentials: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newOGData = {
      name: ogData.name,
      imageURL: ogData.image_url,
      traits: traitsRes.data.data,
    };

    const res = await axios.post(
      `${URLs.HoodyBackendURL}/uploadOGMetaData`,
      { data: newOGData },
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.isSuccess) {
      const newURI = `ipfs://${res.data.hash}`;
      let data = {
        holder: address,
        tokenId: ogData.identifier,
        uri: newURI,
        isMigrate: true,
      };
      const hashRes = await axios.post(`${URLs.HoodyBackendURL}/createSign`, data, { withCredentials: true }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      let hash
      if (ogData.identifier < 10000000) {
        hash = (await writeContract({
          mode: "recklesslyUnprepared",
          ...HoodyMigrateContract,
          functionName: "ogV2Migrate",
          args: [ogData.identifier, newURI, hashRes.data.signature],
        })).hash;
      } else {
        hash = (await writeContract({
          mode: "recklesslyUnprepared",
          ...HoodyMigrateContract,
          functionName: "ogV1Migrate",
          args: [ogData.identifier, newURI, hashRes.data.signature],
        })).hash;
      }

      await waitForTransaction({ hash });
      toast.success(
        <CustomSuccessToast message="Migrated Successfully!" link={hash} />
      );
      return true;
    } else {
      toast.error("Error in upload metadata")
      return false;
    }

  } catch (e) {
    console.log("Error in og migrate", e.message);
    return false;
  }
};

export const getBuildingBlocks = async (address) => {
  const amounts = await readContract({
    ...HoodyBuildingBlockContract,
    functionName: "balanceOfBatch",
    args: [
      [address, address],
      [1, 2],
    ],
  });

  const buildingData = [];

  for (var i = 0; i < 2; i++) {
    if (amounts[i] > 0)
      buildingData.push({
        id: i + 1,
        traitLevel: 3,
        traitSrc: `${URLs.HoodyBuildingBlockURI}${i + 1}.png`,
        traitCount: amounts[i],
      });
  }

  return buildingData;
};

export const isApproved = async (address) => {
  const isApprovedResult = await readContract({
    ...HoodyBuildingBlockContract,
    functionName: "isApprovedForAll",
    args: [address, HoodyMigrateContract.address],
  });

  return isApprovedResult;
};
export const approveBuildings = async () => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyBuildingBlockContract,
      functionName: "setApprovalForAll",
      args: [HoodyMigrateContract.address, true],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast
        message="Approved Building Blocks Successfully."
        link={hash}
      />
    );
    return true;
  } catch (e) {
    console.log("Error in approve building block", e.message);
    return false;
  }
};
export const freeMintUsingBuildings = async (id, amount) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyMigrateContract,
      functionName: "freeMint",
      args: [id, amount],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Free Minted Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log("Error in free mint", e.message);
    return false;
  }
};

export const getReferral = async (account) => {
  if (account == CommunityWallet) return true;
  const isReferral = await readContract({
    ...HoodyGangContract,
    functionName: "isReferral",
    args: [account],
  });

  return isReferral;
};

export const getCurrentPhase = async () => {
  const phase = await readContract({
    ...HoodyGangContract,
    functionName: "getCurrentPhase",
    args: [],
  });

  return phase;
}

export const getCurrentAmount = async (account, phase, type) => {
  const amount = await readContract({
    ...HoodyGangContract,
    functionName: "WL_AMOUNTS",
    args: [account, phase, type],
  });

  return amount;
}

export const getWLMintStatus = async (account, phase, type) => {

  const data = await readContract({
    ...HoodyGangContract,
    functionName: "getAvailableWLAmountAndPrice",
    args: [account, phase, type]
  });

  return { amount: data[0], price: data[1] };
}

export const getAdmin = async () => {
  const admin = await readContract({
    ...HoodyTraitsContract,
    functionName: "owner",
    args: []
  });

  return admin;
}

export const addNewTraits = async (data) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsContract,
      functionName: "addStoreTraits",
      args: [data.attrId, data.traitNames, data.traitRarities, data.traitPirces, data.traitAmounts],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Add New Traits Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log("Error in adding new traits", e.message);
    return false;
  }
}

export const getLeftTime = async (phase) => {
  const phaseStartTime = await readContract({
    ...HoodyGangContract,
    functionName: "phaseStartTime",
    args: [phase]
  });

  const leftTime = Number(phaseStartTime) - Math.floor(Date.now() / 1000)

  return leftTime;
}

export const removeTrait = async (traitId) => {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      ...HoodyTraitsContract,
      functionName: "removeStoreTrait",
      args: [traitId],
    });
    await waitForTransaction({ hash });
    toast.success(
      <CustomSuccessToast message="Removed Trait Successfully!" link={hash} />
    );
    return true;
  } catch (e) {
    console.log("Error in adding new traits", e.message);
    return false;
  }
}