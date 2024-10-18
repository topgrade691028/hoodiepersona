import axios from "axios";
import { nftRarityDic, URLs } from "./constants";
import { formatEther } from "viem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const traitAttribute = {
  1: "background",
  2: "hoodie",
  3: "chain",
  4: "eyes",
  5: "hand",
  6: "mouth",
  7: "hat",
};

const getDataFromSubgraph = async (query) => {
  const res = await axios.post("/api/subgraph/getDataFromSubgraph", {
    query,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

/* function to get store traits data */
export const getStoreTraits = async () => {
  let query = ` {
	traits(where: {onStore: true, storeAmount_gt: 0}) {
		id
		attrID
    name
		rarity
		storePrice
		storeAmount
		onStore
		blockTimestamp
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    const traitsData = res.data.traits;
    const traitList = [];

    const traitsNumber = {
      background: 0,
      hoodie: 0,
      chain: 0,
      eyes: 0,
      hand: 0,
      mouth: 0,
      hat: 0,
    };
    for (var index in traitsData) {
      const traitTitle = traitAttribute[traitsData[index].attrID];
      const trait = {
        traitID: traitsData[index].id,
        traitCount: traitsData[index].storeAmount,
        price: formatEther(traitsData[index].storePrice),
        traitLevel: traitsData[index].rarity,
        traitTitle: traitTitle,
        traitName: traitsData[index].name,
        traitSrc: `${URLs.HoodyBackendURL}/getImage?attribute=${traitTitle}&name=${traitsData[index].name}.png`,
        setOpen: false,
      };
      traitsNumber[traitTitle]++;
      traitList.push(trait);
    }
    const traitsNumberArr = Object.entries(traitsNumber).map(
      ([key, number]) => ({ label: key, count: number })
    );

    return { traitList: traitList, traitsNumber: traitsNumberArr };
  } catch (e) {
    console.log(e, "============error============");
    return { traitList: [], traitsNumber: [] };
  }
};

/** function to get my traits data */
export const getMyTraits = async (account) => {
  let query = ` {
	traitByHolders(where: {holder: "${account}", amount_gt: 0}) {
    amount
    saleAmount
		salePrice
		blockTimestamp
    trait {
      id
      name
      rarity
      attrID
    }
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    const traitsData = res.data.traitByHolders;
    const traitList = [];

    const traitsNumber = {
      background: 0,
      hoodie: 0,
      chain: 0,
      eyes: 0,
      hand: 0,
      mouth: 0,
      hat: 0,
    };

    for (var index in traitsData) {
      const traitId = traitsData[index].trait.id;
      const traitTitle = traitAttribute[traitsData[index].trait.attrID];
      const trait = {
        traitID: traitId,
        traitCount: traitsData[index].amount,
        traitOnSale: traitsData[index].saleAmount > 0,
        traitSalePrice: traitsData[index].salePrice
          ? traitsData[index].salePrice / 10 ** 18
          : 0,
        traitLevel: traitsData[index].trait.rarity,
        traitTitle: traitTitle,
        traitName: traitsData[index].trait.name,
        traitSrc: `${URLs.HoodyBackendURL}/getImage?attribute=${traitTitle}&name=${traitsData[index].trait.name}.png`,
        blockTimestamp: traitsData[index].blockTimestamp,
      };
      traitsNumber[traitTitle]++;
      traitList.push(trait);
    }
    const traitsNumberArr = Object.entries(traitsNumber).map(
      ([key, number]) => ({ label: key, count: number })
    );

    return { traitList: traitList, traitsNumber: traitsNumberArr };
  } catch (e) {
    console.log(e, "============error============");
    return { traitList: [], traitsNumber: [] };
  }
};

/** function to get nft data */
export const getMyNFT = async (account, nftId) => {
  let query = `{
	hoodyGangs(
		where: {holder: "${account}", id: "${nftId}"}
	) {
		id
		tokenURI
		onStake
	}
	}`;

  try {
    const res = await getDataFromSubgraph(query);

    const nfts = res.data.hoodyGangs;
    if (nfts.length > 0 && !nfts[0].onStake) {
      var myNFT = nfts[0];
      var tokenURI = URLs.HoodyGateway + myNFT.tokenURI.split("://")[1];
      var metadata = (await axios.get(tokenURI)).data;
      var attributes = metadata.attributes;
      var name_arr = attributes.map((attr) => `"${attr.value}"`)

      query = `{
        traits(where: {name_in: [${name_arr.toString()}]}) {
          id
          attrID
          name
        }
      }`;

      const traitRes = (await getDataFromSubgraph(query)).data.traits;

      attributes = attributes.map((attr) => {
        const id = traitRes.filter((trait) => attr.trait_type == traitAttribute[trait.attrID] && attr.value == trait.name)[0].id;
        return { ...attr, traitID: id }
      })

      const rarity = nftRarityDic[metadata.rarity];
      const nftData = {
        tokenId: myNFT.id,
        url: myNFT.tokenURI,
        imageURL: metadata.image.split("://")[1],
        attributes: attributes,
        rarity: rarity,
      };

      return { isSuccess: true, nftData: nftData };
    } else {
      toast.error("Invalid token id.");
      return { isSuccess: false, nftData: null };
    }
  } catch (e) {
    console.log(e, "============error============");
    return { isSuccess: false, nftData: nftData };
  }
};
/** function to get nfts */

export const getHoodyGangs = async (account) => {
  let query = ` {
	hoodyGangs(where: {holder: "${account.toLowerCase()}"}) {
		id
		holder
    isOG
    ogID
		tokenURI
		onStake
		lastClaim
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    let nftsData = res.data.hoodyGangs;

    const blockIDs = ["6670", "6671", "6673", "6674"]
    nftsData = nftsData.filter((a) => !blockIDs.includes(a.id))

    const myNFTs = nftsData.filter((a) => a.onStake != true);
    let myNFTsData = [];
    if (myNFTs.length > 0) {
      for (var nft of myNFTs) {
        const tokenURI = URLs.HoodyGateway + nft.tokenURI.split("://")[1];
        const metadata = (await axios.get(tokenURI)).data;
        const rarity = nftRarityDic[metadata.rarity];
        myNFTsData.push({
          tokenId: nft.id,
          isOG: nft.isOG,
          metadata: metadata,
          rarity: rarity,
        });
      }
    }

    const stakeNFTs = nftsData.filter((a) => a.onStake == true);

    let stakeNFTsData = [];
    if (stakeNFTs.length > 0) {
      for (var nft of stakeNFTs) {
        const tokenURI = URLs.HoodyGateway + nft.tokenURI.split("://")[1];
        const metadata = (await axios.get(tokenURI)).data;
        const rarity = nftRarityDic[metadata.rarity];

        stakeNFTsData.push({
          tokenId: nft.id,
          isOG: nft.isOG,
          metadata: metadata,
          rarity: rarity,
          lastClaim: nft.lastClaim,
        });
      }
    }

    return { myNFTs: myNFTsData, stakeNFTs: stakeNFTsData };
  } catch (e) {
    console.log(e, "============error============");
    return { myNFTs: [], stakeNFTs: [] };
  }
};

export const getUpgradeableHoodyGangs = async (account) => {
  let query = ` {
	hoodyGangs(where: {holder: "${account.toLowerCase()}", isOG: false}) {
		id
		holder
    isOG
		tokenURI
		lastClaim
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    const nftsData = res.data.hoodyGangs;

    const myNFTs = nftsData.filter((a) => a.onStake != true);
    let myNFTsData = [];
    if (myNFTs.length > 0) {
      for (var nft of myNFTs) {
        const tokenURI = URLs.HoodyGateway + nft.tokenURI.split("://")[1];
        const metadata = (await axios.get(tokenURI)).data;
        const rarity = nftRarityDic[metadata.rarity];
        myNFTsData.push({
          tokenId: nft.id,
          isOG: nft.isOG,
          metadata: metadata,
          rarity: rarity,
        });
      }
    }
    return { myNFTs: myNFTsData };
  } catch (e) {
    console.log(e, "============error============");
    return { myNFTs: [] };
  }
};

export const getOthersTraitsOnMarket = async (account) => {
  let query = ` {
	traitByHolders(
		where: {saleAmount_gt: 0, holder_not: "${account}"}
	) {
		saleAmount
		salePrice
    trait {
      id
      name
      rarity
      attrID
    }
		holder
		blockTimestamp
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    const traitsData = res.data.traitByHolders;
    return getTraitsData(traitsData);
  } catch (e) {
    console.log(e, "============error============");
    return { traitList: [], traitsNumber: [] };
  }
};

export const getMyTraitsOnMarket = async (account) => {
  let query = ` {
	traitByHolders(
		where: {saleAmount_gt: 0, holder: "${account}"}
	) {
		saleAmount
		salePrice
    trait {
      id
      name
      rarity
      attrID
    }
		holder
		blockTimestamp
	}
	}`;
  try {
    const res = await getDataFromSubgraph(query);

    const traitsData = res.data.traitByHolders;
    return getTraitsData(traitsData);
  } catch (e) {
    console.log(e, "============error============");
    return { traitList: [], traitsNumber: [] };
  }
};

export const getTraitsData = (traits) => {
  const traitList = [];
  const traitsNumber = {
    background: 0,
    hoodie: 0,
    chain: 0,
    eyes: 0,
    hand: 0,
    mouth: 0,
    hat: 0,
  };

  for (var index in traits) {
    const traitId = traits[index].trait.id;
    const traitTitle = traitAttribute[traits[index].trait.attrID];
    const trait = {
      traitID: traitId,
      traitCount: traits[index].saleAmount,
      price: traits[index].salePrice / 10 ** 18,
      traitLevel: traits[index].trait.rarity,
      traitTitle: traitTitle,
      traitName: traits[index].trait.name,
      traitSrc: `${URLs.HoodyBackendURL}/getImage?attribute=${traitTitle}&name=${traits[index].trait.name}.png`,
      holder: traits[index].holder,
      blockTimestamp: traits[index].blockTimestamp,
    };
    traitsNumber[traitTitle]++;
    traitList.push(trait);
  }
  const traitsNumberArr = Object.entries(traitsNumber).map(([key, number]) => ({
    label: key,
    count: number,
  }));

  return { traitList: traitList, traitsNumber: traitsNumberArr };
};

export const getMigratedOGs = async (account) => {
  let query = ` {
        hoodyGangs(where: {isOG: true}) {
          ogID
        }
      }`;
  try {
    const res = await getDataFromSubgraph(query);

    const ogs = res.data.hoodyGangs;
    return ogs;
  } catch (e) {
    console.log(e, "============error in get ogs from subgraph============");
    return [];
  }
};
