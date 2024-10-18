import Head from "next/head";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "@rainbow-me/rainbowkit/styles.css";

import Landing from "../components/home/landing";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <div className="bg-[url('/images/landing/mobileBG.webp')] sm:bg-[url('/images/landing/mainBG.webp')] bg-no-repeat bg-cover">
        <Header />
        <Landing />
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
