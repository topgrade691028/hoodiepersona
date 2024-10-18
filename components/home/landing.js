import React from "react";
import ScrollToTop from "react-scroll-to-top";
import GetHoodyGang from "../sections/GetHoodyGang";
import Intro from "../sections/Intro";
import WelcomeHoody from "../sections/WelcomeHoody";
import About from "../sections/About";
import OfferDescription from "../sections/OfferDescription";
import ShareDescription from "../sections/ShareDescription";
import Thankyou from "../sections/Thankyou";
import AboutBelieve from "../sections/AboutBelieve";

export default function Landing() {
  return (
    <>
      <div>
        <div className="font-desc2">
          <Intro />
          <WelcomeHoody />
          <GetHoodyGang />
          <About />
          <OfferDescription />
          <ShareDescription />
          <AboutBelieve />
          <Thankyou />
          <ScrollToTop
            smooth
            component={<img src="/images/scrollToTop.png" />}
            style={{ background: "transparent" }}
          ></ScrollToTop>
        </div>
      </div>
    </>
  );
}
