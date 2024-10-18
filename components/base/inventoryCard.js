import Image from "next/image";

export default function InventoryCard({
  traitLevel = 2,
  traitCount = 3,
  name = "Trait Name",
  traitSrc = "/images/traitHead.svg",
  handleView = () => {},
}) {
  return (
    <div
      className="relative w-[137px] h-[171px] bg-[url('/images/editor/traitBG.png')] bg-cover bg-no-repeat flex flex-col justify-between"
    >
      <div className="h-[40px] w-full flex flex-row justify-between gap-2 p-2">
        <div className="w-3/4 overflow-hidden text-[10px] -mt-2 leading-8 text-white text-ellipsis whitespace-nowrap">
          {name}
        </div>
        <div className="w-1/4 flex flex-row justify-end gap-2">
          <div
            className="mt-1.5 cursor-pointer bg-[url('/images/previewIcon.svg')] hover:bg-[url('/images/previewIcon_hover.svg')] w-3 h-3 bg-no-repeat bg-center bg-contain"
            onClick={handleView}
          ></div>
        </div>
      </div>
      <div className="absolute h-[131px] bottom-4 w-full px-2">
        <div className="flex flex-row relative justify-between pt-3">
          <div className="flex flex-row gap-1">
            {Array.from(Array(traitLevel).keys()).map((item, index) => (
              <img
                src="/images/starIcon.svg"
                className="w-[10px] h-[10px] mt-1"
                key={index}
              />
            ))}
          </div>
          <div className="absolute text-[8px] text-white right-0 top-2.5">x{traitCount}</div>
        </div>
        <div className="flex justify-center items-center pt-1">
          <img src={traitSrc} className="w-[110px] h-[110px]" />
        </div>
      </div>
    </div>
  );
}
