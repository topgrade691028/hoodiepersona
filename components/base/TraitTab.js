import { attrDic } from "../../utils/constants";

export default function TraitTab({ traitTab, setTraitTab, items=[] }) {

  return (
    <div className="w-full flex flex-row justify-between pb-4">
      {items.map((item, index) => (
        <div className="flex flex-row items-center space-x-2" key={index}>
          <div
            className={`${
              traitTab === index ? "border-b-2 border-[#f1c357] " : " "
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
    </div>
  );
}
