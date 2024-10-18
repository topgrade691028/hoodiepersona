import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { useMediaQuery } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NftCard from "./nftCard";
import { URLs } from "../../utils/constants";

function SlideNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute left-1/2 cursor-pointer w-full flex justify-center items-center"
      //   style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      <img src="/images/sliderNext.svg" className="h-6 brightness-150 hover:brightness-200" />
    </div>
  );
}

function SlidePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute right-1/2  cursor-pointer w-full flex justify-center items-center"
      onClick={onClick}
    >
      <img src="/images/sliderPrev.svg" className="h-6 brightness-150 hover:brightness-200" />
    </div>
  );
}

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

export default function SwitchNftModal({
  nftList = [],
  sliderCount = 3,
  switchNFT = () => {},
  openModal = false,
  onClose = () => {},
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: false,
    adaptiveHeight: false,
    nextArrow: <SlideNextArrow />,
    prevArrow: <SlidePrevArrow />,
  };

  return (
    <div>
      {isPhoneMode && openModal ? null : (
        <Modal
          open={openModal}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-descript ion"
        >
          <Box sx={style} className="font-desc2">
            <div className=" w-full h-full relative px-4 py-2">
              <div
                className="absolute top-8 right-8 cursor-pointer"
                onClick={onClose}
              >
                <img src="/images/closeIcon.svg" className="brightness-150 hover:brightness-200"/>
              </div>
              <div className="pt-14">
                <Slider
                  {...settings}
                  className="flex flex-row justify-start items-center px-8"
                >
                                    
                  {nftList.map((item, index) => (
                    <NftCard
                    imgSrc={
                      URLs.HoodyGateway +
                      item.metadata.image.split("://")[1]
                    }
                    nftId={item.tokenId}
                    nftLevel={item.rarity + 1}
                    onSwitch
                    clickSwitch = {() => {switchNFT(item); onClose()}}
                    key={index}
                  />
                  ))}
                 
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div className="w-[251px] h-0" key={i} />
                    ))}
                </Slider>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
