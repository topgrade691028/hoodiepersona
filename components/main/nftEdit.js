import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReplyIcon from "@mui/icons-material/Reply";
import ReactLoading from "react-loading";
import TraitCard from "../base/traitCard";
import CustomSlider from "../base/CustomSlider";
import TraitTab from "../base/TraitTab";
import InventoryCard from "../base/inventoryCard";
import Router, { withRouter } from "next/router";
import {
  baseTraits,
  inventorySortOptions,
  rarityDic,
  traitTabs,
  URLs,
} from "../../utils/constants";
import { getMyNFT, getMyTraits } from "../../utils/subgraph";
import { drawImage, getRarity, sortTraits } from "../../utils/utility";
import { updateMyNFT } from "../../utils/interact";
import Dropdown from "../base/dropdown";

function NftEdit(props) {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();

  const [isLoading, setIsLoading] = useState(false);

  const [traitTab, setTraitTab] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [traitData, setTraitData] = useState([]);
  const [nft, setNFT] = useState({});
  const [imageURL, setImageURL] = useState("");
  const [nftRarity, setNFTRarity] = useState(0);

  const [traits, setTraits] = useState(baseTraits);
  const [refresh, setRefresh] = useState(false);
  const [viewTrait, setViewTrait] = useState({});
  const [sortOption, setSortOption] = useState(0);

  const [isDrawing, setIsDrawing] = useState(false);

  const resetTraits = () => {
    const oldTraits = JSON.parse(JSON.stringify(baseTraits));
    nft?.attributes?.map((item) => {
      oldTraits[traitTabs.indexOf(item.trait_type)].rarity =
        rarityDic[item.rarity];
      oldTraits[
        traitTabs.indexOf(item.trait_type)
      ].value = item.value;
      oldTraits[traitTabs.indexOf(item.trait_type)].traitID = item.traitID;
    });
    setViewTrait({})

    setTraits(oldTraits.slice());
  };

  const updateNFT = async () => {
    setIsLoading(true);
    await updateMyNFT(
      address,
      nft?.tokenId,
      nft?.attributes,
      nft?.imageURL,
      nft?.url,
      traits
    );
    setIsLoading(false);
  };

  const removeTrait = (title) => {
    const oldTraits = JSON.parse(JSON.stringify(traits));

    oldTraits[traitTabs.indexOf(title)].rarity =
      0;
    oldTraits[traitTabs.indexOf(title)].value =
      "NONE";
    oldTraits[traitTabs.indexOf(title)].traitID =
      0;

    setTraits(oldTraits.slice());
  };

  useEffect(() => {
    resetTraits();
    setNFTRarity(nft.rarity);
  }, [nft, refresh]);

  useEffect(() => {
    let isSubscribed = true;

    const getImage = async () => {
      setIsDrawing(true)
      const image = await drawImage(traits);
      setImageURL(image);
      setNFTRarity(getRarity(traits));
      setIsDrawing(false)
    };

    getImage();

    return () => (isSubscribed = false);
  }, [traits]);

  useEffect(() => {

    if (Object.keys(viewTrait).length > 0) {
      const oldTraits = JSON.parse(JSON.stringify(traits));

      oldTraits[traitTabs.indexOf(viewTrait.traitTitle)].rarity =
        viewTrait.traitLevel;
      oldTraits[traitTabs.indexOf(viewTrait.traitTitle)].value =
        viewTrait.traitName;
      oldTraits[traitTabs.indexOf(viewTrait.traitTitle)].traitID =
        viewTrait.traitID;

      setTraits(oldTraits.slice());
    }
  }, [viewTrait]);

  useEffect(() => {
    let isSubscribed = true;
    const nftID = props.router?.query.nftID;
    const initData = async () => {
      const nftData = await getMyNFT(address, nftID);
      if (nftData.isSuccess) {
        setIsLoading(true);
        setNFT(nftData.nftData);
        const traits = await getMyTraits(address);
        const sorted = sortTraits(traits.traitList, sortOption);
        setTraitData(sorted);
        setTabs(traits.traitsNumber);
        setIsLoading(false);
      } else {
        Router.push("/main");
      }
    };

    if (chain?.id && props.authStatus == "authenticated" && chains[0]?.id == chain?.id) {
      initData();
    }

    return () => (isSubscribed = false);
  }, [props.authStatus, chain?.id]);

  useEffect(() => {
    const lastData = JSON.parse(JSON.stringify(traitData));
    const data = sortTraits(lastData, sortOption);
    setTraitData(data);
  }, [sortOption]);

  return (
    <div className="flex-1">
      {isLoading && (
        <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
          <ReactLoading type="spinningBubbles" color="#fff" />
        </div>
      )}
      <div className="pt-24 md:pt-32 pb-24 px-6 sm:px-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-0">
          <div className="w-full md:w-1/3 px-2">
            <div className="flex flex-col w-full md:w-fit hoody_market_logo_no_warning">
              <div className="text-2xl text-white font-bold">NFT Editor</div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-8">
              <div className="w-full md:w-7/12 pt-6">
                <div className="flex flex-row justify-between">
                  <div className="text-base text-white pl-2">
                    Hoody #{nft?.tokenId}
                  </div>
                  <div className="md:pr-8">
                    {Array.from(
                      Array(nftRarity >= 0 ? nftRarity + 1 : 0).keys()
                    ).map((_, index) => (
                      <StarIcon
                        key={index}
                        style={{ color: "white" }}
                        fontSize="small"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <div className="w-full md:w-7/12 pt-2 pb-4">
                <div className="w-full aspect-square bg-[url('/images/manager/infoNFTBG.png')] bg-contain bg-no-repeat flex flex-col gap-4 p-2 pt-1.5 relative">
                  {isDrawing && (
                    <div className="absolute left-0 right-0 w-full h-full rounded-xl -mt-1.5 flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
                      <ReactLoading type="spinningBubbles" color="#fff" />
                    </div>
                  )}
                  <img src={imageURL} className="w-full rounded-xl" />
                </div>
                <div className="text-xs text-white font-bold mt-1">
                  NFT #{nft?.tokenId}
                </div>
              </div>
              <div className="w-full md:w-5/12 flex flex-row md:flex-col flex-wrap md:flex-nowrap justify-center gap-8 pb-8">
                <div
                  className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-4 h-[50px] w-[140px]"
                  onClick={updateNFT}
                >
                  <div className="-mt-2.5">Confirm</div>
                </div>
                <div
                  className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-4 h-[50px] w-[140px]"
                  onClick={() => {
                    setRefresh(!refresh);
                  }}
                >
                  <div className="-mt-2.5 mr-1">Refresh</div>
                  <RefreshIcon style={{ color: "white" }} fontSize="small" />
                </div>
                <div
                  className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-4 h-[50px] w-[140px]"
                  onClick={() => Router.push("/main")}
                >
                  <div className="-mt-2.5 mr-1">Cancel</div>
                  <ReplyIcon style={{ color: "white" }} fontSize="small" />
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
                {traits.map((item, index) => (
                  <TraitCard
                    traitlevel={item.rarity + 1}
                    traitTitle={item.type}
                    traitName={item.value}
                    key={index}
                    handleRemove={() => {
                      removeTrait(item.type.toLowerCase());
                    }}
                    buttonType={
                      item.type === "Hat" || item.type === "Chain" || item.type === "Hand"
                        ? "remove"
                        : ""
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 px-4 sm:px-8">
            <div className="flex flex-row justify-between ">
              <div className="text-base md:text-xl text-white font-bold">
                Traits Inventory
              </div>
            </div>
            <div className="flex justify-end mt-6 md:mt-0">
              <Dropdown
                options={inventorySortOptions}
                setSortOption={setSortOption}
                sortOption={sortOption}
              />
            </div>
            <div className="block md:hidden py-4">
              <CustomSlider
                items={tabs}
                traitTab={traitTab}
                setTraitTab={(v) => setTraitTab(v)}
              />
            </div>
            <div className="flex justify-end">
              <div className="hidden md:block py-4 w-full">
                <TraitTab
                  items={tabs}
                  traitTab={traitTab}
                  setTraitTab={(v) => setTraitTab(v)}
                />
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-between gap-4">
              {traitData
                .filter((item) => item.traitTitle === traitTabs[traitTab])
                .map((item, index) => (
                  <InventoryCard
                    traitLevel={item.traitLevel + 1}
                    traitCount={item.traitCount}
                    name={item.traitName}
                    traitSrc={item.traitSrc}
                    handleView={() => {
                      setViewTrait(item);
                    }}
                    key={index}
                  />
                ))}
              {Array(20)
                .fill(0)
                .map((_, i) => (
                  <div className="w-[125px] h-0" key={i} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NftEdit);
