import { Grid, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

import Router from "next/router";
import MenuIcon from "@mui/icons-material/Menu";

import Account from "../Account";

export default function Header({ color = false, ...props }) {
  const [phoneMenuShow, setPhoneMenuShow] = useState(false);
  const toggleDrawer = (show) => () => {
    setPhoneMenuShow(show);
  };
  const navitem = [
    { to: "/main", label: "GO TO MAIN APP" },
    { to: "/whitepaper", label: "WHITE PAPER" },
  ];
  return (
    <>
      {phoneMenuShow == true ? (
        <div className="fixed top-0 w-full font-desc2">
          <div className="bg-[url('/images/main/mobileMenuBG.webp')] bg-no-repeat bg-cover h-screen w-full">
            <div className="flex flex-row justify-center py-4">
              <div className="fixed top-0 right-0 pr-4 py-4">
                <img
                  src="/images/closeIcon.svg"
                  className="h-5 hover:brightness-200"
                  onClick={toggleDrawer(false)}
                ></img>
              </div>
            </div>
            <div className="pt-24">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl text-white">HOODYGANG</div>
                <img
                  src="/images/main/mobileTitleBottom.png"
                  className="mt-5 w-[240px]"
                />
              </div>
              <div className=" tracking-wider mt-12">
                <div className="flex justify-center">
                  <div
                    onClick={() => {
                      setPhoneMenuShow(!phoneMenuShow);
                      Router.push("/main");
                    }}
                  >
                    <div className="text-xl text-white py-8">
                      GO TO MAIN APP
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    onClick={() => {
                      setPhoneMenuShow(!phoneMenuShow);
                      Router.push("/whitepaper");
                    }}
                  >
                    <div className="text-xl text-white py-4">WHITE PAPER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <></>
        </div>
      ) : (
        <div className="w-full bg-[#561515] bg-opacity-95 md:bg-transparent z-50 py-2 md:py-12 px-0 md:px-20 tracking-wider font-desc2">
          <Grid container className="items-center">
            <Grid
              item
              lg={0}
              md={0}
              sm={2}
              xs={2}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <div
                className="pr-2 flex justify-center"
                onClick={() => {
                  setPhoneMenuShow(!phoneMenuShow);
                }}
              >
                <MenuIcon style={{ color: "white" }} />
              </div>
            </Grid>
            <Grid item lg={2} md={2} sm={8} xs={8}>
              <div
                className="cursor-pointer flex justify-center sm:justify-start md:-mt-28 text-white"
                onClick={() => {
                  Router.push("/");
                }}
              >
                <img
                  src="/images/logo.png"
                  className="hidden md:block w-[70px] md:w-[140px] h-[70px] md:h-[140px]"
                />
                <div className="md:hidden text-2xl ml-6 -mt-6">HOODYGANG</div>
              </div>
            </Grid>

            <Grid
              item
              container
              lg={10}
              md={10}
              sm={2}
              xs={2}
              className="md:bg-[url('/images/landing/headerBG.png')] bg-no-repeat bg-cover text-black py-2 md:h-[223px]"
            >
              <Grid
                item
                lg={9}
                md={9}
                sm={0}
                xs={0}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <div className="flex flex-row items-center justify-around space-x-2 md:leading-[60px]">
                  {navitem.map((items, itemIndex) => (
                    <div
                      className="cursor-pointer flex justify-center hover:underline"
                      key={itemIndex}
                    >
                      <div
                        onClick={() => {
                          Router.push(items.to);
                        }}
                        className="py-4"
                      >
                        <div className="text-[16.67px] -mt-2.5">
                          {items?.label ?? ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>

              <Grid
                item
                lg={3}
                md={3}
                sm={0}
                xs={0}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <div className="flex justify-end mt-4">
                  <Account />
                </div>
              </Grid>
              <Grid
                item
                lg={0}
                md={0}
                sm={12}
                xs={12}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <div className="flex justify-center -mt-2">
                  <Account />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}
