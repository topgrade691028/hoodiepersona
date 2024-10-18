import Image from "next/image";
import { URLs } from "../../utils/constants";

export default function TraitMarketCard({
  isMobile = false,
  isMine = false,
  price = 0.443,
  traitLevel = 2,
  traitCount = 3,
  traitName = "Trait Name",
  traitTitle = "Trait Title",
  handleView = () => { },
  handleRemove = () => { },
  isAdmin = false,
  setOpenBuy = false,
  setOpenCancel = false,
  setOpenUpdate = false,
}) {
  const handleOpenBuy = () => setOpenBuy(true);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleOpenUpdate = () => setOpenUpdate(true);

  return (
    <div
      className="relative w-[150px] h-[180px] bg-[url('/images/store/traitBG.png')] bg-cover bg-no-repeat flex flex-col justify-between"
      style={{ backgourndSize: "100%, 100%" }}
    >
      <div className="h-[40px] w-full flex flex-row justify-between items-center pl-3 pr-2">
        <div className="w-3/5 overflow-hidden text-[9px] text-white text-ellipsis whitespace-nowrap py-3">
          {traitName}
        </div>
        <div className="w-2/5 flex flex-row justify-end">
          {isAdmin && (
            <div
              className="cursor-pointer bg-[url('/images/main/remove.svg')] hover:bg-[url('/images/main/removeHover.svg')] w-5 h-5 bg-no-repeat bg-center bg-contain mt-2 mr-1"
              onClick={handleRemove}
            ></div>
          )}
          {isMine ? (
            <div
              className="cursor-pointer bg-[url('/images/main/remove.svg')] hover:bg-[url('/images/main/removeHover.svg')] w-[18px] h-[18px] hover:w-3 hover:h-3 bg-no-repeat bg-center bg-contain hover:mr-1 mt-1.5"
              onClick={handleOpenCancel}
            ></div>
          ) : (
            <>
              {!isMobile && (
                <div
                  className="cursor-pointer bg-[url('/images/previewIcon.svg')] hover:bg-[url('/images/previewIcon_hover.svg')] w-4 h-4 bg-no-repeat mt-3 mr-1"
                  onClick={handleView}
                ></div>
              )}
            </>
          )}
        </div>
      </div>
      <div className=" absolute h-[106px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full px-2">
        <div className="flex flex-row justify-between pt-2">
          <div className="flex flex-row gap-1 pl-1">
            {Array.from(Array(traitLevel).keys()).map((item, index) => (
              <img
                src="/images/starIcon.svg"
                className="w-[10px] h-[10px]"
                key={index}
              />
            ))}
          </div>
          <div className="text-[9px] text-white">
            <div className="-mt-2">x{traitCount}</div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-0.5">
          <img src={`${URLs.HoodyBackendURL}/getImage?attribute=${traitTitle}&name=${traitName}.png`} className="w-[90px] h-[90px]" />
        </div>
      </div>
      <div className="h-[38px] flex flex-row justify-between items-center px-2">
        {isMine ? (
          <div
            className="cursor-pointer flex flex-row gap-1 pl-1 pt-1"
            onClick={handleOpenUpdate}
          >
            <Image
              src="/images/updateIcon.svg"
              alt="add Icon"
              width={13}
              height={11}
            />
            <div className="text-[10px] text-white hover:text-[#FFE177] -mt-1.5">
              Price
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer flex flex-row gap-2"
            onClick={handleOpenBuy}
          >
            <div className="text-[9px] text-white hover:text-[#FFE177] -mt-1 pl-2">
              Add
            </div>
            <Image
              src="/images/addIcon.svg"
              alt="add Icon"
              width={13}
              height={11}
            />
          </div>
        )}
        <div className="flex flex-row gap-1 pr-1 pt-1">
          <div className="text-[9px] text-white -mt-1">{price}</div>
          <Image
            src="/images/main/ethIcon.svg"
            alt="ether Icon"
            width={12}
            height={15}
          />
        </div>
      </div>
    </div>
  );
}
