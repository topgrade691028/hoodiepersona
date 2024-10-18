export default function AboutBelieve() {
  return (
    <div className="h-full flex flex-col justify-around items-center ">
      <img src="/images/landing/emo.svg" className="w-[1200px] hidden md:block"/>
      <div className="flex justify-center px-4 sm:px-0 sm:pb-32 md:pb-0 mt-8 md:mt-20">
        <div className="w-[370px] h-[166px] md:w-[750px] md:h-[335px] bg-[url('/images/landing/frame4.svg')] bg-cover bg-center bg-no-repeat flex justify-center px-4 py-5 md:px-8 md:py-8">
          <div className="text-[9px] md:text-sm text-black md:leading-8">
            HOODYGANG OFFERS A NEW AND EXCITING WAY TO SHARE YOUR DIGITAL SELF
            THROUGH THE MEDIUM OF NFTS. BY ALLOWING FOR THE CUSTOMIZATION OF
            INTERCHANGEABLE TRAITS, WE ARE ENABLING INDIVIDUALS TO CREATE TRULY
            ENJOYABLE HOODYGANG MEMBERS THAT REFLECT THEIR PERSONAL TASTE,
            PERSONALITY, AND INTERESTS. <br />
            <br />
            JOIN US IN THIS JOURNEY AND GANGIFY YOURSELF!
          </div>{" "}
        </div>
      </div>

      <div className="flex justify-center px-4 sm:px-0 pb-32 md:pb-0 mt-8 md:mt-16">
        <div className="w-[370px] h-[115px] md:w-[750px] md:h-[220px] bg-[url('/images/landing/frame5.svg')] bg-cover bg-center bg-no-repeat flex justify-center px-4 py-4 md:px-12 md:py-8">
          <div className="text-[9px] md:text-sm text-black md:leading-7">
            IT IS WORTH MENTIONING THAT THIS IS ONLY A SMALL PART OF A BIGGER
            PLAN THAT WE HAVE IN STORE. WE ARE CONSTANTLY WORKING ON NEW
            DEVELOPMENTS TO ENHANCE THE OVERALL EXPERIENCE. STAY TUNED; YOU
            DON’T WANT TO MISS OUT ON WHAT’S COMING NEXT.
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
