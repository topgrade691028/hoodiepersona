import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";

function SlideNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="flex justify-center items-center rounded-full border border-white translate-x-8 w-8 p-1 aspect-square"
      //   style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      <ArrowForwardIosIcon style={{ color: "white" }} fontSize="sm" />
    </div>
  );
}

function SlidePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="flex justify-center items-center rounded-full border border-white -translate-x-8 w-8 p-1 aspect-square"
      // style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    >
      <ArrowBackIosNewIcon style={{ color: "white" }} fontSize="sm" />
    </div>
  );
}

export default function TraitCategoryTab() {
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: true,
    adaptiveHeight: false,
    nextArrow: <SlideNextArrow />,
    prevArrow: <SlidePrevArrow />,
  };
//   const [tab, setTab] = useState(0);
  const [traitTab, setTraitTab] = useState(0);
  return (
    <div className="">
      <div className="block md:hidden py-4">
        <Slider {...settings} className="flex flex-row items-center space-x-4">
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(0);
              }}
            >
              Head
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(1);
              }}
            >
              Body
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(2);
              }}
            >
              Eyes
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(3);
              }}
            >
              Mouth
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(4);
              }}
            >
              Accessories
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div
              className="cursor-pointer text-white text-sm font-bold"
              onClick={() => {
                setTraitTab(5);
              }}
            >
              Background
            </div>
            <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
              3
            </div>
          </div>
        </Slider>
      </div>
      <div className="flex justify-center">
        <div className="hidden md:block py-4 w-full md:w-2/3">
          <div className="w-full flex flex-row justify-between py-4">
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 0 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(0);
                }}
              >
                Head
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 1 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(1);
                }}
              >
                Body
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 2 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(2);
                }}
              >
                Eyes
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 3 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(3);
                }}
              >
                Mouth
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 4 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(4);
                }}
              >
                Accessories
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`${
                  traitTab === 5 ? "border-b-2 border-yellow-600 " : ""
                }cursor-pointer text-white text-sm font-bold`}
                onClick={() => {
                  setTraitTab(5);
                }}
              >
                Background
              </div>
              <div className="rounded-full bg-white text-sm font-bold w-4 h-4 flex justify-center items-center p-1">
                3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
