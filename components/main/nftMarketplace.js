import Router from "next/router";
import { URLs } from "../../utils/constants";
export default function NftMarketplace() {
  return (
    <div className="flex-1 relative bg-[url('/images/main/mobileModalBG.png') md:bg-[url('/images/main/mainBG.webp')]  bg-center bg-no-repeat bg-cover">
      <div className="py-48 px-8 w-full flex flex-col items-center gap-6 md:gap-16">
        <div className="text-xs md:text-2xl text-white text-center md:leading-10">
          To Buy Hoody Please Visit Our Page :
        </div>
        <div className="w-[350px] h-[62px] h- md:w-[800px] md:h-[142px] bg-[url('/images/nftMarket/linkBG.png')] bg-cover bg-no-repeat flex flex-row">
          <div
            className="w-1/2 flex cursor-pointer justify-center items-center"
          >
            <a
              href={URLs.OpenseaURL}
              target="_new"
              className="no-underline"
            >
              <img
                src="/images/nftMarket/opensea.png"
                className="w-[100px] md:w-[250px] m-auto"
              />
            </a>

          </div>
          <div
            className="w-1/2 flex cursor-pointer justify-center items-center"
            onClick={() => {
              Router.push("/");
            }}
          >
            <img
              src="/images/nftMarket/blur.png"
              className="w-[70px] md:w-[200px] m-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
