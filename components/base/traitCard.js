import Image from "next/image";
import { URLs } from "../../utils/constants";

export default function TraitCard({
  buttonType = "",
  isInventory = false,
  traitlevel = 1,
  traitTitle = "chain",
  traitName = "NONE",
  handleRemove = () => { },
}) {
  return (
    <div className="w-[125px] h-full">
      {isInventory ? null : (
        <div className="flex flex-row justify-between items-center py-2">
          <div className="flex flex-row">
            {Array.from(Array(traitlevel).keys()).map((item, index) => (
              <img src="/images/starIcon.svg" className="w-3 h-3" key={index} />
            ))}
          </div>
          <div className="text-white text-[8px] font-bold pr-1 -mt-2">{traitTitle}</div>
        </div>
      )}
      {
        <div
          className="bg-[url('/images/editor/nftTraitBG.png')] bg-contain bg-no-repeat relative w-full rounded-md  border-transparent border-solid border flex justify-center p-1"
        >
          <img
            src={`${URLs.HoodyBackendURL}/getImage?attribute=${traitTitle}&name=${traitName}.png`}
            className="rounded-lg "
          ></img>
          {buttonType === "remove" && (
            <div
              className="cursor-pointer absolute top-2 right-2 bg-[url('/images/removeIcon.svg')] hover:bg-[url('/images/removeIcon_hover.svg')] w-3 h-3 bg-no-repeat bg-center bg-contain"
              onClick={handleRemove}
            ></div>
          )}
        </div>
      }
    </div>
  );
}
