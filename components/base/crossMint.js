import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { getCurrentPhase, getPublicPrice } from "../../utils/interact";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { formatEther } from "viem";

export default function CrossMint() {
    const { data: signer } = useWalletClient();

    const [amount, setAmount] = useState(1)
    const [currentPhase, setCurrentPhase] = useState(0);
    const [publicPrice, setPublicPrice] = useState(0);

    useEffect(() => {
        const init = async () => {
            const phase = await getCurrentPhase();
            setCurrentPhase(phase);

            const price = await getPublicPrice();
            setPublicPrice(price);
        }

        if (signer)
            init()
    }, [signer])
    return (
        <>
            {currentPhase == 3 && (
                <div className="flex flex-row justify-center gap-2">
                    <CrossmintPayButton
                        collectionId="8c3d0ae1-5253-45e7-94b6-44b42b172101"
                        projectId="9a3536ac-3290-49ff-aa2d-bcf342ac588e"
                        mintConfig={{ "totalPrice": (formatEther(publicPrice) * amount).toString(), "_amount": amount }}
                        checkoutProps={{
                            display: "same-tab",
                            paymentMethods: ["ETH", "fiat"],
                        }}
                        environment="production"
                        className="bg-[url('/images/landing/mintBtn.png')] bg-cover bg-no-repeat w-[250px] h-[50px] bg-transparent font-desc2 text-sm"
                    />
                    <div className="flex flex-row rounded-full w-[106px] h-[45px] bg-[url('/images/landing/numBG.png')] bg-no-repeat bg-cover mt-1">
                        <div className="pl-2 w-3/5 flex justify-center items-center text-black text-[10px]">
                            <div className="-mt-2">x{amount}</div>
                        </div>
                        <div className="w-2/5 h-full flex flex-col text-black">
                            <div className="h-1/2 cursor-pointer flex justify-center items-center rounded-tr-full pr-1 ">
                                <div
                                    className="flex justify-center items-center pt-2"
                                    onClick={() => {
                                        setAmount(
                                            amount + 1 <= 100 ? amount + 1 : 100
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
            )}
        </>
    )
}