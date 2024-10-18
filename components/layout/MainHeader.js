import { Grid } from "@mui/material";
import React, { useState } from "react";

import Router from "next/router";
import MenuIcon from "@mui/icons-material/Menu";

import Account from "../Account";

export default function MainHeader({ color = false, slug = "home", ...props }) {
  const [phoneMenuShow, setPhoneMenuShow] = useState(false);
  const toggleDrawer = (show) => () => {
    setPhoneMenuShow(show);
  };
  const navitem = [
    {
      to: "/main",
      mLabel: "Hoody Manager",
      label: "Manager",
      slug: "home",
    },
    {
      to: "/main/inventory",
      mLabel: "Hoody Inventory",
      label: "Inventory",
      slug: "inventory",
    },
    {
      to: "/main/trait_store",
      mLabel: "Hoody Trait Store",
      label: "Trait Store",
      slug: "trait_store",
    },
    {
      to: "/main/market",
      mLabel: "Hoody Market",
      label: "Market",
      slug: "market",
    },
    {
      to: "/main/ext_market",
      mLabel: "Hoody NFT Market",
      label: "NFT Market",
      slug: "ext_market",
    },
    {
      to: "/main/myOGs",
      mLabel: "MY OGs",
      label: "My OGs",
      slug: "myOGs",
    },
  ];

  return (
    <>
      {phoneMenuShow === true ? (
        <div className="fixed top-0 w-full z-50 bg-[url('/images/main/mobileMenuBG.webp')] bg-no-repeat bg-cover bg-center h-screen">
          <div className=" w-full">
            <div className="flex flex-row justify-center py-4">
              <div className="fixed top-0 right-0 pr-4 py-4">
                <img
                  src="/images/closeIcon.svg"
                  className="h-4 hover:brightness-200"
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
              <div className="flex flex-col items-center justify-center mt-12">
                {navitem.map((items, itemIndex) => (
                  <div
                    className="cursor-pointer flex justify-center"
                    key={itemIndex}
                  >
                    <div
                      className="flex flex-row items-center space-x-4"
                      onClick={() => {
                        setPhoneMenuShow(!phoneMenuShow);
                        Router.push(items.to);
                      }}
                    >
                      <div className="text-xl text-white py-4">
                        {items?.mLabel ?? ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 w-full bg-[#561515] bg-opacity-95 z-50 py-4 md:py-1 px-0 md:px-20">
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
                className=" pr-2 flex justify-center"
                onClick={() => {
                  setPhoneMenuShow(!phoneMenuShow);
                }}
              >
                <MenuIcon style={{ color: "white" }} />
              </div>
            </Grid>
            <Grid item lg={3} md={3} sm={8} xs={8}>
              <div
                className="cursor-pointer flex justify-center sm:justify-start text-white items-center"
                onClick={() => {
                  Router.push("/");
                }}
              >
                <img
                  src="/images/logo.png"
                  className="hidden md:block w-[70px] h-[70px]"
                />
                <div className="text-2xl -mt-6 ml-6">HOODYGANG</div>
              </div>
            </Grid>

            <Grid
              item
              lg={7}
              md={7}
              sm={0}
              xs={0}
              // className="flex justify-center"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <div className="flex flex-row items-center justify-around space-x-4">
                {navitem.map((item, itemIndex) => (
                  <div
                    className="cursor-pointer flex justify-center"
                    key={itemIndex}
                  >
                    <div
                      className="flex flex-col items-center max-w-[120px]"
                      onClick={() => {
                        Router.push(item.to);
                      }}
                    >
                      <img
                        src="/images/main/headerOver.png"
                        className={` ${
                          item.slug === slug ? "block" : "hidden"
                        } px-4`}
                      />
                      <div className="text-xs -mt-2 text-white pt-2 pb-3">
                        {item?.label ?? ""}
                      </div>
                      <img
                        src="/images/main/headerOver.png"
                        className={`w-full ${
                          item.slug === slug ? "block" : "hidden"
                        } px-4`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Grid>

            <Grid
              item
              lg={2}
              md={2}
              sm={0}
              xs={0}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <div className="flex justify-end">
                <Account main />
              </div>
            </Grid>
            <Grid
              item
              lg={0}
              md={0}
              sm={2}
              xs={2}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <div className="flex justify-center -mt-2">
                <Account main />
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}
