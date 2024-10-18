import { useEffect, useState } from "react";
import { wlTypeDic } from "../../utils/constants";

export default function MintDropDown({
  options,
  setMintOption = () => {},
  mintOption,
}) {
  const [open, setOpen] = useState(false);
  const [mintValue, setMintValue] = useState("");
  const handleOpenSort = () => {
    setOpen(!open);
  };
  useEffect(() => {
    setMintValue(wlTypeDic[options[mintOption]?.type]);
  }, [mintOption]);
  return (
    <div
      className="relative cursor-pointer flex flex-row justify-between items-end md:mt-3"
      onClick={handleOpenSort}
    >
      <div className="w-[180px] h-[42px] text-white text-[10px] font-semibold bg-[url('/images/landing/mintOption.png')] bg-no-repeat bg-cover pt-[8px] text-center">
        {mintValue}
      </div>
      {open && (
        <div className="absolute w-[170px] bg-[#381313] top-10 left-1/2 -translate-x-1/2 z-50 border-2 border-white rounded-lg flex justify-center flex-col bg-[#21232A] mt-2">
          {options.map((item, index) => (
            <div
              className={`cursor-pointer h-10 px-4 flex flex-row justify-between items-center ${index < options.length - 1 ? "border-b-2 border-white" : ""}  hover:bg-slate-500`}
              onClick={() => {
                setOpen(!open);
                setMintOption(index);
              }}
              key={index}
            >
              <div className="text-white text-[10px] w-full">
                <div className="-mt-2 text-center">{wlTypeDic[item.type]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
