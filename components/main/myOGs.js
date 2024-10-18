import { useEffect, useState } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import NftCard from "../base/nftCard";
import { useAccount, useNetwork } from "wagmi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ReactLoading from "react-loading";
import {
  approveBuildings,
  freeMintUsingBuildings,
  getBuildingBlocks,
  getOGs,
  isApproved,
  ogMigrate,
} from "../../utils/interact";
import NftBuySellModal from "../base/nftBuySellModal";

export default function MyOGs({ authStatus }) {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [tab, setTab] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [myNFTs, setMyNFTs] = useState([]);
  const [myBuildings, setMyBuildings] = useState([]);
  const [editionToBurn, setEditionToBurn] = useState(null);

  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const migrate = async (ogData) => {
    setIsLoading(true);
    const result = await ogMigrate(address, ogData);
    if (result) {
      setTimeout(() => {
        (async () => {
          await initOGs();
        })();
      }, 5000);
    }
    setIsLoading(false);
  };

  const freeMint = async (item) => {
    setIsLoading(true);
    const isApp = await isApproved(address);
    let approveRes;
    if (!isApp) approveRes = await approveBuildings();
    else approveRes = true;
    if (approveRes) {
      const result = await freeMintUsingBuildings(item.trait.id, item.buySellCount);
      if (result) {
        setTimeout(() => {
          (async () => {
            await initBuildingBlocks();
          })();
        }, 3000);
      }
    }
    setIsLoading(false);
  };

  const initBuildingBlocks = async () => {
    setIsLoading(true);
    const buildingData = await getBuildingBlocks(address);
    setMyBuildings(buildingData);
    setIsLoading(false);
  };
  const initOGs = async () => {
    setIsLoading(true);
    const data = await getOGs(address);
    setMyNFTs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (chain?.id && authStatus == "authenticated" && chains[0]?.id == chain?.id) {
      initOGs();
      initBuildingBlocks();
    }
  }, [authStatus, chain?.id]);

  return (
    <>
      {(!isPhoneMode || !editionToBurn) && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="pt-32 px-4 md:px-12">
            <div className="flex flex-col md:flex-row justify-center items-center px-0 md:px-8 gap-8">
              <div className="w-full flex flex-col gap-8 md:flex-row items-center justify-center md:justify-between">
                <div className="flex flex-row h-[50px]">
                  <div
                    className={`bg-[#7f0600] ${tab === 0 ? "bg-white bg-opacity-20 " : " "
                      }  cursor-pointer flex flex-row hover:bg-opacity-20 justify-center items-center gap-2 pl-1 bg-[url('/images/manager/tabBGL.png')] bg-cover bg-no-repeat w-[176px] rounded-l-full`}
                    onClick={() => setTab(0)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2 text-[#9B0000]">{myNFTs.length}</div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      My OGs
                    </div>
                  </div>
                  <div
                    className={`bg-[#7f0600] ${tab === 1 ? "bg-white bg-opacity-20 " : " "
                      } cursor-pointer flex flex-row hover:bg-opacity-20 justify-center items-center gap-2 pl-2 bg-[url('/images/manager/tabBGR.svg')] bg-cover bg-no-repeat w-[190px] -ml-2 rounded-r-full`}
                    onClick={() => setTab(1)}
                  >
                    <div className="rounded-full bg-white text-[9px] flex justify-center items-center px-2 py-1.5">
                      <div className="-mt-2 text-[#9B0000]">
                        {myBuildings.length}
                      </div>
                    </div>
                    <div className="cursor-pointer text-white text-xs -mt-3">
                      Building Blocks
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {tab === 0 && (
              <div className="py-8 relative">
                {isLoading && (
                  <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[67px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
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
                      return (
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          className="flex justify-center"
                          key={index}
                        >
                          {
                            item.og.image_url != "" && (
                              < NftCard
                                imgSrc={item.og.image_url}
                                name={item.og.name}
                                nftLevel={3}
                                migrate={
                                  item.isMigrate ? () => { } : () => migrate(item.og)
                                }
                                isMigrate={item.isMigrate}
                                isOG
                              />
                            )
                          }
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </div>
            )}
            {tab === 1 && (
              <div className="py-8 relative">
                {isLoading && (
                  <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[67px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
                    <ReactLoading type="spinningBubbles" color="#fff" />
                  </div>
                )}
                {myBuildings.length > 0 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12, lg: 20 }}
                    spacing={{ xs: 2, sm: 0 }}
                  >
                    {myBuildings.map((item, index) => {
                      return (
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          className="flex justify-center"
                          key={index}
                        >
                          <NftCard
                            imgSrc={item.traitSrc}
                            nftId={item.id}
                            nftLevel={item.traitLevel}
                            freeMintAmount={item.traitCount}
                            openBuy={() => setEditionToBurn(item)}
                            isFreeMint
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <NftBuySellModal
        isFreeMint
        trait={editionToBurn}
        confirm={freeMint}
        openModal={!!editionToBurn}
        onClose={() => setEditionToBurn(null)}
      />
    </>
  );
}
