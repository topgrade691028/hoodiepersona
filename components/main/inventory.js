import { useEffect, useState } from "react";
import CustomSlider from "../base/CustomSlider";
import ReactLoading from "react-loading";
import TraitTab from "../base/TraitTab";
import { inventorySortOptions, traitTabs } from "../../utils/constants";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { getMyTraits } from "../../utils/subgraph";
import {
  addTraitOnMarket,
  getHoodyPoints,
  listTraitOnMarket,
} from "../../utils/interact";
import InventorySellCard from "../base/inventorySellCard";
import Dropdown from "../base/dropdown";
import { sortTraits } from "../../utils/utility";
import { useMediaQuery } from "@mui/material";
import ListModal from "../base/listModal";
import AddModal from "../base/addModal";

export default function Inventory({authStatus}) {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();

  const [isLoading, setIsLoading] = useState(false);

  const [traitTab, setTraitTab] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [traitData, setTraitData] = useState([]);
  const [myPoints, setMyPoints] = useState(0);

  const [sortOption, setSortOption] = useState(0);
  const [traitToList, setTraitToList] = useState(null);
  const [traitToAdd, setTraitToAdd] = useState(null);
  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const listTrait = async (trait) => {
    setIsLoading(true);
    await listTraitOnMarket(trait.trait, trait.price, trait.buySellCount);
    await initInventory();
    setIsLoading(false);
  };

  const addTrait = async (trait) => {
    setIsLoading(true);
    const res = await addTraitOnMarket(trait.trait, trait.buySellCount);
    if (res) {
      setTimeout(() => {
        (async () => {
          await initInventory();
        })();
      }, 5000);
    }
    setIsLoading(false);
  };

  const initInventory = async () => {
    setIsLoading(true);
    const traits = await getMyTraits(address);
    const sorted = sortTraits(traits.traitList, sortOption);
    setTraitData(sorted);
    setTabs(traits.traitsNumber);
    setIsLoading(false);
  };

  useEffect(() => {
    let isSubscribed = true;

    const initData = async () => {
      const hoodyPoints = await getHoodyPoints(address);
      setMyPoints(hoodyPoints);
      await initInventory();
    };

    if (chain?.id && authStatus == "authenticated" && chains[0]?.id == chain?.id) {
      initData();
    }

    return () => (isSubscribed = false);
  }, [authStatus, chain?.id]);

  useEffect(() => {
    const lastData = JSON.parse(JSON.stringify(traitData));
    const data = sortTraits(lastData, sortOption);
    setTraitData(data);
  }, [sortOption]);

  return (
    <>
      {(!isPhoneMode || !traitToList & !traitToAdd) && (
        <div className="flex-1">
          {isLoading && (
            <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
              <ReactLoading type="spinningBubbles" color="#fff" />
            </div>
          )}
          <div className="pt-32 pb-24 px-12">
            <div className="w-full md:w-7/12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
              <div className="flex flex-col w-full md:w-fit hoody_market_logo_no_warning">
                <div className="flex flex-row gap-2">
                  <div className="text-2xl text-white font-bold m-auto md:m-0 md:mt-10">
                    Hoody Inventory
                  </div>
                </div>
              </div>
              <div className="w-[335px] h-[62px] bg-[#111215] bg-opacity-20 rounded-full bg-[url('/images/manager/pointBG.png')] bg-cover bg-no-repeat py-4 flex flex-row justify-center items-center space-x-4 mt-12 md:mt-0">
                <div className="rounded-full bg-white text-xs text-[#9B0000] italic font-extrabold flex justify-center items-center p-2 ">
                  <div className="-mt-2">P</div>
                </div>
                <div className="text-white text-xs -mt-3">Hoody Points</div>
                <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                  <div className="-mt-3">{myPoints}</div>
                </div>
              </div>
            </div>
            <div className="block md:hidden pt-4 pb-16 relative text-lg">
              <CustomSlider
                items={tabs}
                traitTab={traitTab}
                setTraitTab={(v) => setTraitTab(v)}
              />
              <div className="absolute block md:hidden right-0 top-20">
                <Dropdown
                  options={inventorySortOptions}
                  setSortOption={setSortOption}
                  sortOption={sortOption}
                />
              </div>
            </div>
            <div className="md:px-4">
              <div className="flex justify-center relative">
                <div className="hidden md:block pt-8 pb-4 w-full md:w-2/3 text-lg">
                  <TraitTab
                    items={tabs}
                    traitTab={traitTab}
                    setTraitTab={(v) => setTraitTab(v)}
                  />
                </div>
                <div className="absolute hidden md:block right-0 top-4">
                  <Dropdown
                    options={inventorySortOptions}
                    setSortOption={setSortOption}
                    sortOption={sortOption}
                  />
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-between gap-4">
                {traitData
                  .filter((item) => item.traitTitle === traitTabs[traitTab])
                  .map((item, index) => (
                    <InventorySellCard
                      trait={item}
                      setOpenList={() => setTraitToList(item)}
                      setOpenAdd={() => setTraitToAdd(item)}
                      key={index}
                    />
                  ))}
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div className="w-[137px] h-0" key={i} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ListModal
        openModal={!!traitToList}
        trait={traitToList}
        confirm={listTrait}
        onClose={() => setTraitToList(null)}
      />
      <AddModal
        openModal={!!traitToAdd}
        confirm={addTrait}
        trait={traitToAdd}
        onClose={() => setTraitToAdd(null)}
      />
    </>
  );
}
