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

export default function UpdateModal({
  trait = {},
  openModal = false,
  confirm = () => {},
  onClose = () => {},
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  const [price, setPrice] = useState(0);

  return (
    <div>
      {isPhoneMode && openModal ? (
        <div className="min-h-screen ml-[2px] mt-[35px] bg-[url('/images/main/mobileModalBG.png')] bg-cover w-full z-20">
          <div className="flex flex-col ">
            <div className="w-full px-4 py-12">
              <div className="">
                <div className="text-base text-white">
                  Updating Price Of Trait #{trait?.traitID}
                </div>
              </div>
              <div className="flex flex-row justify-center items-center gap-4 mt-8">
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
                      <div className="text-white text-sm">{trait?.price}</div>
                      <img
                        src="/images/main/ethIcon.svg"
                        className="h-6 mt-2"
                      />
                    </div>
                  </div>
                  <div className="w-[180px] h-[38px] bg-[url('/images/main/inputBG.png')] bg-cover bg-no-repeat px-3 py-2 mx-auto">
                    <div className="w-full text-[10px] flex flex-row justify-between items-center">
                      <input
                        placeholder="Enter the price"
                        className="bg-transparent w-[130px] outline-none text-white pb-1 leading-5"
                        type="number"
                        onChange={(e) => {
                          setPrice(+e.target.value);
                        }}
                      />
                      <img
                        src="/images/main/ethIcon.svg"
                        className="h-4 mt-1"
                      />
                    </div>
                  </div>
                  <div
                    className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[180px] h-[40px] cursor-pointer text-xs text-white text-center mx-auto pt-2"
                    onClick={() => {
                      confirm(trait.traitID, price);
                      onClose();
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
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-descript ion"
        >
          <Box sx={style}>
            <div className=" w-full h-full relative px-4 py-2 font-desc2">
              <div
                className="absolute top-4 right-8 cursor-pointer"
                onClick={onClose}
              >
                <img
                  src="/images/closeIcon.svg"
                  className="brightness-150 hover:brightness-200"
                />
              </div>
              <div className="p-12 pt-8">
                <div className="text-lg text-center text-white">
                  Updating Price of Trait #{trait?.traitID}
                </div>
                <div className="flex flex-row justify-center items-center mt-2">
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
                          {trait?.price}
                        </div>
                        <img src="/images/main/ethIcon.svg" className="w-6" />
                      </div>
                    </div>
                    <div className="w-[280px] h-[60px] bg-[url('/images/main/inputBG.png')] bg-cover bg-no-repeat px-4 pb-2 mx-auto">
                      <div className="flex flex-row text-base pl-6 pt-4">
                        <input
                          placeholder="Enter the price"
                          className="bg-transparent w-[200px] outline-none text-white -mt-2 leading-8"
                          type="number"
                          onChange={(e) => {
                            setPrice(+e.target.value);
                          }}
                        />
                        <img src="/images/main/ethIcon.svg" className="h-8" />
                      </div>
                    </div>
                    <div
                      className="bg-[url('/images/main/confirmBG.png')] bg-cover bg-no-repeat w-[280px] h-[60px] cursor-pointer text-base text-white text-center py-3 mx-auto mt-4"
                      onClick={() => {
                        confirm(trait.traitID, price);
                        onClose();
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
