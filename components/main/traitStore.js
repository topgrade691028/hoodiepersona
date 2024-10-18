import { useEffect, useState } from "react";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { watchContractEvent } from "@wagmi/core";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TraitMarketCard from "../base/traitMarketCard";
import NftSimulatorCard from "../base/nftSimulatorCard";
import NftBuySellModal from "../base/nftBuySellModal";
import CartModal from "../base/cartModal";
import CustomSlider from "../base/CustomSlider";
import TraitTab from "../base/TraitTab";
import ReactLoading from "react-loading";
import { useMediaQuery } from "@mui/material";
import { getStoreTraits, getUpgradeableHoodyGangs } from "../../utils/subgraph";
import SwitchNftModal from "../base/switchNftModal";
import Dropdown from "../base/dropdown";
import { defaultNFT, storeSortOptions, traitTabs } from "../../utils/constants";
import { buyTraitsFromStore, getAdmin, removeTrait } from "../../utils/interact";
import { sortTraits } from "../../utils/utility";
import { HoodyTraitsContract } from "../../utils/contracts";
import AddTraitsModal from "../base/addTraitsModal";

export default function TraitStore({ authStatus }) {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const balance = useBalance({ address: address });

  const [traitTab, setTraitTab] = useState(0);
  const [openCartModal, setOpenCartModal] = useState(null);
  const [openSwitchModal, setOpenSwitchModal] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [traitToBuy, setTraitToBuy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const [traitData, setTraitData] = useState([]);
  const [tabs, setTabs] = useState([]);

  const [sortOption, setSortOption] = useState(0);

  const [nft, setNFT] = useState({});
  const [nfts, setNFTs] = useState([]);
  const [viewTrait, setViewTrait] = useState({});

  const [isAdmin, setIsAdmin] = useState(false);

  const [cartTraits, setCartTraits] = useState([]);

  watchContractEvent(
    {
      ...HoodyTraitsContract,
      eventName: "TraitRemoved",
    },
    async (traitID) => {
      setIsLoading(true);
      await initStoreTraits();
      setIsLoading(false);
    }
  );

  watchContractEvent(
    {
      ...HoodyTraitsContract,
      eventName: "BuyTraitFromStore",
    },
    async (buyer) => {
      if (buyer != address) {
        setIsLoading(true);
        await initStoreTraits();
        setIsLoading(false);
      }
    }
  );

  const addTraitToCart = (item) => {
    const findIndex = cartTraits.findIndex(
      (ele) => ele.trait.traitID === item.trait.traitID
    );
    const newArr =
      findIndex < 0
        ? [...cartTraits, item]
        : [
          ...cartTraits.slice(0, findIndex),
          {
            ...cartTraits[findIndex],
            buySellCount:
              cartTraits[findIndex].buySellCount + item.buySellCount,
          },
          ...cartTraits.slice(findIndex + 1),
        ];
    setCartTraits(newArr);

    updateTraitData(item);
  };

  const updateTraitData = (item) => {
    const traitIndex = traitData.findIndex(
      (ele) => ele.traitID === item.trait.traitID
    );
    const newTraits = [
      ...traitData.slice(0, traitIndex),
      {
        ...traitData[traitIndex],
        traitCount: traitData[traitIndex].traitCount - item.buySellCount,
      },
      ...traitData.slice(traitIndex + 1),
    ];
    setTraitData(newTraits);
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const updateTotalPrice = () => {
    var total = 0;
    cartTraits.map((item) => {
      total += item.trait.price * item.buySellCount;
    });
    setTotalPrice(total);
  };

  const updateTraitFromCart = (item) => {
    const temp = [];
    let def = 0;
    cartTraits.map((cartTrait) => {
      if (cartTrait.trait.traitID == item.trait.traitID) {
        if (item.buySellCount > 0) {
          temp.push(item);
        }
        def = cartTrait.buySellCount - item.buySellCount;
      } else {
        temp.push(cartTrait);
      }
    });

    setCartTraits(temp);
    updateTraitData({ trait: item.trait, buySellCount: -def });
  };

  const buyTraits = async () => {
    if (balance.data.formatted < totalPrice) {
      toast.warn("You don't have enough eth.");
    } else if (cartTraits.length == 0) {
      toast.warn("Empty Cart!");
    } else {
      setIsLoading(true);
      await buyTraitsFromStore(cartTraits, totalPrice);
      setOpenCartModal(null);
      await initStore();
      setCartTraits([]);
      setIsLoading(false);
    }
  };

  const initStoreTraits = async () => {
    const traits = await getStoreTraits();
    const sorted = sortTraits(traits.traitList, sortOption);
    setTraitData(sorted);
    setTabs(traits.traitsNumber);
  };

  const removeStoreTrait = async (traitID) => {
    setIsLoading(true)
    await removeTrait(traitID);
    setIsLoading(false)
  }

  const initStore = async () => {
    await initStoreTraits();
  };

  useEffect(() => {
    updateTotalPrice();
  }, [cartTraits]);

  useEffect(() => {
    let isSubscribed = true;

    const initData = async () => {
      setIsLoading(true);
      await initStore();
      const nftsData = await getUpgradeableHoodyGangs(address);
      setNFTs(nftsData.myNFTs);

      const admin = await getAdmin();
      setIsAdmin(admin.toLowerCase() == address.toLowerCase())
      setIsLoading(false);
    };

    if (chain?.id && authStatus == "authenticated" && chains[0]?.id == chain?.id) {
      initData();
    }

    return () => (isSubscribed = false);
  }, [authStatus, chain?.id]);

  useEffect(() => {
    if (nfts.length > 0) setNFT(nfts[0]);
    else setNFT(defaultNFT);
  }, [nfts]);

  useEffect(() => {
    const lastData = JSON.parse(JSON.stringify(traitData));
    const data = sortTraits(lastData, sortOption);
    setTraitData(data);
  }, [sortOption]);

  return (
    <>
      {isLoading && (
        <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
          <ReactLoading type="spinningBubbles" color="#fff" />
        </div>
      )}
      {isAdmin && !isPhoneMode && (
        <div className="w-full">
          <div className="absolute right-12 mt-28 text-white border-4 px-4 pt-1 pb-4 rounded-full hover:underline cursor-pointer" onClick={() => setOpenAddModal(true)}>
            Add Traits
          </div>
        </div>
      )}
      {(!isPhoneMode || !traitToBuy & !openCartModal) && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="pt-32 pb-24 px-8 md:px-12">
            <div className="w-full md:w-7/12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
              <div className="flex flex-col w-full md:w-fit hoody_market_logo">
                <div className="text-2xl text-white font-bold mx-auto sm:mx-0">
                  Hoody Trait Store
                </div>
                <div className="pt-8 m-auto">
                  <div className="flex flex-row gap-3">
                    <Image
                      src="/images/warningIcon.svg"
                      width={24}
                      height={24}
                      alt="warningIcon"
                    />
                    <div className="text-xs text-white">
                      Model simulator isn't available
                      <br /> on mobile version
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[205px] h-[54px] bg-[#101114] bg-opacity-20 rounded-full bg-[url('/images/store/ethBG.svg')] bg-cover bg-no-repeat py-4 flex flex-row justify-center items-center space-x-4 mt-12 md:mt-0">
                <img
                  src="/images/main/ethIcon.svg"
                  className="w-[16px] h-[17px] mb-0.5"
                />
                <div className="text-white text-xs font-bold -mt-3">ETH</div>

                <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                  <div className="-mt-3">
                    {(+balance?.data?.formatted).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {authStatus == "authenticated" && (
                <NftSimulatorCard
                  storeAndmarket
                  setCartModalOpen={setOpenCartModal}
                  setSwitchModalOpen={setOpenSwitchModal}
                  NFT={nft}
                  viewTrait={viewTrait}
                  setViewTrait={setViewTrait}
                />
              )}

              <div className="w-full md:w-2/3 ">
                <div className="block md:hidden pt-4 pb-16 px-4 relative">
                  <CustomSlider
                    items={tabs}
                    traitTab={traitTab}
                    setTraitTab={(v) => setTraitTab(v)}
                  />
                  <div className="absolute block md:hidden right-0 top-20">
                    <Dropdown
                      options={storeSortOptions}
                      setSortOption={setSortOption}
                      sortOption={sortOption}
                    />
                  </div>
                </div>
                <div className=" hidden md:flex justify-end ">
                  {authStatus == "authenticated" && (
                    <Dropdown
                      options={storeSortOptions}
                      setSortOption={setSortOption}
                      sortOption={sortOption}
                    />
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="hidden md:block py-4 w-full">
                    <TraitTab
                      items={tabs}
                      traitTab={traitTab}
                      setTraitTab={(v) => setTraitTab(v)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-around md:justify-between gap-y-6 gap-x-6">
                  {traitData
                    .filter((item) => item.traitTitle === traitTabs[traitTab])
                    .map((item, index) => (
                      <TraitMarketCard
                        isMobile={isPhoneMode}
                        price={item.price}
                        traitCount={item.traitCount}
                        traitLevel={item.traitLevel + 1}
                        traitTitle={item.traitTitle}
                        traitName={item.traitName}
                        isAdmin={isAdmin}
                        setOpenBuy={() => {
                          item.traitCount > 0 ? setTraitToBuy(item) : {};
                        }}
                        handleView={() => {
                          setViewTrait(item);
                        }}
                        handleRemove={() => {
                          removeStoreTrait(item.traitID)
                        }}
                        key={item.traitID}
                      />
                    ))}
                  {Array(20)
                    .fill(0)
                    .map((_, i) => (
                      <div className="w-[137px] h-0" key={i} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <NftBuySellModal
        isBuy={true}
        isStore={true}
        trait={traitToBuy}
        confirm={addTraitToCart}
        openModal={!!traitToBuy && traitToBuy.traitCount > 0}
        onClose={() => setTraitToBuy(null)}
      />
      <CartModal
        myPoint={balance?.data?.formatted}
        totalPoint={totalPrice}
        carts={cartTraits}
        checkOut={buyTraits}
        openModal={!!openCartModal}
        updateCart={updateTraitFromCart}
        onClose={() => setOpenCartModal(null)}
      />
      <SwitchNftModal
        openModal={!!openSwitchModal}
        nftList={nfts}
        switchNFT={setNFT}
        onClose={() => setOpenSwitchModal(null)}
      />
      <AddTraitsModal
        openModal={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  );
}
