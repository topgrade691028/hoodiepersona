import { useState } from "react";
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

export default function AddModal({
  trait = {},
  openModal = false,
  confirm = () => {},
  onClose = () => {},
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  const [buySellCount, setBuySellCount] = useState(1);
  const closeModal = () => {
    onClose();
    setBuySellCount(1);
  };

  return (
    <div>
      {isPhoneMode && openModal ? (
        <div className="min-h-screen ml-[2px] mt-[35px] bg-[url('/images/main/mobileModalBG.png')] bg-cover w-full bg-cover w-full z-20">
          <div className="flex flex-col ">
            <div className="w-full px-4 py-16">
              <div className="">
                <div className="text-base text-white">
                  Adding Trait #{trait?.traitID}
                </div>
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
                      <div className="-mt-2">x{trait?.traitCount}</div>
                    </div>
                  </div>
                  <div className="relative rounded-md bg-[url('/images/editor/nftTraitBG.png')] bg-no-repeat bg-cover p-2 pt-1.5 flex justify-center">
                    <img src={trait?.traitSrc}></img>
                  </div>
                </div>
                <div className="flex-1 pl-4 pr-4 flex flex-col gap-4">
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="text-white text-sm">Current</div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-white text-sm">
                        {trait?.traitSalePrice}
                      </div>
                      <img
                        src="/images/main/ethIcon.svg"
                        className="h-6 mt-2"
                      />
                    </div>
                  </div>
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
                                buySellCount < trait?.traitCount
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
                    <div className="flex pl-4">
                      <div
                        className="cursor-pointer flex justify-center items-center text-white text-[10px] w-[76px] h-[38px] bg-[url('/images/main/maxBG.png')] bg-no-repeat bg-cover rounded-full px-3 py-2"
                        onClick={() => {
                          setBuySellCount(trait?.traitCount);
                        }}
                      >
                        <div className="-mt-2">Max</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[180px] h-[40px] cursor-pointer text-xs text-white text-center mx-auto pt-2"
                    onClick={() => {
                      confirm({
                        trait: trait.traitID,
                        buySellCount: buySellCount,
                      });
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
                onClick={onClose}
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
              <div className="p-12 pt-8">
                <div className="text-base text-white tracking-wider">
                  Adding Trait #{trait?.traitID}
                </div>
                <div className="flex flex-row justify-between">
                  <div className="w-2/5">
                    <div className="flex flex-row items-center justify-between gap-2 pt-4 pb-2">
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
                        <div className="-mt-2">x{trait?.traitCount}</div>
                      </div>
                    </div>
                    <div className="relative w-full bg-[url('/images/manager/infoNFTBG.png')] bg-no-repeat bg-cover p-2 pt-1.5 pr-1 flex justify-center">
                      <img src={trait?.traitSrc} className="rounded-md"></img>
                    </div>
                  </div>
                  <div className="w-3/5 pl-16 pt-8 flex flex-col gap-4 mt-4">
                    <div className="w-[280px] flex flex-row justify-between px-4 mx-auto pb-4">
                      <div className="text-white text-base -mt-1">
                        Current price{" "}
                      </div>
                      <div className="flex flex-row">
                        <div className="text-white text-base -mt-1 mr-2">
                          {trait?.traitSalePrice}
                        </div>
                        <img src="/images/main/ethIcon.svg" className="w-6" />
                      </div>
                    </div>
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
                                  buySellCount < trait?.traitCount
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
                          setBuySellCount(trait?.traitCount);
                        }}
                      >
                        <div className="-mt-4">Max</div>
                      </div>
                    </div>
                    <div
                      className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[280px] h-[60px] cursor-pointer text-base text-white text-center py-3 mx-auto mt-4"
                      onClick={() => {
                        confirm({
                          trait: trait.traitID,
                          buySellCount: buySellCount,
                        });
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
