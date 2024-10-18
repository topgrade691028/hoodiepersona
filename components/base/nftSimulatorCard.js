import RefreshIcon from "@mui/icons-material/Refresh";
import CachedIcon from "@mui/icons-material/Cached";
import ReactLoading from "react-loading";
import TraitCard from "./traitCard";
import { baseTraits, rarityDic, traitTabs } from "../../utils/constants";
import { useEffect, useState } from "react";
import { drawImage } from "../../utils/utility";

export default function NftSimulatorCard({
  storeAndmarket = false,
  setCartModalOpen = false,
  setSwitchModalOpen = false,
  NFT = {},
  viewTrait = {},
  setViewTrait = () => { }
}) {
  const handleCartModalOpen = () => setCartModalOpen(true);
  const handleSwitchModalOpen = () => setSwitchModalOpen(true);

  const [traits, setTraits] = useState(baseTraits);

  const [imageURL, setImageURL] = useState();

  const [refresh, setRefresh] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);

  const resetTraits = () => {
    const oldTraits = JSON.parse(JSON.stringify(baseTraits));
    NFT?.metadata?.attributes.map((item) => {
      oldTraits[traitTabs.indexOf(item.trait_type)].rarity =
        rarityDic[item.rarity];
      oldTraits[
        traitTabs.indexOf(item.trait_type)
      ].value = item.value;
    });

    setTraits(oldTraits.slice());
  };

  useEffect(() => {
    resetTraits();
    setViewTrait({})
  }, [NFT, refresh]);

  useEffect(() => {
    let isSubscribed = true;

    const getImage = async () => {
      setIsDrawing(true);
      const image = await drawImage(traits);
      setImageURL(image);
      setIsDrawing(false);
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
      setTraits(oldTraits.slice());
    }
  }, [viewTrait]);

  return (
    <>
      <div className="w-full md:w-1/3  hidden md:block pr-8 pt-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-7/12">
            <div className="w-[full] aspect-square bg-[url('/images/manager/infoNFTBG.png')] bg-contain bg-no-repeat flex flex-col gap-4 p-2 pt-1.5 relative">
              {isDrawing && (
                <div className="absolute left-0 right-0 w-full h-full rounded-xl -mt-1.5 flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
                  <ReactLoading type="spinningBubbles" color="#fff" />
                </div>
              )}
              <img src={imageURL} className="w-full rounded-xl" />
            </div>
            <div className="text-xs text-white font-bold mt-1 mb-2">
                id #{NFT?.tokenId}
              </div>
          </div>
          <div className="w-full sm:w-5/12 flex flex-row sm:flex-col flex-wrap sm:flex-nowrap justify-center space-y-0 sm:space-y-4 items-center sm:items-end">
            <div
              className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center"
              onClick={handleSwitchModalOpen}
            >
              <div className="-mt-2.5 pr-1">Switch NFT</div>
              <CachedIcon style={{ color: "white" }} fontSize="small" />
            </div>
            <div
              className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center"
              onClick={handleCartModalOpen}
            >
              <div className="-mt-2.5 pr-1">My Cart</div>
              <img className="w-4 h-4 -mt-0.5" src="/images/addIcon.svg" />
            </div>
            <div
              className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center"
              onClick={() => {
                setRefresh(!refresh);
              }}
            >
              <div className="-mt-2.5 pr-1">Refresh</div>
              <RefreshIcon style={{ color: "white" }} fontSize="small" />
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {traits.map((item, index) => (
              <TraitCard
                storeAndmarket={storeAndmarket}
                key={index}
                traitlevel={item.rarity + 1}
                traitTitle={item.type}
                traitName={item.value}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3  block md:hidden pt-8">
        <div className="flex justify-center">
          <div
            className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center"
            onClick={handleCartModalOpen}
          >
            <div className="-mt-2.5 pr-1">My Cart</div>
            <img className="w-4 h-4 -mt-0.5" src="/images/addIcon.svg" />
          </div>
        </div>
      </div>
    </>
  );
}
