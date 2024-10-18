import Image from "next/image";

export default function InventorySellCard({
  trait = {},
  setOpenList = () => {},
  setOpenAdd = () => {},
}) {
  return (
    <div className="relative w-[150px] h-[190px] bg-[url('/images/inventory/inventoryCardBG.png')] bg-cover bg-no-repeat flex flex-col justify-between">
      <div className="h-[40px] w-full flex flex-row justify-between items-center gap-2 pl-3 pr-2">
        <div className="w-3/4 overflow-hidden text-[10px] text-white text-ellipsis whitespace-nowrap leading-8">
          {trait?.traitName}
        </div>
        {trait?.traitOnSale && (
          <div className="w-1/4 flex flex-row justify-end gap-2 pr-1">
            <div className="bg-[url('/images/checkedIcon.svg')] w-3 h-3 bg-no-repeat mt-2 bg-center bg-contain"></div>
          </div>
        )}
      </div>
      <div className="absolute h-[115px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full px-2">
        <div className="relative pt-2">
          <div className="flex flex-row gap-1 px-1">
            {Array.from(Array(trait ? trait.traitLevel + 1 : 0).keys()).map(
              (item, index) => (
                <img
                  src="/images/starIcon.svg"
                  className="w-[10px] h-[10px]"
                  key={index}
                />
              )
            )}
          </div>
          <div className="absolute text-[8px] text-white right-0 top-1">
            x{trait?.traitCount}
          </div>
        </div>
        <div className="flex justify-center items-center mt-1">
          <img src={trait?.traitSrc} className="w-[95px] h-[95px]" />
        </div>
      </div>
      {trait?.traitOnSale ? (
        <div
          className="h-[40px] flex flex-row items-center w-full"
          onClick={setOpenAdd}
        >
          <div className="w-full cursor-pointer flex flex-row justify-center gap-2">
            <div className="text-[9px] text-white hover:underline -mt-1">
              ADD
            </div>
            <Image
              src="/images/addIcon.svg"
              alt="add Icon"
              width={13}
              height={11}
            />
          </div>
        </div>
      ) : (
        <div
          className="h-[40px] flex flex-row items-center w-full"
          onClick={setOpenList}
        >
          <div className="w-full cursor-pointer flex flex-row justify-center gap-2">
            <Image
              src="/images/inventory/listIcon.svg"
              alt="add Icon"
              width={18}
              height={10.5}
            />
            <div className="text-[9px] text-white hover:underline font-bold -mt-1.5">
              LIST
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
