export default function OfferDescription() {
  return (
    <div className="flex flex-col sm:flex-row justify-around items-center space-y-8 sm:space-y-0 relative">
      <div className="w-full sm:w-1/2 flex justify-center">
        <img src="/images/landing/content2.svg" className="hidden md:block w-3/4 px-12"/>
        <img src="/images/landing/bowl.svg" className="md:hidden px-12 w-full"/>
      </div>
      <div className="w-full sm:w-1/2">
        <div className="bg-[url('/images/landing/frame2.svg')] w-[350px] h-[184px] sm:w-[616px] sm:h-[324px] bg-cover bg-center bg-no-repeat flex justify-center m-auto md:m-0">
          <div className="text-[11px] md:text-base text-black px-6 py-4 md:px-12 md:py-12 leading-4 md:leading-7">
            WE ALSO OFFER A HOODYGANG UI FOR HOLDERS TO VIEW AND MANAGE YOUR
            HOODYGANG NFTS.<br/><br/> THE HOODYGANG UI IS A FUN AND SIMPLE WAY FOR YOU <br/><br/>TO
            INTERACT WITH YOUR HOODYGANG NFTS.
          </div>
        </div>
      </div>
    </div>
  );
}
