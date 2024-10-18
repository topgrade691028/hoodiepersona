import { useEffect, useState } from "react";

export default function Dropdown({
  options,
  setSortOption = () => {},
  sortOption,
}) {
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const handleOpenSort = () => {
    setOpenSort(!openSort);
  };
  useEffect(() => {
    setSortValue(options[sortOption]?.sortItem);
    setSortDirection(options[sortOption]?.direction);
  }, [sortOption]);
  return (
    <div
      className="relative cursor-pointer flex flex-row justify-between items-end w-[130px] md:mt-3"
      onClick={handleOpenSort}
    >
      <div className="text-white text-[10px] font-semibold hover:underline">
        {sortValue}
      </div>
      <div className="text-white text-[16px] -mt-3">
        <div className="pb-0.5">{sortDirection}</div>
      </div>
      {openSort && (
        <div className="absolute w-[160px] bg-[#381313] top-10 left-1/2 -translate-x-1/2 z-50 border-2 border-white rounded-lg flex justify-center flex-col bg-[#21232A]">
          {options.map((item, index) => (
            <div
              className={`cursor-pointer h-10 px-4 flex flex-row justify-between items-center ${index < options.length - 1 ? "border-b-2 border-white" : ""}  hover:bg-slate-500`}
              onClick={() => {
                setOpenSort(!openSort);
                setSortOption(item.option);
              }}
              key={index}
            >
              <div className="text-white text-[10px]">
                <div className="-mt-2">{item.sortItem}</div>
              </div>
              <div className="text-white text-md">
                <div className="-mt-6">{item.direction}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
