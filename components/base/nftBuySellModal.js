import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ReplyIcon from "@mui/icons-material/Reply";

import { useMediaQuery } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 487,
  p: 4,
  background: "url(/images/main/modalBG.svg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
};

export default function NftBuySellModal({
  trait = {},
  isFreeMint = false,
  isBuy = false,
  isStore = false,
  openModal = false,
  down = () => { },
  confirm = () => { },
  onClose = () => { },
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  const [buySellCount, setBuySellCount] = useState(1);
  const closeModal = () => {
    onClose();
    setBuySellCount(1);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [trait]);

  return (
    <div>
      {isPhoneMode && openModal ? (
        <div className="min-h-screen mt-[35px] bg-[url('/images/main/mobileModalBG.png')] bg-cover w-full z-20">
          <div className="flex flex-col ">
            <div className="w-full px-4 py-12">
              <div className="">
                {isFreeMint ? (
                  <div className="text-base text-white">
                    How many Editions to Burn?
                  </div>
                ) : isBuy ? (
                  <div className="text-base text-white">
                    How many traits to Buy?
                  </div>
                ) : (
                  <div className="text-base text-white">
                    How many traits to Cancel?
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-center items-center gap-4 mt-6">
                <div className="w-[180px] flex-0">
                  <div className="flex flex-row justify-between items-center gap-2 pb-1">
                    <div className="flex flex-row gap-1">
                      {Array.from(Array(trait?.traitLevel).keys()).map(
                        (_, index) => (
                          <img
                            src="/images/starIcon.svg"
                            className="w-[10px] h-[10px]"
                            key={index}
                          />
                        )
                      )}
                    </div>
                    <div className="text-[9px] text-[white]">
                      <div className="-mt-2">x{Number(trait?.traitCount)}</div>
                    </div>
                  </div>
                  <div className="relative rounded-md bg-[url('/images/editor/nftTraitBG.png')] w-[140px] h-[139px] bg-no-repeat bg-cover p-2 pt-1.5 flex justify-center">
                    <img src={trait?.traitSrc}></img>
                  </div>
                </div>
                <div className="flex-1 pl-4 pr-4 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="flex flex-row rounded-full w-[88px] h-[38px] bg-[url('/images/main/numBG.png')] bg-no-repeat bg-cover ">
                      <div className="pl-2 w-3/5 flex justify-center items-center text-white text-[10px]">
                        <div className="-mt-2">x{buySellCount}</div>
                      </div>
                      <div className="w-2/5 h-full flex flex-col text-white">
                        <div className="h-1/2 cursor-pointer flex justify-center items-center rounded-tr-full pr-1 ">
                          <div
                            className="flex justify-center items-center pt-2"
                            onClick={() => {
                              setBuySellCount(
                                buySellCount < Number(trait?.traitCount)
                                  ? buySellCount + 1
                                  : buySellCount
                              );
                            }}
                          >
                            <img
                              src="/images/main/up.svg"
                              className="w-3 hover:w-4"
                            />
                          </div>
                        </div>
                        <div className="h-1/2  cursor-pointer flex justify-center items-center rounded-br-full pr-1">
                          <div
                            className="flex justify-center items-center pb-2"
                            onClick={() => {
                              setBuySellCount(
                                buySellCount > 1 ? buySellCount - 1 : 1
                              );
                            }}
                          >
                            <img
                              src="/images/main/down.svg"
                              className="w-3 hover:w-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer flex justify-center items-center text-white text-[10px] w-[76px] h-[38px] bg-[url('/images/main/maxBG.png')] bg-no-repeat bg-cover rounded-full px-3 py-2"
                      onClick={() => {
                        setBuySellCount(Number(trait?.traitCount));
                      }}
                    >
                      <div className="-mt-2">Max</div>
                    </div>
                  </div>
                  <div
                    className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[180px] h-[40px] cursor-pointer text-xs text-white text-center mx-auto pt-2"
                    onClick={() => {
                      isFreeMint || isBuy || isStore
                        ? confirm({ trait: trait, buySellCount: buySellCount })
                        : down(trait.traitID, buySellCount);
                      closeModal();
                    }}
                  >
                    Confirm
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-16 pb-20">
              <div
                className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-2 h-[50px] w-[140px]"
                onClick={closeModal}
              >
                <div className="-mt-2.5">Go Back</div>
                <ReplyIcon style={{ color: "white" }} fontSize="small" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Modal
          open={openModal}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-descript ion"
        >
          <Box sx={style} className="font-desc2">
            <div className=" w-full h-full relative px-4 py-2">
              <div
                className="absolute top-4 right-8 cursor-pointer"
                onClick={closeModal}
              >
                <img
                  src="/images/closeIcon.svg"
                  className="brightness-150 hover:brightness-200"
                />
              </div>
              <div className="p-12">
                {isFreeMint ? (
                  <div className="text-lg text-white tracking-wider">
                    How many Editions to Burn ?
                  </div>
                ) : isBuy === false ? (
                  <div className="text-lg text-white tracking-wider">
                    How many traits to cancel ?
                  </div>
                ) : (
                  <div className="text-lg text-white tracking-wider">
                    How many traits to Buy?
                  </div>
                )}
                <div className="flex flex-row justify-between">
                  <div className="w-2/5">
                    <div className="w-[250px] flex flex-row items-center justify-between gap-2 pt-4 pb-2 mt-2">
                      <div className="flex flex-row gap-2">
                        {Array.from(Array(trait?.traitLevel).keys()).map(
                          (_, index) => (
                            <img
                              src="/images/starIcon.svg"
                              className="w-[14px] h-[14px]"
                              key={index}
                            />
                          )
                        )}
                      </div>
                      <div className="text-sm text-white">
                        <div className="-mt-2">
                          x{Number(trait?.traitCount)}
                        </div>
                      </div>
                    </div>
                    <div className="relative w-[250px] h-[250px] bg-[url('/images/manager/infoNFTBG.png')] bg-no-repeat bg-cover p-2 pt-1.5 pr-1 flex justify-center">
                      <img src={trait?.traitSrc} className="rounded-md"></img>
                    </div>
                  </div>
                  <div className="w-3/5 pl-16 pt-8 flex flex-col gap-4 items-center justify-center">
                    <div className="w-[280px] flex justify-between mx-auto">
                      <div className="flex flex-row rounded-full w-[130px] h-[56px] bg-[url('/images/main/numBG.png')] bg-no-repeat bg-cover ">
                        <div className="pl-2 w-3/5 flex justify-center items-center text-white text-base">
                          <div className="-mt-4">x{buySellCount}</div>
                        </div>
                        <div className="w-2/5 h-full flex flex-col text-white">
                          <div className="h-1/2 cursor-pointer flex justify-center items-center rounded-tr-full pr-1 ">
                            <div
                              className="flex justify-center items-center pt-2"
                              onClick={() => {
                                setBuySellCount(
                                  buySellCount < Number(trait?.traitCount)
                                    ? buySellCount + 1
                                    : buySellCount
                                );
                              }}
                            >
                              <img
                                src="/images/main/up.svg"
                                className="w-3 hover:w-4"
                              />
                            </div>
                          </div>
                          <div className="h-1/2  cursor-pointer flex justify-center items-center rounded-br-full pr-1">
                            <div
                              className="flex justify-center items-center pb-2"
                              onClick={() => {
                                setBuySellCount(
                                  buySellCount > 1 ? buySellCount - 1 : 1
                                );
                              }}
                            >
                              <img
                                src="/images/main/down.svg"
                                className="w-3 hover:w-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer flex justify-center items-center text-white text-base w-[112px] h-[56px] bg-[url('/images/main/maxBG.png')] bg-no-repeat bg-cover rounded-full px-3 py-2"
                        onClick={() => {
                          setBuySellCount(Number(trait?.traitCount));
                        }}
                      >
                        <div className="-mt-4">Max</div>
                      </div>
                    </div>
                    <div
                      className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[280px] h-[60px] cursor-pointer text-base text-white text-center py-3 mx-auto mt-4"
                      onClick={() => {
                        isFreeMint || isBuy || isStore
                          ? confirm({
                            trait: trait,
                            buySellCount: buySellCount,
                          })
                          : down(trait.traitID, buySellCount);
                        closeModal();
                      }}
                    >
                      Confirm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
