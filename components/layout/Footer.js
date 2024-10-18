import React from "react";
import { URLs } from "../../utils/constants";
export default function Footer() {
  return (
    <>
      <div className="w-full bg-[#561515] px-4 md:px-12 py-4 font-desc2">
        <div className="w-full flex justify-between items-center flex-col md:flex-row space-y-8 md:space-y-0">
          <div className="cursor-pointer text-xl flex justify-center sm:justify-start text-white -mt-3">
            HOODYGANG
          </div>
          <div className="text-white hidden md:block">
            <div className="-mt-3">
              HOODYGANG © 2023 COPYRIGHT
            </div>
          </div>
          <div className="">
            <div className="flex flex-row items-center space-x-4 ">
              <a
                href={URLs.OpenseaURL}
                target="_new"
                className="no-underline"
              >
                <img src="/images/OpenSeaLink.svg" className="cursor-pointer" />
              </a>
              <a
                href={URLs.TwitterURL}
                target="_new"
                className="no-underline"
              >
                <img src="/images/TwitterLink.svg" className="cursor-pointer" />
              </a>
              <a
                href={URLs.DiscordURL}
                target="_new"
                className="no-underline"
              >
                <img src="/images/DiscordLink.svg" className="cursor-pointer" />
              </a>
            </div>
          </div>
          <div className="text-white block md:hidden pb-1">
            HOODYGANG © 2023 COPYRIGHT
          </div>
        </div>
      </div>
    </>
  );
}
