export default function About() {
  return (
    <div className="pt-16">
      <div className="sm:px-6">
        <div className="flex flex-col sm:flex-row justify-around space-y-8 sm:space-y-0">
          <div className="w-full sm:w-1/2 flex flex-col md:flex-row md:pl-24">
            <img
              src="/images/landing/coin.svg"
              className="w-[150px] h-[150px]"
            />
            <div className="text-[11px] sm:text-base leading-6 md:leading-8 text-black bg-[url('/images/landing/coinTextBG.svg')] bg-cover bg-center bg-no-repeat w-[350px] h-[91px] md:w-[500px] md:h-[129px] pl-4 md:pl-6 py-4 md:py-6 m-auto mt-4 md:m-0 ">
              THROUGH OUR PLATFORM, YOU CAN BUY AND SELL TRAITS WITH ONE
              ANOTHER.
            </div>
          </div>
          <div className="w-full sm:w-1/2 flex flex-col md:flex-row md:px-4 pt-8 md:pt-0">
            <img
              src="/images/landing/star.svg"
              className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] -mt-6"
            />
            <div className="text-[11px] sm:text-base leading-4 text-black bg-[url('/images/landing/starTextBG.svg')] bg-cover bg-center bg-no-repeat w-[350px] h-[175px] md:w-[520px] md:h-[260px] px-6 md:pl-12 md:pr-6 pt-5 md:pt-6 m-auto mt-4 md:mt-0">
              STAKE YOUR HOODYGANG NFT TO GAIN POINTS THAT CAN BE USED TO
              ACQUIRE COMIC BOOKS, AND POSTERS FEATURING YOU AS THE MAIN
              CHARACTER! <br />
              <br />
              JUST SEND US A PICTURE OF YOURSELF AND WE’LL HANDLE THE REST.
            </div>
          </div>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-full sm:w-2/3">
            <div className="flex flex-col md:flex-row sm:px-24">
              <img
                src="/images/landing/key.svg"
                className="w-[150px] h-[150px]"
              />
              <div className="text-[11px] sm:text-base leading-4 mt-4 md:mt-6 md:ml-6 md:leading-6 text-black bg-[url('/images/landing/keyTextBG.svg')] bg-cover bg-center bg-no-repeat w-[350px] h-[151px] md:w-[500px] md:h-[216px] pl-8 pr-6 pt-6 m-auto md:pt-8">
                OUR PLATFORM WILL UPDATE ALL METADATA, ENSURING THE TRAITS YOU
                SELECT ARE STORED ON THE BLOCKCHAIN, SO YOU CAN BE SURE OF THE
                AUTHENTICITY AND OWNERSHIP OF YOUR HOODYGANG NFT.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-16 sm:my-32 w-full">
        <img src="/images/landing/rip.png" className="w-full" />
      </div>
    </div>
  );
}
