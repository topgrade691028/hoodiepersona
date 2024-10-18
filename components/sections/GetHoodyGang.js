export default function GetHoodyGang() {
  return (
    <div className="hidden md:block px-4 sm:px-20 mt-28 pb-12 relative">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 sm:space-y-0">
        <div className="w-full md:w-5/12">
          <img src="/images/landing/content1.svg" className="w-full px-12"/>
        </div>
        <div className="w-full md:w-7/12 px-10">
          <div className="bg-[url('/images/landing/frame1.svg')] bg-cover bg-center bg-no-repeat w-[800px] h-[252px] justify-center">
            <div className="text-base text-black px-6 py-14 leading-10">
              THE CUSTOMIZATION PROCESS IS USER FRIENDLY AND INTUITIVE, ALLOWING
              EVEN THOSE WITH LITTLE TECHNICAL EXPERTISE TO CREATE AN NFT WITH
              TRAIT COMBOS OF THEIR OWN CHOOSING.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
