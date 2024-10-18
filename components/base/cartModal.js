import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ReplyIcon from "@mui/icons-material/Reply";

import { useMediaQuery } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SlideNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute left-1/2 cursor-pointer w-full flex justify-center items-center"
      //   style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      <img
        src="/images/sliderNext.svg"
        className="h-6 brightness-150 hover:brightness-200"
      />
    </div>
  );
}

function SlidePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute right-1/2  cursor-pointer w-full flex justify-center items-center"
      // style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    >
      <img
        src="/images/sliderPrev.svg"
        className="h-6 brightness-150 hover:brightness-200"
      />
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

function TraitCard({ trait = {}, updateCart = () => {} }) {
  const deleteTrait = () => {
    updateCart({
      trait: trait.trait,
      buySellCount: 0,
    });
  };
  const removeItem = () => {
    if (trait.buySellCount > 1) {
      updateCart({
        trait: trait.trait,
        buySellCount: trait.buySellCount - 1,
      });
    }
  };

  return (
    <>
      <div
        className="relative w-[150px] h-[185px] bg-[url('/images/store/cartTraitBG.webp')] bg-cover flex flex-col justify-between"
        style={{ backgourndSize: "100%, 100%" }}
      >
        <div className="h-[40px] w-full flex flex-row justify-between items-center gap-2">
          <div className="w-3/4 overflow-hidden text-xs text-white text-ellipsis whitespace-nowrap pl-3 leading-8 -mt-2">
            {trait.trait.traitName}
          </div>
          <div className="w-1/4 flex flex-row justify-end gap-2 pr-2.5 pt-1">
            <div
              className="cursor-pointer bg-[url('/images/circleCloseIcon.svg')] hover:bg-[url('/images/circleCloseIcon_hover.svg')] w-4 h-4 bg-no-repeat bg-center bg-contain"
              onClick={deleteTrait}
            ></div>
          </div>
        </div>
        <div className="absolute h-[106px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full px-2">
          <div className="flex flex-row justify-between pt-2">
            <div className="flex flex-row gap-1 pl-2">
              {Array.from(Array(trait.trait.traitLevel).keys()).map(
                (_, index) => (
                  <img
                    src="/images/starIcon.svg"
                    className="w-[10px] h-[10px]"
                    key={index}
                  />
                )
              )}
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-row items-center gap-1">
                <div className="text-[9px] text-white">
                  <div className="-mt-2">{trait.trait.price}</div>
                </div>
                <img src="/images/main/ethIcon.svg" className="h-3 w-3" />
                <div className="text-[9px] text-white">
                  <div className="-mt-2">x{trait.buySellCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-0.5">
            <img src={trait.trait.traitSrc} className="w-[87px] h-[87px]" />
          </div>
        </div>
        <div className="h-[30px] flex flex-row justify-between items-center items-center">
          <div className="flex flex-row w-1/3 justify-center">
            <div
              className="cursor-pointer text-lg text-white font-bold"
              onClick={removeItem}
            >
              <div className="pl-4 -mt-[30px]">―</div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 pr-2">
            <div className="text-xs text-white">
              <div className="-mt-4 text-[9px]">
                {trait.buySellCount * trait.trait.price}
              </div>
            </div>
            <img src="/images/main/ethIcon.svg" className="h-4 w-4 -mt-1.5" />
          </div>
        </div>
      </div>
    </>
  );
}

export default function CartModal({
  myPoint = 0,
  totalPoint = 0,
  carts = [],
  openModal = false,
  checkOut = () => {},
  updateCart = () => {},
  onClose = () => {},
}) {
  const isPhoneMode = useMediaQuery("(max-width:900px)");
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: false,
    adaptiveHeight: false,
    nextArrow: <SlideNextArrow />,
    prevArrow: <SlidePrevArrow />,
  };

  return (
    <div>
      {isPhoneMode && openModal ? (
        <div className="min-h-screen ml-[2px] mt-[67px] w-full z-20">
          <div className="flex flex-col  px-8">
            <div className="flex flex-row justify-between py-4">
              <div className="flex flex-row justify-center items-center space-x-2 text-white text-base">
                <div className="-mt-3.5">Cart</div>
                <img src="/images/addIcon.svg" className="h-5" />
              </div>
              <div className="flex flex-row gap-2">
                <div className="text-base text-white -mt-1.5">Balance:</div>
                <div className="flex flex-row items-center gap-1">
                  <div className="rounded-full bg-[#FF1D1D] text-sm text-white font-bold flex justify-center items-center pt-2 pb-3 px-3">
                    <div className="-mt-2">{(+myPoint).toLocaleString()}</div>
                  </div>
                  <img src="/images/main/ethIcon.svg" className="h-7" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 place-items-center pt-12">
              {carts.map((item, index) => (
                <TraitCard trait={item} updateCart={updateCart} key={index} />
              ))}
            </div>
            <div className="w-full border-b-2 border-white border-dashed pt-12"></div>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex flex-row gap-2">
                <div className="text-base text-white -mt-1">Total:</div>
                <div className="flex flex-row gap-1">
                  <div className="rounded-full bg-[#FF1D1D] text-base text-white font-bold h-8 flex justify-center items-center  px-3">
                    <div className="-mt-3">{totalPoint}</div>
                  </div>
                  <img src="/images/main/ethIcon.svg" className="h-8" />
                </div>
              </div>
              <div className="py-4 pt-12">
                <div
                  className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center -mt-2"
                  onClick={() => {
                    checkOut();
                    onClose();
                  }}
                >
                  <div className="-mt-2.5 pr-1">Check Out</div>
                </div>
              </div>
              <div
                className="cursor-pointer bg-[url('/images/main/buttonBG.png')] bg-cover bg-no-repeat flex flex-row justify-center items-center text-white text-xs px-2 h-[50px] w-[140px] mb-32"
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
              <div className="flex flex-row justify-center relative px-8 py-8">
                <div className="absolute top-8 left-8 flex flex-row gap-2">
                  <div className="text-base text-white">Balance :</div>
                  <div className="flex flex-row items-center gap-1">
                    <div className="rounded-full bg-[#FF1D1D] text-base text-white h-6 flex justify-center items-center h-[38px] px-3">
                      <div className="-mt-3">{(+myPoint).toLocaleString()}</div>
                    </div>
                    <img src="/images/main/ethIcon.svg" className="h-6 w-6" />
                  </div>
                </div>
                <div className="w-full flex flex-row justify-center items-center space-x-2  text-white text-base">
                  <div className="-mt-2">Cart</div>
                  <img src="/images/addIcon.svg" className="h-6 mt-1" />
                </div>
              </div>
              <div
                className="absolute top-8 right-8 cursor-pointer"
                onClick={onClose}
              >
                <img
                  src="/images/closeIcon.svg"
                  className="brightness-150 hover:brightness-200"
                />
              </div>
              <Slider {...settings} className="flex flex-row items-center px-8">
                {carts.map((item, index) => (
                  <TraitCard
                    trait={item}
                    updateCart={updateCart}
                    key={index}
                  />
                ))}
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div className="w-[251px] h-0" key={i} />
                  ))}
              </Slider>
              <div className="px-8 py-4">
                <div className="w-full border-b-4 border-white"></div>
                <div className="flex flex-row justify-between pt-8">
                  <div className="flex flex-row gap-2">
                    <div className="text-base text-white">Total:</div>
                    <div className="flex flex-row gap-1">
                      <div className="rounded-full bg-[#FF1D1D] text-base text-white h-6 flex justify-center items-center h-[38px] px-3">
                        <div className="-mt-3">
                          {(+totalPoint).toLocaleString()}
                        </div>
                      </div>
                      <img
                        src="/images/main/ethIcon.svg"
                        className="h-6 w-6 mt-2"
                      />
                    </div>
                  </div>
                  <div
                    className="cursor-pointer flex flex-row justify-center w-[160px] h-[55px] bg-[url('/images/store/buttonBG.png')] bg-no-repeat bg-cover text-white text-xs rounded-full items-center -mt-2"
                    onClick={() => {
                      checkOut();
                      onClose();
                    }}
                  >
                    <div className="-mt-2.5 pr-1">Check Out</div>
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
