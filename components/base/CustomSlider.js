import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { attrDic } from "../../utils/constants";

function SlideNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute -right-8 cursor-pointer w-5 flex justify-center items-center"
      onClick={onClick}
    >
      <img src="/images/next.svg" className="h-5" />
    </div>
  );
}

function SlidePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute -left-8  cursor-pointer w-5 flex justify-center items-center"
      onClick={onClick}
    >
      <img src="/images/prev.svg" className="h-5" />
    </div>
  );
}
export default function CustomSlider({ traitTab, setTraitTab, items = [] }) {
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

  return (
    <Slider {...settings} className="flex flex-row items-center">
      {items.map((item, index) => (
        <div className="flex flex-row items-center space-x-2" key={item.label}>
          <div
            className={`${
              traitTab === index ? "border-b-2 border-[#f1c357] " : ""
            }cursor-pointer text-white text-sm font-bold pb-3`}
            onClick={() => {
              setTraitTab(index);
            }}
          >
            {attrDic[item.label]}
          </div>
          <div className="rounded-full bg-white text-[10px] text-center font-bold w-4 h-4 flex justify-center items-center p-1">
            <div className="-mt-2 text-[#9B0000]">
              {item.count}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}
