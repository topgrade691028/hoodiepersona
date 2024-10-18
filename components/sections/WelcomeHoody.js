import { useMediaQuery } from "@mui/material";
import CrossMint from "../base/crossMint";

export default function WelcomeHoody() {
  const isPhoneMode = useMediaQuery("(max-width:900px)");

  return (
    <div className="px-4 sm:px-20 pb-12">
      {!isPhoneMode && (
        <CrossMint />
      )}
      <div className="hidden md:block text-white mt-6 text-xs text-center w-4/5 m-auto leading-6">
        NOW, WE'RE EXCITED TO PRESENT THE HOODYGANG’S OWN DAPP, AN NFT PLATFORM
        LIKE NO OTHER.<br /> IT'S YOUR CHANCE TO CREATE A DIGITAL REPRESENTATION OF
        YOURSELF THAT'S AS REAL AS YOU ARE.<br /> DIVE INTO A WORLD WHERE AUTHENTICITY
        REIGNS SUPREME.
      </div>
      <div className="block md:hidden">
        <img src="/images/landing/mobileNFT.svg" className="w-[280px] m-auto" />
      </div>
    </div>
  );
}
