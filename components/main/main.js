import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import NftCard from "../base/nftCard";

import { useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAccount, useWalletClient, useNetwork } from "wagmi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfoModal from "../base/InfoModal";
import {
  claimHoodyPoints,
  getClaimablePoints,
  getHoodyPoints,
  getReferral,
  stakeNFTs,
  unStakeNFTs,
} from "../../utils/interact";
import { URLs } from "../../utils/constants";

import ReactLoading from "react-loading";
import { getHoodyGangs } from "../../utils/subgraph";
import { getEllipsisTxt } from "../../utils/utility";

export default function Main({ authStatus }) {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();

  const [tab, setTab] = useState(0);
  const [info, setInfo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const [myNFTs, setMyNFTs] = useState([]);
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [hoodyPoints, setHoodyPoints] = useState(0);
  const [claimablePoints, setClaimablePoints] = useState(0);

  const [selectedMyNFTs, setSelectedMyNFTs] = useState({});
  const [selectedMyNFTData, setSelectedMyNFTData] = useState([]);

  const [selectedStakeNFTs, setSelectedStakeNFTs] = useState({});
  const [selectedStakeNFTIDs, setselectedStakeNFTIDs] = useState([]);

  const [referCode, setReferCode] = useState("");

  const selectMyNFTCard = (index) => {
    const selects = {
      ...(selectedMyNFTs ?? {}),
      [index]: !selectedMyNFTs?.[index],
    };

    setSelectedMyNFTs(selects);

    const tokens = Object.keys(selects).reduce((ret, cur) => {
      if (selects?.[cur]) {
        return [...(ret ?? []), myNFTs[cur]];
      }
      return ret;
    }, []);

    setSelectedMyNFTData(tokens);
  };

  const selectStakeNFTCard = (index) => {
    const selects = {
      ...(selectedStakeNFTs ?? {}),
      [index]: !selectedStakeNFTs?.[index],
    };
    setSelectedStakeNFTs(selects);

    const ids = Object.keys(selects).reduce((ret, cur) => {
      if (selects?.[cur]) {
        return [...(ret ?? []), stakedNFTs[cur].tokenId];
      }
      return ret;
    }, []);

    setselectedStakeNFTIDs(ids);
  };

  const updateClaimablePoints = async () => {
    const points = await getClaimablePoints(address);
    setClaimablePoints(points);
  };

  const updateHoodyPoints = async () => {
    const points = await getHoodyPoints(address);
    setHoodyPoints(points);
  };

  const updateNFTsData = async () => {
    const nftsData = await getHoodyGangs(address);
    setMyNFTs(nftsData.myNFTs);
    setStakedNFTs(nftsData.stakeNFTs);
  };

  const initSelectedNFTs = () => {
    setSelectedMyNFTData([]);
    setSelectedMyNFTs({});
    setSelectedStakeNFTs({});
    setselectedStakeNFTIDs([]);
  };

  const stake = async () => {
    if (selectedMyNFTData.length == 0) {
      toast.warn("Please select NFTs for staking.");
    } else {
      setIsLoading(true);
      const result = await stakeNFTs(address, selectedMyNFTData);
      if (result) {
        setTimeout(() => {
          (async () => {
            await updateNFTsData();
          })();
        }, 5000);
        initSelectedNFTs();
      }
      setIsLoading(false);
    }
  };

  const UnStake = async () => {
    if (selectedStakeNFTIDs.length == 0) {
      toast.warn("Please select NFTs for unstaking.");
    } else {
      setIsLoading(true);
      const result = await unStakeNFTs(selectedStakeNFTIDs);
      if (result) {
        setTimeout(() => {
          (async () => {
            await updateNFTsData();
          })();
        }, 5000);
        await updateClaimablePoints();
        await updateHoodyPoints();
        initSelectedNFTs();
      }

      setIsLoading(false);
    }
  };

  const claim = async () => {
    if (claimablePoints > 0) {
      setIsLoading(true);
      const result = await claimHoodyPoints();
      if (result) {
        await updateClaimablePoints();
        await updateHoodyPoints();
      }
      setIsLoading(false);
    } else {
      toast.warn("Nothing can claim.");
    }
  };

  const getReferralCode = async () => {
    const isReferral = await getReferral(address);
    if (isReferral) setReferCode(btoa(address));
    else setReferCode("");
  };

  useEffect(() => {
    let isSubscribed = true;

    const initData = async () => {
      setIsLoading(true);
      await updateNFTsData();
      await updateClaimablePoints();
      await updateHoodyPoints();
      await getReferralCode();
      setIsLoading(false);
    };

    if (chain?.id && authStatus == "authenticated" && chains[0]?.id == chain?.id) {
      initData();
    }

    return () => (isSubscribed = false);
  }, [authStatus, chain?.id]);

  return (
    <>
      {(!isPhoneMode || !info) && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="pt-20 px-4 pb-8 md:pb-0 md:px-12">
            {referCode != "" && (
              <div className="w-fit text-white text-xs mx-auto">
                My Ref:{" "}
                <span
                  className="text-sm cursor-pointer hover:text-yellow-300"
                  onClick={() => {
                    navigator.clipboard.writeText(referCode);
                    toast.success("Copied to clipboard.")
                  }}
                >
                  {getEllipsisTxt(referCode)}
                </span>
              </div>
            )}
            {referCode == "" && (
              <div className="pt-8" />
            )}

            <div className="mt-4 flex flex-col md:flex-row justify-center items-center px-0 md:px-8 gap-8">
              <div className="w-full hidden md:flex flex-col md:flex-row items-center justify-center md:justify-between">
                <div className="flex-1 flex flex-row h-[50px]">
                  <div
                    className={`bg-[#7f0600] ${tab === 0 ? "bg-white bg-opacity-20 " : " "
                      }  cursor-pointer flex flex-row hover:bg-opacity-20 justify-center items-center gap-2 pl-1 bg-[url('/images/manager/tabBGL.png')] bg-cover bg-no-repeat w-[176px] rounded-l-full`}
                    onClick={() => setTab(0)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2 text-[#9B0000]">
                        {myNFTs.length}
                      </div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      My NFTs
                    </div>
                  </div>
                  <div
                    className={`bg-[#7f0600] ${tab === 1 ? "bg-white bg-opacity-20 " : " "
                      } cursor-pointer flex flex-row hover:bg-opacity-20 justify-center items-center gap-2 pl-2 bg-[url('/images/manager/tabBGR.svg')] bg-cover bg-no-repeat w-[190px] -ml-2 rounded-r-full`}
                    onClick={() => setTab(1)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2 text-[#9B0000]">
                        {stakedNFTs.length}
                      </div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      Staked NFTs
                    </div>
                  </div>
                </div>
                <div className="w-[335px] h-[62px] bg-[#111215] bg-opacity-20 rounded-full bg-[url('/images/manager/pointBG.png')] bg-cover bg-no-repeat py-4 flex flex-row justify-center items-center space-x-4">
                  <div className="rounded-full bg-white text-xs text-[#9B0000] italic font-extrabold flex justify-center items-center p-2 ">
                    <div className="-mt-2">P</div>
                  </div>
                  <div className="text-white text-xs -mt-3">Hoody Points</div>
                  <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                    <div className="-mt-3">{hoodyPoints}</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-row justify-center md:justify-end gap-4">
                  {tab === 0 && (
                    <>
                      <div
                        className="cursor-pointer bg-[#7f0600] bg-opacity-80 hover:bg-opacity-10 rounded-full flex flex-row justify-center items-center gap-2 bg-[url('/images/manager/stake.png')] bg-cover bg-no-repeat w-[140px] h-[50px] pl-2"
                        onClick={stake}
                      >
                        <div className="text-xs text-white -mt-3">Stake</div>
                        <div className="rounded-full bg-white text-xs flex justify-center items-center p-2">
                          <div className="-mt-3 text-[#9B0000]">
                            {selectedMyNFTData.length}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <div
                        className="cursor-pointer bg-[#7f0600] bg-opacity-80 hover:bg-opacity-10 rounded-full flex flex-row justify-center items-center gap-1 bg-[url('/images/manager/unstake.png')] bg-cover bg-no-repeat w-[147px] h-[50px] pl-2"
                        onClick={UnStake}
                      >
                        <div className="text-xs text-white -mt-3">Unstake</div>
                        <div className="rounded-full bg-white text-xs flex justify-center items-center px-1 py-2">
                          <div className="-mt-3 text-[#9B0000]">
                            {selectedStakeNFTIDs.length}
                          </div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer bg-[#7f0600] bg-opacity-80 hover:bg-opacity-10 rounded-full flex flex-row justify-center items-center gap-2 bg-[url('/images/manager/claim.png')] bg-cover bg-no-repeat w-[185px] h-[50px] pl-2"
                        onClick={claim}
                      >
                        <div className="text-xs text-white -mt-3 text-[#9B0000]">
                          Claim
                        </div>
                        <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                          <div className="-mt-3">{claimablePoints}</div>
                        </div>
                        <div className="rounded-full bg-white text-xs text-[#784646] font-extrabold italic flex justify-center items-center p-2">
                          <div className="-mt-2">P</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="w-full flex md:hidden flex-col items-center justify-center gap-4">
                <div className="w-[335px] h-[62px] bg-[#111215] bg-opacity-20 rounded-full bg-[url('/images/manager/pointBG.png')] bg-cover bg-no-repeat py-4 flex flex-row justify-center items-center space-x-4">
                  <div className="rounded-full bg-white text-xs text-[#9B0000] italic font-extrabold flex justify-center items-center p-2 ">
                    <div className="-mt-2">P</div>
                  </div>
                  <div className="text-white text-xs -mt-3">Hoody Points</div>
                  <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                    <div className="-mt-3">{hoodyPoints}</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-row">
                  <div
                    className={`bg-[#7f0600] ${tab === 0 ? "bg-white bg-opacity-20 " : " "
                      }  cursor-pointer flex flex-row justify-center items-center gap-2 pl-1 bg-[url('/images/manager/tabBGL.png')] bg-cover bg-no-repeat w-[176px] h-[50px] rounded-l-full`}
                    onClick={() => setTab(0)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2">{myNFTs.length}</div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      My NFTs
                    </div>
                  </div>
                  <div
                    className={`bg-[#7f0600] ${tab === 1 ? "bg-white bg-opacity-20 " : " "
                      } cursor-pointer flex flex-row justify-center items-center gap-2 pl-2 bg-[url('/images/manager/tabBGR.svg')] bg-cover bg-no-repeat w-[190px] h-[50px] -ml-2 rounded-r-full`}
                    onClick={() => setTab(1)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2">{stakedNFTs.length}</div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      Staked NFTs
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-row justify-center gap-2">
                  {tab === 0 && (
                    <>
                      <div
                        className="cursor-pointer bg-[#7f0600] bg-opacity-80 rounded-full flex flex-row justify-center items-center gap-2 bg-[url('/images/manager/stake.png')] bg-cover bg-no-repeat w-[140px] h-[50px] pl-2"
                        onClick={stake}
                      >
                        <div className="text-xs text-white -mt-3">Stake</div>
                        <div className="rounded-full bg-white text-xs flex justify-center items-center p-2">
                          <div className="-mt-3 text-[#9B0000]">
                            {selectedMyNFTData.length}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <div
                        className="cursor-pointer bg-[#7f0600] hover:bg-opacity-40 rounded-full flex flex-row justify-center items-center gap-2 bg-[url('/images/manager/unstake.png')] bg-cover bg-no-repeat w-[147px] h-[50px] pl-2"
                        onClick={UnStake}
                      >
                        <div className="text-xs text-white -mt-3">Unstake</div>
                        <div className="rounded-full bg-white text-xs flex justify-center items-center px-1 py-2">
                          <div className="-mt-3 text-[#9B0000]">
                            {selectedStakeNFTIDs.length}
                          </div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer bg-[#7f0600] hover:bg-opacity-40 rounded-full flex flex-row justify-center items-center gap-2 bg-[url('/images/manager/claim.png')] bg-cover bg-no-repeat w-[185px] h-[50px] pl-2"
                        onClick={claim}
                      >
                        <div className="text-xs text-white -mt-3">Claim</div>
                        <div className="text-xs text-white flex items-center p-3 rounded-full bg-[#ce2626]">
                          <div className="-mt-3">{claimablePoints}</div>
                        </div>
                        <div className="rounded-full bg-white text-xs text-[#784646] font-extrabold italic flex justify-center items-center p-2">
                          <div className="-mt-2">P</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {tab === 0 && (
            <div className="py-8 relative">
              {isLoading && (
                <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
                  <ReactLoading type="spinningBubbles" color="#fff" />
                </div>
              )}
              {myNFTs.length > 0 && (
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12, lg: 20 }}
                  spacing={{ xs: 2, sm: 0 }}
                >
                  {myNFTs.map((item, index) => {
                    const isSelected = Boolean(selectedMyNFTs?.[index]);
                    return (
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        lg={4}
                        className="flex justify-center"
                        onClick={() => selectMyNFTCard(index)}
                        key={index}
                      >
                        <NftCard
                          setOpen={() => setInfo(item)}
                          imgSrc={
                            item.isOG
                              ? item.metadata.image
                              : URLs.HoodyGateway +
                              item.metadata.image.split("://")[1]
                          }
                          name={item.metadata.name}
                          edit
                          isOG={item.isOG}
                          nftId={item.tokenId}
                          nftLevel={item.rarity + 1}
                          selected={isSelected}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </div>
          )}
          {tab === 1 && (
            <div className="py-8">
              {isLoading && (
                <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[67px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
                  <ReactLoading type="spinningBubbles" color="#fff" />
                </div>
              )}
              {stakedNFTs.length > 0 && (
                <Grid container columns={{ xs: 4, sm: 8, md: 12, lg: 20 }}>
                  {stakedNFTs.map((item, index) => {
                    const isSelected = Boolean(selectedStakeNFTs?.[index]);
                    return (
                      <Grid
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        className="flex justify-center"
                        onClick={() => selectStakeNFTCard(index)}
                        key={index}
                      >
                        <NftCard
                          setOpen={() => setInfo(item)}
                          imgSrc={
                            item.isOG
                              ? item.metadata.image
                              : URLs.HoodyGateway +
                              item.metadata.image.split("://")[1]
                          }
                          isOG={item.isOG}
                          staked
                          name={item.metadata.name}
                          nftId={item.tokenId}
                          nftLevel={item.rarity + 1}
                          lastTime={item.lastClaim}
                          selected={isSelected}
                          updateClaim={updateClaimablePoints}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </div>
          )}
        </div>
      )}
      <InfoModal data={info} openModal={!!info} onClose={() => setInfo(null)} />
    </>
  );
}
