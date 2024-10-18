import StarIcon from "@mui/icons-material/Star";
import InfoIcon from "@mui/icons-material/Info";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

export default function NftCard({
  nftId = 346,
  staked = false,
  onSwitch = false,
  selected = false,
  nftLevel = 2,
  lastTime,
  edit = false,
  freeMintAmount = 0,
  imgSrc = "",
  name = "",
  migrate = () => {},
  isMigrate = false,
  isFreeMint = false,
  isOG = false,
  setOpen,
  openBuy,
  updateClaim = () => {},
  clickSwitch = () => {},
}) {
  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const [timeLeft, setTimeLeft] = useState(
    staked ? 86400 - ((Math.floor(Date.now() / 1000) - lastTime) % 86400) : 0
  );

  const isPhoneMode = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(86400);
      updateClaim();
    }
  }, [timeLeft]);

  return (
    <div className="">
      <div
        className={`relative w-[225px] h-[311px] bg-[url('/images/manager/nftBG.svg')] bg-cover bg-no-repeat ${isPhoneMode ? " " : "hover:bg-[url('/images/manager/nftOverBG.svg')]"} ${selected ? "bg-[url('/images/manager/nftOverBG.svg')]" : " "}`}
      >
        <div className="absolute -top-3 right-1">
          {!onSwitch && !isOG && !isFreeMint && (
            <InfoIcon
              style={{ color: "white" }}
              fontSize="small"
              onClick={handleOpen}
              className="cursor-pointer"
            />
          )}
        </div>
        {isFreeMint && (
          <div className="absolute top-6 right-4">
            <div className="text-white text-xs">x{Number(freeMintAmount)}</div>
          </div>
        )}

        <div className="absolute top-1 left-5">
          {Array.from(Array(nftLevel).keys()).map((item, index) => (
            <StarIcon key={index} style={{ color: "white" }} fontSize="small" />
          ))}
        </div>
        <div className="absolute bg-[url('/images/manager/nftimgBG.png')] bg-cover bg-no-repeat w-[196px] h-[193px] top-[50px] flex justify-center ml-[15px] pt-2">
          <img src={imgSrc} className="w-[184px] h-[182px]" />
        </div>
        <div className="absolute bottom-12 left-6 text-white text-[9px]">
          {isOG ? name : `ID: ${nftId}`}
        </div>
        {onSwitch ? (
          <div className="absolute bottom-3 right-6">
            <div
              className="cursor-pointer w-[74px] h-[34px] bg-[url('/images/manager/buttonBG.png')] bg-cover bg-no-repeat text-white text-[9px] py-3 text-center"
              onClick={clickSwitch}
            >
              <div className="-mt-1.5">Switch</div>
            </div>
          </div>
        ) : staked ? (
          <div className="absolute bottom-3 right-5">
            <div className=" text-white text-[9px]">
              {Math.floor(timeLeft / 3600) + "h"}:
              {Math.floor((timeLeft % 3600) / 60) + "m"}
              {(timeLeft % 60) + "s"}
            </div>
          </div>
        ) : edit ? (
          <div className="absolute bottom-3 right-6">
            {!isOG && (
              <div
                className="cursor-pointer w-[74px] h-[34px] bg-[url('/images/manager/buttonBG.png')] bg-cover bg-no-repeat text-white text-[9px] py-3 text-center"
                onClick={(event) => {
                  Router.push({
                    pathname: "/main/nft_edit",
                    query: { nftID: nftId },
                  });
                }}
              >
                <div className="-mt-1.5">Edit</div>
              </div>
            )}
            {isOG && (
              <div className="text-white text-[9px] py-3 text-center">
                <div className="-mt-1.5">OG NFT</div>
              </div>
            )}
          </div>
        ) : isFreeMint ? (
          <div className="absolute bottom-3 right-6">
            <div
              className="cursor-pointer w-[74px] h-[34px] bg-[url('/images/manager/buttonBG.png')] bg-cover bg-no-repeat text-white text-[9px] py-3 text-center"
              onClick={openBuy}
            >
              <div className="-mt-1.5 pl-1">FreeMint</div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 right-6">
            {!isMigrate && (
              <div
                className="cursor-pointer w-[74px] h-[34px] bg-[url('/images/manager/buttonBG.png')] bg-cover bg-no-repeat text-white text-[9px] py-3 text-center"
                onClick={migrate}
              >
                <div className="-mt-1.5 pl-1">Migrate</div>
              </div>
            )}
            {isMigrate && (
              <div className="text-white text-[9px] py-3 text-center">
                <div className="-mt-1.5">Migrated</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
