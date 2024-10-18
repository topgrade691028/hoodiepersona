import { useEffect, useState } from "react";
import { useAccount, useWalletClient, useNetwork, useBalance } from "wagmi";
import { watchContractEvent } from "@wagmi/core";
import Image from "next/image";
import ReactLoading from "react-loading";
import TraitMarketCard from "../base/traitMarketCard";
import NftSimulatorCard from "../base/nftSimulatorCard";
import NftBuySellModal from "../base/nftBuySellModal";
import CartModal from "../base/cartModal";
import CustomSlider from "../base/CustomSlider";
import TraitTab from "../base/TraitTab";
import { useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateModal from "../base/updateModal";
import {
  getMyTraitsOnMarket,
  getOthersTraitsOnMarket,
  getUpgradeableHoodyGangs,
} from "../../utils/subgraph";
import { sortTraits } from "../../utils/utility";
import { defaultNFT, storeSortOptions, traitTabs } from "../../utils/constants";
import SwitchNftModal from "../base/switchNftModal";
import {
  buyTraitsFromMarket,
  downTraitFromMarket,
  updateTraitPriceOnMarket,
} from "../../utils/interact";
import Dropdown from "../base/dropdown";
import { HoodyTraitsMarketplaceContract } from "../../utils/contracts";

export default function HoodyMarket({authStatus}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const balance = useBalance({ address: address });

  const [tab, setTab] = useState(0);

  const [otherTraitTab, setOtherTraitTab] = useState(0);
  const [otherTraitData, setOtherTraitData] = useState([]);
  const [otherTabs, setOtherTabs] = useState([]);

  const [myTraitTab, setMyTraitTab] = useState(0);
  const [myTraitData, setMyTraitData] = useState([]);
  const [myTabs, setMyTabs] = useState([]);

  const [traitToBuy, setTraitToBuy] = useState(null);
  const [openCartModal, setOpenCartModal] = useState(null);
  const [traitToUpdate, setTraitToUpdate] = useState(null);
  const [openSwitchModal, setOpenSwitchModal] = useState(null);

  const [totalETH, setTotalEth] = useState(0);

  const [mySortOption, setMySortOption] = useState(0);
  const [otherSortOption, setOtherSortOption] = useState(0);

  const [nft, setNFT] = useState({});
  const [nfts, setNFTs] = useState([]);
  const [viewTrait, setViewTrait] = useState({});

  const [cartTraits, setCartTraits] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  watchContractEvent(
    {
      ...HoodyTraitsMarketplaceContract,
      eventName: "ListTrait",
    },
    async (seller) => {
      if (seller != address) {
        setIsLoading(true);
        await initOthersTraits();
        setIsLoading(false);
      }
    }
  );

  watchContractEvent(
    {
      ...HoodyTraitsMarketplaceContract,
      eventName: "AddTrait",
    },
    async (seller) => {
      if (seller != address) {
        setIsLoading(true);
        await initOthersTraits();
        setIsLoading(false);
      }
    }
  );

  watchContractEvent(
    {
      ...HoodyTraitsMarketplaceContract,
      eventName: "UpdateTraitPrice",
    },
    async (seller) => {
      if (seller != address) {
        setIsLoading(true);
        await initOthersTraits();
        setIsLoading(false);
      }
    }
  );

  watchContractEvent(
    {
      ...HoodyTraitsMarketplaceContract,
      eventName: "DownTrait",
    },
    async (seller) => {
      if (seller != address) {
        setIsLoading(true);
        await initOthersTraits();
        setIsLoading(false);
      }
    }
  );

  watchContractEvent(
    {
      ...HoodyTraitsMarketplaceContract,
      eventName: "BuyTrait",
    },
    async (seller, buyer) => {
      if (buyer != address) {
        setIsLoading(true);
        await initOthersTraits();
        setIsLoading(false);
      }
      if (seller == address) {
        setIsLoading(true);
        await initMyTraits();
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

    updateOtherTraitData(item);
  };

  const updateOtherTraitData = (item) => {
    const traitIndex = otherTraitData.findIndex(
      (ele) => ele.traitID === item.trait.traitID
    );
    const newTraits = [
      ...otherTraitData.slice(0, traitIndex),
      {
        ...otherTraitData[traitIndex],
        traitCount: otherTraitData[traitIndex].traitCount - item.buySellCount,
      },
      ...otherTraitData.slice(traitIndex + 1),
    ];
    setOtherTraitData(newTraits);
  };

  const downTrait = async (traitID, amount) => {
    setIsLoading(true);
    const res = await downTraitFromMarket(traitID, amount);
    if (res) {
      setTimeout(() => {
        (async () => {
          await initMyTraits();
        })();
      }, 5000);
    }
    setIsLoading(false);
  };

  const updateTotalEth = () => {
    var total = 0;
    cartTraits.map((item) => {
      total += item.trait.price * item.buySellCount;
    });
    setTotalEth(total);
  };

  const updateTraitFromCart = (item) => {
    const temp = [];
    let def = 0;
    cartTraits.map((cartTrait) => {
      if (cartTrait.trait.traitID == item.trait.traitID) {
        if (item.buySellCount != 0) {
          temp.push(item);
        }
        def = cartTrait.buySellCount - item.buySellCount;
      } else {
        temp.push(cartTrait);
      }
    });

    setCartTraits(temp);
    updateOtherTraitData({ trait: item.trait, buySellCount: -def });
  };

  const initOthersTraits = async () => {
    const otherTraits = await getOthersTraitsOnMarket(address);
    const sortedOtherTraits = sortTraits(
      otherTraits.traitList,
      otherSortOption
    );
    setOtherTraitData(sortedOtherTraits);
    setOtherTabs(otherTraits.traitsNumber);
  };

  const initMyTraits = async () => {
    const myTraits = await getMyTraitsOnMarket(address);
    const sortedMyTraits = sortTraits(myTraits.traitList, mySortOption);
    setMyTraitData(sortedMyTraits);
    setMyTabs(myTraits.traitsNumber);
  };

  const updatePrice = async (traitID, price) => {
    setIsLoading(true);
    await updateTraitPriceOnMarket(traitID, price);
    await initMyTraits();
    setIsLoading(false);
  };

  const buyTraits = async () => {
    if (balance.data.formatted < totalETH) {
      toast.warn("You don't have enough eth.");
    } else if (cartTraits.length == 0) {
      toast.warn("Empty Cart!");
    } else {
      setIsLoading(true);
      setOpenCartModal(null);
      await buyTraitsFromMarket(cartTraits);
      await initOthersTraits();
      setCartTraits([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateTotalEth();
  }, [cartTraits]);

  useEffect(() => {
    let isSubscribed = true;

    const initData = async () => {
      setIsLoading(true);
      await initOthersTraits();
      await initMyTraits();
      const nftsData = await getUpgradeableHoodyGangs(address);
      setNFTs(nftsData.myNFTs);
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
    const lastData = JSON.parse(JSON.stringify(myTraitData));
    const data = sortTraits(lastData, mySortOption);
    setMyTraitData(data);
  }, [mySortOption]);

  useEffect(() => {
    const lastData = JSON.parse(JSON.stringify(otherTraitData));
    const data = sortTraits(lastData, otherSortOption);
    setOtherTraitData(data);
  }, [otherSortOption]);

  return (
    <>
      {isLoading && (
        <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
          <ReactLoading type="spinningBubbles" color="#fff" />
        </div>
      )}
      {(!isPhoneMode || !traitToBuy & !openCartModal & !traitToUpdate) && (
        <div className="flex-1">
          <div className="pt-32 pb-24 px-4 md:px-12">
            <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
              {tab === 0 && (
                <div className="flex flex-col w-full md:w-fit hoody_market_logo_no_warning">
                  <div className="flex flex-row gap-2">
                    <div className="text-2xl text-white font-bold m-auto md:m-0 md:mt-10">
                      Hoody Market
                    </div>
                  </div>
                </div>
              )}
              {tab === 1 && (
                <div className="flex flex-col w-full md:w-fit hoody_market_logo">
                  <div className="flex flex-row gap-2">
                    <div className="text-2xl text-white font-bold m-auto md:m-0">
                      Hoody Market
                    </div>
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
              )}
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
              <div className="m-auto sm:m-0 flex flex-row h-[48px]">
                <div
                  className={`${
                    tab === 0 ? "bg-white bg-opacity-20 " : " "
                  }  cursor-pointer flex flex-row hover:bg-white hover:bg-opacity-20 justify-center items-center gap-2 pl-1 bg-[url('/images/manager/tabBGL.png')] bg-cover bg-no-repeat w-[176px] h-[50px] rounded-l-full`}
                  onClick={() => setTab(0)}
                >
                  <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                    <div className="-mt-2 text-[#9B0000]">
                      {myTraitData?.length}
                    </div>
                  </div>
                  <div className="cursor-pointer text-white text-xs -mt-3">
                    My Listings
                  </div>
                </div>
                <div
                  className={`${
                    tab === 1 ? "bg-white bg-opacity-20 " : " "
                  }  cursor-pointer flex flex-row hover:bg-white hover:bg-opacity-20 justify-center items-center gap-2 pl-2 bg-[url('/images/manager/tabBGR.svg')] bg-cover bg-no-repeat w-[190px] h-[50px] -ml-2 rounded-r-full`}
                  onClick={() => setTab(1)}
                >
                  <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                    <div className="-mt-2 text-[#9B0000]">
                      {otherTraitData?.length}
                    </div>
                  </div>
                  <div className="cursor-pointer text-white text-xs -mt-3">
                    Other Traits
                  </div>
                </div>
              </div>
            </div>

            {tab === 0 && (
              <div className="px-8">
                <div className="block md:hidden py-4 relative">
                  <CustomSlider
                    items={myTabs}
                    traitTab={myTraitTab}
                    setTraitTab={(v) => setMyTraitTab(v)}
                  />
                  <div className="absolute block md:hidden right-0 top-[70px]">
                    <Dropdown
                      options={storeSortOptions}
                      setSortOption={setMySortOption}
                      sortOption={mySortOption}
                    />
                  </div>
                </div>
                <div className="flex justify-center relative">
                  <div className="hidden md:block pt-8 pb-4 w-full md:w-2/3">
                    <TraitTab
                      items={myTabs}
                      traitTab={myTraitTab}
                      setTraitTab={(v) => setMyTraitTab(v)}
                    />
                  </div>
                  <div className="absolute hidden md:block right-0 top-4">
                    <Dropdown
                      options={storeSortOptions}
                      setSortOption={setMySortOption}
                      sortOption={mySortOption}
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-between gap-4">
                  {myTraitData
                    .filter((item) => item.traitTitle === traitTabs[myTraitTab])
                    .map((item, index) => (
                      <TraitMarketCard
                        isMine
                        name={item.traitName}
                        isMobile={isPhoneMode}
                        price={item.price}
                        traitCount={item.traitCount}
                        traitLevel={item.traitLevel + 1}
                        traitName={item.traitName}
                        traitTitle={item.traitTitle}
                        setOpenCancel={() => {
                          setTraitToBuy(item);
                        }}
                        setOpenUpdate={() => {
                          setTraitToUpdate(item);
                        }}
                        key={index}
                      />
                    ))}
                  {Array(20)
                    .fill(0)
                    .map((_, i) => (
                      <div className="w-[137px] h-0" key={i} />
                    ))}
                </div>
              </div>
            )}
            {tab === 1 && (
              <>
                <div className="flex flex-col md:flex-row">
                  <NftSimulatorCard
                    storeAndmarket
                    setCartModalOpen={setOpenCartModal}
                    setSwitchModalOpen={setOpenSwitchModal}
                    NFT={nft}
                    viewTrait={viewTrait}
                    setViewTrait={setViewTrait}
                  />
                  <div className="w-full md:w-2/3">
                    <div className="block md:hidden py-4 relative px-8">
                      <CustomSlider
                        items={otherTabs}
                        traitTab={otherTraitTab}
                        setTraitTab={(v) => setOtherTraitTab(v)}
                      />
                      <div className="absolute block md:hidden right-8 top-[70px]">
                        <Dropdown
                          options={storeSortOptions}
                          setSortOption={setOtherSortOption}
                          sortOption={otherSortOption}
                        />
                      </div>
                    </div>
                    <div className=" hidden md:flex justify-end">
                      <Dropdown
                        options={storeSortOptions}
                        setSortOption={setOtherSortOption}
                        sortOption={otherSortOption}
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="hidden md:block py-4 w-full">
                        <TraitTab
                          items={otherTabs}
                          traitTab={otherTraitTab}
                          setTraitTab={(v) => setOtherTraitTab(v)}
                        />
                      </div>
                    </div>
                    <div className="px-8 flex flex-row flex-wrap justify-between gap-4">
                      {otherTraitData
                        .filter(
                          (item) => item.traitTitle === traitTabs[otherTraitTab]
                        )
                        .map((item, index) => (
                          <TraitMarketCard
                            isMobile={isPhoneMode}
                            isMarket
                            name={item.traitName}
                            price={item.price}
                            traitCount={item.traitCount}
                            traitLevel={item.traitLevel + 1}
                            traitName={item.traitName}
                            traitTitle={item.traitTitle}
                            handleView={() => {
                              setViewTrait(item);
                            }}
                            setOpenBuy={() => {
                              item.traitCount > 0 ? setTraitToBuy(item) : {};
                            }}
                            key={index}
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
              </>
            )}
          </div>
        </div>
      )}
      <NftBuySellModal
        isBuy={tab == 0 ? false : true}
        trait={traitToBuy}
        confirm={addTraitToCart}
        down={downTrait}
        openModal={!!traitToBuy && traitToBuy.traitCount > 0}
        onClose={() => setTraitToBuy(null)}
      />
      <UpdateModal
        trait={traitToUpdate}
        confirm={updatePrice}
        openModal={!!traitToUpdate}
        onClose={() => setTraitToUpdate(null)}
      />
      <CartModal
        isMarket={true}
        myPoint={balance?.data?.formatted}
        totalPoint={totalETH}
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
    </>
  );
}
