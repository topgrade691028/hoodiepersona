import Image from "next/image";
import React from "react";
import ScrollToTop from "react-scroll-to-top";
import Router from "next/router";

export default function WhitePaper() {
  return (
    <div className="w-full md:w-[1024px] min-h-screen bg-[url('/images/whitepaper/wpMobileBG.png')] md:bg-[url('/images/whitepaper/wpBG.webp')] bg-top bg-no-repeat bg-cover mx-auto px-6 md:px-10 overflow-hidden font-desc2">
      <div className="flex flex-col pt-12">
        <div
          className="relative cursor-pointer m-auto"
          onClick={() => {
            Router.push("/");
          }}
        >
          <img src="/images/logo.png" className="pb-2 w-[120px] h-[120px]" />
        </div>
        <div className="w-full text-[50px] text-white text-start md:text-center">
          WhitePaper
        </div>
      </div>
      <div className="pt-16">
        <div className="text-3xl text-white pb-4">Introduction</div>
        <div className="text-sm text-white leading-6 pt-2">
          HoodyGang presents a revolutionary platform for customizing NFTs
          through interchangeable traits. Our platform is community-oriented and
          designed with a tech/cyber and pseudo-anime aesthetic, reflecting our
          commitment to innovation and the future of technology. With slogans
          like "Wear Your Vibe, Change Your Tribe" and "Your Style, Your Rules",
          we aim to empower our users to truly make their NFTs their own.
        </div>
      </div>
      <div className="">
        <div className="text-3xl text-white py-8">Problem</div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[300px] h-[51px] bg-[url('/images/whitepaper/problemBG.png')] bg-no-repeat bg-cover rounded-md px-3 py-3 flex flex-row gap-3 justify-center items-center">
            <img src="/images/sadIcon.svg" className="h-6" />
            <div className="text-white text-sm">
              <div className="-mt-2">Lack of Quality Artwork</div>
            </div>
          </div>
          <div className="w-[300px] h-[51px] bg-[url('/images/whitepaper/problemBG.png')] bg-no-repeat bg-cover rounded-md px-4 py-3 flex flex-row gap-4 justify-center items-center">
            <img src="/images/angryIcon.svg" className="h-6" />
            <div className="text-white text-sm">
              <div className="-mt-2">Constrained Creativity</div>
            </div>
          </div>
          <div className="w-[300px] h-[51px] bg-[url('/images/whitepaper/problemBG.png')] bg-no-repeat bg-cover rounded-md px-4 py-3 flex flex-row gap-4 justify-center items-center">
            <img src="/images/sad1Icon.svg" className="h-6" />

            <div className="text-white text-sm">
              <div className="-mt-2">More of the Same</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-white py-6 leading-6">
          Currently, NFTs on the market lack customization options, resulting in
          several drawbacks. These include narrow appeal, lack of uniqueness,
          constrained creativity, limited collaboration, and inability to keep
          up with market trends. This limits the potential value and resale
          potential of NFTs, as well as the engagement and sense of ownership
          for buyers.
        </div>
      </div>
      <div className="">
        <div className="text-3xl text-white">Solution</div>
        <div className="text-sm text-white py-6 leading-6">
          HoodyGang NFT solves these issues by providing an aesthetically
          customizable NFT platform through interchangeable traits featuring
          comic style art painstakingly designed by a professional comic book
          artist, Pungky. Our HoodyGang dapp UI allows users to easily manage
          and customize their NFTs, giving them the unique HoodyGanglity they
          deserve. Our staking system and HoodyGang Market provide additional
          opportunities for HoodyGanglization and collaboration.
        </div>
        <div className="flex flex-row justify-center gap-6 sm:justify-between py-4 overflow-hidden">
          <img src="/images/whitepaper/solutionImg1.webp" className="w-2/5 sm:w-1/6" />
          <img src="/images/whitepaper/solutionImg2.webp" className="w-2/5 sm:w-1/6" />
          <img
            src="/images/whitepaper/solutionImg3.webp"
            className="hidden sm:block w-1/6"
          />
          <img
            src="/images/whitepaper/solutionImg4.webp"
            className="hidden sm:block w-1/6"
          />
          <img
            src="/images/whitepaper/solutionImg5.webp"
            className="hidden sm:block w-1/6"
          />
        </div>
      </div>
      <div className="">
        <div className="text-3xl text-white py-6">Brand statement</div>
        <div className="text-sm text-white leading-6">
          HoodyGang provides pro comics style NFT profile pictures with deep,
          ongoing customization of aesthetic features to reflect what you’re all
          about. We evolve with you, your style, even your mood.
        </div>
        <div className="text-3xl text-white py-6">Vision statement</div>
        <div className="text-sm text-white leading-6">
          We envision a brand that provides connections and creativity to our
          audience with new capabilities, concepts and ideas that drive the
          future of Web3. If we don’t have a trait you want, just ask and we’ll
          make it for you.
        </div>
        <div className="text-3xl text-white py-6">HoodyGang UI</div>
        <div className="text-sm text-white leading-6">
          Our HoodyGang dapp UI is the central hub for all things HoodyGang. It
          includes features such as the HoodyGang Manager, staking, HoodyGang
          Trait Store, and the HoodyGang Market. This easy-to-use interface
          allows users to interact with their HoodyGang NFTs, view their traits,
          and stake their NFTs all in one place.
        </div>
        <div className="py-8">
          <img src="/images/whitepaper/ui.webp" className="w-full h-full" />
        </div>
      </div>
      <div className="">
        <div className="text-3xl text-white py-6 leading-[55px]">
          Staking for HoodyGang Points and the HoodyGang Trait Store
        </div>
        <div className="text-sm text-white mt-4 leading-6">
          Our HoodyGang UI offers a simple staking system for our NFT holders.
          By holding their NFT in their Ethereum wallet and completing a few
          simple steps, users can view their current staking status and track
          their HoodyGang Points earned in real-time. The longer someone stakes
          their NFT, the more HoodyGang Points they will earn. However, there’s
          a little more to it!
        </div>
        <div className="text-base text-white py-4">
          There are 3 levels to staking potential - Common, Rare, and Legendary.
        </div>
        <div className="text-sm text-white leading-6">
          Staking reward brackets will yield the following HoodyGang Points
          quantities: Each trait has a value to reflect its rarity, resulting in
          a cumulative score to determine its staking potential.
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-16 py-4 mt-6 w-fit m-auto">
          <div className="flex flex-row items-center gap-4">
            <div className="text-base text-white">
              <div className="-mt-4">Legendary</div>
            </div>
            <img src="/images/symbol1.svg" />
            <div className="text-base text-white">
              {" "}
              <div className="-mt-4">20</div>
            </div>
            <img src="/images/symbol2.svg" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="text-base text-white">
              <div className="-mt-4">Rare</div>
            </div>
            <img src="/images/symbol1.svg" />
            <div className="text-base text-white">
              {" "}
              <div className="-mt-4">10</div>
            </div>
            <img src="/images/symbol2.svg" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="text-base text-white">
              <div className="-mt-4">Common</div>
            </div>
            <img src="/images/symbol1.svg" />
            <div className="text-base text-white">
              {" "}
              <div className="-mt-4">5</div>
            </div>
            <img src="/images/symbol2.svg" />
          </div>
        </div>
        <div className="text-sm text-white leading-6">
          Each trait has a value to reflect its rarity, resulting in a
          cumulative score to determine its staking potential.
        </div>
      </div>
      <div className="mt-6">
        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16 justify-between py-8">
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-col">
            <div className="flex flex-col">
              <div className="md:h-[385px] md:pt-8">
                <img
                  src="/images/whitepaper/explainImg1.webp"
                  className="w-full md:w-4/5"
                />
              </div>
              <div className="flex flex-row mt-16">
                <img src="/images/symbol1.svg" className="w-[50px]" />
                <div className="text-xl text-white pl-6">
                  <div className="-mt-2">Rare</div>
                </div>
              </div>
            </div>
            <div className="py-8">
              <div className="text-base text-[#FFE177]">
                CTRV (Combined Trait Rarity Value):
              </div>
              <div className="text-sm text-white leading-10">
                for staking reward bracket assignment
              </div>
              <div className="text-base text-white leading-8">4-19 Common</div>
              <div className="text-base text-white leading-8">20-39 Rare</div>
              <div className="text-base text-white leading-8">
                40+ Legendary
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-col">
            <div className="flex flex-col">
              <img
                src="/images/whitepaper/explainImg2.webp"
                className="w-full md:w-5/6 mx-auto md:mx-0"
              />
              <div className="flex flex-row mt-14">
                <img src="/images/symbol1.svg" className="w-[50px]" />
                <div className="text-xl text-white px-6">
                  <div className="-mt-2">35</div>
                </div>
                <img src="/images/symbol1.svg" className="w-[50px]" />
                <div className="text-xl text-white pl-6">
                  <div className="-mt-2">Rare</div>
                </div>
              </div>
            </div>
            <div className="py-8">
              <div className="text-base text-[#FFE177]">
                ITRV (Individual Trait Rarity Value):
              </div>
              <div className="text-base text-white leading-8 mt-10">
                1 Common
              </div>
              <div className="text-base text-white leading-8">3 Rare</div>
              <div className="text-base text-white leading-8">9 Legendary</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-white leading-6">
          i.e. A HoodyGang NFT would need 4/7 traits to be of the rarity to
          achieve the desired staking rewards bracket. Example: head-Legendary 9
          pts, body-Legendary 9 pts, face-Legendary 9 pts, eyes-Common 1 pt
          accessory - Rare 3 pts, total - 31 pts; staking rewards bracket
          Rare. These HoodyGang Points can then be exchanged for new and
          exclusive traits that are not available at the time of minting. These
          traits will be released and revised on a scheduled basis, ensuring a
          degree of rarity.
        </div>
        <div className="text-base text-[#FFE177] py-6">
          It's important to note that these HoodyGang Points do not have any
          monetary value and can only be used to acquire new traits on our
          platform. They will not be traded or exchanged for any other
          cryptocurrency or fiat currency.
        </div>
      </div>
      <div className="">
        <div className="text-3xl text-white py-6 leading-10">HoodyGangMarket</div>
        <div className="text-sm text-white leading-6">
          The HoodyGang Market is an exclusive marketplace for HoodyGang
          holders. It allows users to buy and sell traits with each other,
          expanding their customization options and creating even more unique
          NFTs. It's like a digital mall for your NFT.
        </div>
        <div className="text-3xl text-white py-6">Future Plans</div>
        <div className="text-sm text-white leading-6">
          Details on Phase 2 will be revealed closer to mint date, but they will
          include free digital poster art, placement in our comics (just send in
          a picture of yourself), and free comics. We can’t wait to share it
          with you!
        </div>
        <div className="text-3xl text-white py-6">Conclusion</div>
        <div className="text-sm text-white leading-6">
          HoodyGang is excited to bring this new level of customization to the
          NFT community through our interchangeable trait system and our
          game-changing UI. We believe that this will empower our users to feel
          a deeper connection with their NFTs, and we look forward to seeing the
          creative HoodyGang NFT characters they come up with, and we are
          confident that our platform will lead the way in revolutionizing the
          NFT market and changing the way people interact with their digital
          assets.
        </div>
        <div className="py-12">
          <div
            className="relative cursor-pointer m-auto w-[300px] h-[300px]"
            onClick={() => {
              Router.push("/");
            }}
          >
            <img src="/images/logo.png" className="cursor-pointer" />
          </div>
        </div>
      </div>
      <ScrollToTop
        smooth
        component={<img src="/images/scrollToTop.png" />}
        style={{ background: "transparent" }}
      ></ScrollToTop>
    </div>
  );
}
