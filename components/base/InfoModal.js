import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import StarIcon from "@mui/icons-material/Star";
import ReplyIcon from "@mui/icons-material/Reply";

import { useMediaQuery } from "@mui/material";
import { URLs } from "../../utils/constants";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 487,
  p: 8,
  background: "url(/images/main/modalBG.svg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
};

export default function InfoModal({
  data,
  openModal = false,
  onClose = () => {},
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  return isPhoneMode && openModal ? (
    <div className="min-h-screen font-desc2 mt-[67px] md:bg-cover w-full z-20">
      <div className="flex flex-col ">
        <div className="w-full px-6 py-12">
          <div className="flex flex-row px-1 justify-between mb-2">
            <div className="text-xs text-white pt-2">{data?.metadata.name}</div>
            <div className="">
              {Array.from(
                Array(data?.rarity + 1).keys()
              ).map((item, index) => (
                <StarIcon
                  key={index}
                  style={{ color: "yellow" }}
                  fontSize="small"
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-[url('/images/manager/infoNFTBG.png')] bg-cover bg-no-repeat p-2 pt-1.5">
            <img
              src={
                data
                  ? URLs.HoodyGateway + data?.metadata.image.split("://")[1]
                  : ""
              }
              className="w-full rounded-xl"
            />
          </div>
          <div className="text-xs text-white font-bold pl-2 mt-2">
            <a
              href={`${URLs.OpenSeaTokenURL}${data?.tokenId}`}
              target="_blank"
              className="border-b-2 border-white"
            >
              View On Opensea
            </a>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-row px-8 sm:px-12 pb-2">
            <div className="w-7/12 text-sm text-white">Trait Name</div>
            <div className="w-5/12 text-sm text-white pl-2">Rarity</div>
          </div>
          {data &&
            data?.metadata.attributes.map((item, index) => {
              return (
                <div key={index}>
                  <div className="text-[8px] text-white pl-8 sm:pl-12 pb-1">
                    {item.trait_type.toUpperCase()}
                  </div>
                  <div className="flex flex-row bg-[#5f5f5f] bg-opacity-30 py-2">
                    <div className="w-7/12 text-[9px] text-white pl-8 sm:pl-12">
                      <div className="-mt-2">{item.value}</div>
                    </div>

                    <div className="w-5/12 text-[9px] text-white ">
                      <div className="-mt-2">{item.rarity.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-center pt-16 pb-20">
          <div
            className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-4 h-[50px] w-[140px]"
            onClick={onClose}
          >
            <div className="-mt-2.5 mr-2">Go Back</div>
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
        <div className="flex font-desc2 flex-row justify-center items-center w-full h-full relative p-12">
          <div
            className="absolute top-4 right-8 cursor-pointer"
            onClick={onClose}
          >
            <img src="/images/closeIcon.svg" className="hover:brightness-200" />
          </div>
          <div className="w-2/5">
            <div className="flex flex-row px-1 justify-between mb-2">
              <div className="text-xs text-white pt-2">
                {data?.metadata.name}
              </div>
              <div className="pr-4">
                {Array.from(
                  Array(data?.rarity ? data?.rarity + 1 : 0).keys()
                ).map((item, index) => (
                  <StarIcon
                    key={index}
                    style={{ color: "yellow" }}
                    fontSize="small"
                  />
                ))}
              </div>
            </div>
            <div className="w-[250px] bg-[url('/images/manager/infoNFTBG.png')] bg-cover bg-no-repeat p-1">
              <img
                src={
                  data
                    ? URLs.HoodyGateway + data?.metadata.image.split("://")[1]
                    : ""
                }
                className="w-full rounded-xl"
              />
            </div>
            <div className="text-xs text-white font-bold pl-2 mt-2">
              <a
                href={`${URLs.OpenSeaTokenURL}${data?.tokenId}`}
                target="_blank"
                className="border-b-2 border-white"
              >
                View On Opensea
              </a>
            </div>
          </div>
          <div className="w-3/5 pl-10 pr-1">
            <div className="flex flex-row pb-2">
              <div className="w-7/12 text-sm text-white pl-5">Trait Name</div>
              <div className="w-5/12 text-sm text-white">Rarity</div>
            </div>

            {data &&
              data?.metadata.attributes.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="text-[8px] text-white pl-5 pb-1">
                      {item.trait_type.toUpperCase()}
                    </div>
                    <div className="flex flex-row rounded-md bg-black bg-opacity-40 py-2 px-4">
                      <div className="w-7/12 text-[9px] text-white pl-1">
                        <div className="-mt-2">{item.value}</div>
                      </div>

                      <div className="w-5/12 text-[9px] text-white ">
                        <div className="-mt-2">{item.rarity.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
