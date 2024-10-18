export default function ShareDescription() {
  return (
    <div className="sm:py-12 md:py-8 flex flex-col sm:flex-row justify-around items-center space-y-8 sm:space-y-0 px-0 sm:px-8">
      <div className="w-full sm:w-1/2 flex justify-end p-6 sm:p-12">
        <img src="/images/landing/content3.svg" className="w-3/4 hidden md:block" />
        <img src="/images/landing/content2.svg" className="w-full md:hidden"/>
      </div>
      <div className="w-full sm:w-1/2 flex md:pl-12">
        <div className="bg-[url('/images/landing/frame3.svg')] w-[370px] h-[297px] sm:w-[600px] sm:h-[483px] bg-cover bg-center bg-no-repeat text-[11px] md:text-base text-black px-6 py-6 md:px-12 md:py-8 md:leading-8 m-auto md:m-0">
          WITH THE HOODYGANG DAPP, YOU CAN SHARE AND TRADE YOUR CUSTOMIZED NFT
          OR ANY OF ITS TRAITS WITH OTHERS, CREATING A VIBRANT ECOSYSTEM OF
          PERSONALIZED DIGITAL PERSONAS.
          <br />
          <br /> DM BLOCK TO GIVE FEEDBACK OR IDEAS FOR NEW TRAITS YOU MAY WANT
          TO TRADE, AS WELL AS TO ADD YOUR LIKENESS TO A COMIC BOOK, AND/OR TO
          GET YOUR PERSONALIZED COMIC BOOK POSTER ART FEATURING YOURSELF ONCE
          YOU’VE ACCRUED ENOUGH POINTS!
        </div>
      </div>
    </div>
  );
}
