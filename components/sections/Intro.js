import { useEffect, useState } from "react";
import { getCurrentPhase, getLeftTime, getPublicPrice, getReferral, getWLMintStatus, publicMint, wlMint } from "../../utils/interact";
import ReactLoading from "react-loading";
import { useAccount, useWalletClient, useNetwork } from "wagmi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatEther, isAddress } from "viem";
import { getMerkleProofs } from "../../utils/utility";
import MintDropDown from "../base/mintDropDown";
import { mintText } from "../../utils/constants";
import CountDown from "../base/countDown";
import { useMediaQuery } from "@mui/material";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import CrossMint from "../base/crossMint";

export default function Intro() {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const { data: signer } = useWalletClient();

  const [currentPhase, setCurrentPhase] = useState(3);
  const [proofs, setProofs] = useState([]);
  const [mintInfo, setMintInfo] = useState([]);
  const [mintOption, setMintOption] = useState(0);
  const [maxNum, setMaxNum] = useState(100);
  const [publicPrice, setPublicPrice] = useState(0);
  const [amount, setAmount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0)

  const [referralCode, setReferralCode] = useState(
    "MHhFMGI5ZEVhNTNhOTBCN2EyOTg2MzU2MTU3ZTI4MTJlNTMzNUE0YTFE"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const isPhoneMode = useMediaQuery("(max-width:900px)");

  const mint = async () => {
    setIsMinting(true);

    if (signer && chains[0]?.id == chain?.id) {
      if (currentPhase == 3 && mintInfo.length == 0) {
        let referAddress;
        try {
          referAddress = atob(referralCode.trim());
        } catch {
          toast.error("Invalid Referral Code!");
          return;
        }
        if (isAddress(referAddress)) {
          const checkResult = await getReferral(referAddress);
          if (checkResult) {
            await publicMint(referAddress, amount, publicPrice * BigInt(amount));
          } else {
            toast.error("Invalid Referral Code!");
          }
        } else {
          toast.error("Invalid Referral Code!");
        }
      } else {
        await wlMint(amount, mintInfo[mintOption].type, mintInfo[mintOption].proof, mintInfo[mintOption].price);
      }

    } else toast.warn("Please connect wallet to Goerli.");
    setIsMinting(false);
  };

  useEffect(() => {
    if (mintInfo.length > 0) setMaxNum(mintInfo[mintOption].amount);
    else setMaxNum(100);
  }, [mintOption, mintInfo])

  useEffect(() => {
    const initMintInfo = async () => {
      let data = []
      setIsLoading(true)
      for (var proof of proofs) {
        const info = await getWLMintStatus(address, currentPhase, proof.WLTYPE);
        if (info.amount > 0) data.push({ type: proof.WLTYPE, amount: info.amount, price: info.price, proof: proof.Proof });
      }
      setMintInfo(data);
      setIsLoading(false)
    }

    initMintInfo()
  }, [proofs])

  const init = async () => {
    setIsLoading(true)
    const phase = await getCurrentPhase();
    setCurrentPhase(phase);

    if (phase < 3) {
      const time = await getLeftTime(+phase + 1)
      setTimeLeft(time)
    }

    const price = await getPublicPrice();
    setPublicPrice(price);
    const merkleProofs = await getMerkleProofs(address, phase)
    setProofs(merkleProofs);
    setIsLoading(false)
  }

  useEffect(() => {
    if (signer)
      init();
  }, [signer])

  return (
    <div className="md:px-4 sm:px-20 pb-4 sm:pb-16 sm:pt-40 md:pt-0 md:-mt-20 md:ml-10 text-white">
      <div className="hidden md:block">
        <div className="text-[45px] leading-[100px] ">
          WELCOME TO THE HOODYGANG
        </div>
        <div className="text-[13px] mt-2 leading-10">
          OUR ENTRANCE ONTO THE NFT SCENE WAS NOTHING SHORT OF LEGENDARY.
          <br /> KNOWN FOR BEING LOVABLE YET SLIGHTLY UNHINGED CHARACTERS,
          <br /> WE ALWAYS TELL IT LIKE IT IS. IN A SPACE BRIMMING WITH FACADES AND PRETENSE,
          <br /> OUR TRANSPARENCY IS A BREATH OF FRESH AIR.
        </div>
      </div>
      <div className="block md:hidden mt-24">
        <img src="/images/landing/content1.svg" className="w-[280px] m-auto" />
      </div>
      <div className="text-[12px] md:text-[13px] mt-8 leading-10">
        {!isPhoneMode || currentPhase != 3 ? (
          <pre className="font-desc2 text-center md:text-left">{mintText[currentPhase]}</pre>
        ) : (
          <div className="font-desc2 text-center">
            Phase 3<br />
            OG holders: 10 @0.019 + 10 @0.016 +<br />
            unlimited mints @0.022<br />
            Building Block holders: 10 @0.022 + 10 @0.019 +<br />
            unlimited mints @0.025<br />
            Community WL: 10 @0.025 + 10 @0.022 + <br />
            unlimited mints @0.028<br />
            FCFS WL Collabs: 10 @0.028 + 10 @0.025 +<br />
            unlimited mints @0.030<br />
            Public: unlimited mints @0.030<br />
          </div>
        )}
      </div>
      {
        currentPhase < 3 && (
          <CountDown timeLeft={timeLeft} init={init} />
        )
      }
      {currentPhase > 0 ? (
        <div className="flex flex-col w-fit justify-center mx-auto md:ml-0 sm:py-0 mt-16 text-black">
          {!isLoading && (
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="mx-auto">
                  {mintInfo.length > 1 && (
                    <MintDropDown options={mintInfo}
                      setMintOption={setMintOption}
                      mintOption={mintOption} />
                  )}
                </div>
                {
                  (mintInfo.length > 0 || currentPhase == 3) && (
                    <div className="flex flex-row gap-2">
                      <button
                        className="bg-[url('/images/landing/mintBtn.png')] bg-cover bg-no-repeat w-[250px] h-[50px] text-xl md:text-base hover:underline text-bold"
                        onClick={() => mint()}
                        disabled={isMinting || (currentPhase < 3 && mintInfo.length == 0)}
                      >
                        {isMinting ? (
                          <div className="flex flex-row justify-center items-center gap-2">
                            <div className="-mt-3">Minting Now</div>
                            <ReactLoading type="spin" color="#000" height={20} width={20} />
                          </div>
                        ) : (
                          <>
                            <div className="-mt-3">MINT</div>
                          </>
                        )}
                      </button>

                      <div className="flex flex-row rounded-full w-[106px] h-[45px] bg-[url('/images/landing/numBG.png')] bg-no-repeat bg-cover mt-1 mx-auto">
                        <div className="pl-2 w-3/5 flex justify-center items-center text-black text-[10px]">
                          <div className="-mt-2">x{amount}</div>
                        </div>
                        <div className="w-2/5 h-full flex flex-col text-black">
                          <div className="h-1/2 cursor-pointer flex justify-center items-center rounded-tr-full pr-1 ">
                            <div
                              className="flex justify-center items-center pt-2"
                              onClick={() => {
                                setAmount(
                                  amount + 1 <= maxNum ? amount + 1 : maxNum
                                );
                              }}
                            >
                              <img
                                src="/images/landing/up.svg"
                                className="w-3 hover:w-4"
                              />
                            </div>
                          </div>
                          <div className="h-1/2  cursor-pointer flex justify-center items-center rounded-br-full pr-1">
                            <div
                              className="flex justify-center items-center pb-2"
                              onClick={() => {
                                setAmount(
                                  amount > 1 ? amount - 1 : 1
                                );
                              }}
                            >
                              <img
                                src="/images/landing/down.svg"
                                className="w-3 hover:w-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

              </div>
              {
                mintInfo.length == 0 && currentPhase == 3 ? (
                  <textarea
                    className="mx-auto w-[320px] h-[120px] text-sm p-6 bg-transparent text-white mt-8 overflow-hidden leading-6 border-white border-2 rounded-xl"
                    placeholder="Enter referral code."
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                ) : (
                  !isPhoneMode && (<div className="h-[100px]" />)
                )
              }
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col mt-20 text-center w-full md:w-5/12 gap-8">
          <div className="text-[36px] md:text-[56px]">MINTING 21/12</div>
          {
            currentPhase == 0 && (
              <div className="mt-20"></div>
            )
          }
        </div>
      )}

      {isPhoneMode && (
        <div className="mt-8">
          <CrossMint />
        </div>
      )}
      <div className={`md:hidden bg-[url('/images/landing/frameMobile.svg')] bg-cover bg-center bg-no-repeat w-[350px] h-[370px] m-auto ${currentPhase == 3 ? "mt-4" : "mt-12"} `}>
        <div className="text-sm text-black px-8 py-6 leading-7 text-center">
          OUR ENTRANCE ONTO THE NFT SCENE WAS NOTHING SHORT OF LEGENDARY. KNOWN
          FOR BEING LOVABLE YET SLIGHTLY UNHINGED CHARACTERS, WE ALWAYS TELL IT
          LIKE IT IS. IN A SPACE BRIMMING WITH FACADES AND PRETENSE, OUR
          TRANSPARENCY IS A BREATH OF FRESH AIR.
        </div>
      </div>
    </div>
  );
}
