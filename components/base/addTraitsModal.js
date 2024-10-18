import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { URLs } from "../../utils/constants";
import axios from "axios";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { addNewTraits } from "../../utils/interact";
import { parseEther } from "viem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 487,
  p: 4,
};

const attr = {
  1: "Background",
  2: "Hoodie",
  3: "Chain",
  4: "Eyes",
  5: "Hand",
  6: "Mouth",
  7: "Hat",
}

export default function AddTraitsModal({
  openModal = false,
  onClose = () => { },
}) {
  const fileInputRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState([]);
  const [attribute, setAttribute] = useState(0);

  const [traits, setTraits] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const setTraitAmount = (index, amount) => {
    const temp = JSON.parse(JSON.stringify(traits));
    temp[index].amount = amount;
    setTraits(temp);
  }

  const setTraitPrice = (index, price) => {
    const temp = JSON.parse(JSON.stringify(traits));
    temp[index].price = price;
    setTraits(temp);
  }

  const setTraitRarity = (index, rarity) => {
    const temp = JSON.parse(JSON.stringify(traits));
    temp[index].rarity = rarity;
    setTraits(temp)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleUpload = async () => {
    setIsLoading(true)
    try {
      let tempTraits = [];
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("images", image);
        tempTraits.push({ name: image.name.substring(0, image.name.indexOf(".png")), amount: 0, rarity: 0, price: 0 })
      });
      formData.append("attribute", attr[attribute]);
      const result = await axios.post(`${URLs.HoodyBackendURL}/uploadImages`, formData, { withCredentials: true }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      if (result.data.isSuccess) {
        toast.success("Uploaded images successfully!");
        setTraits(tempTraits)
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
    setIsLoading(false)
  }

  const addTraits = async () => {
    let traitsNames = []
    let traitsPrices = []
    let traitsRarities = []
    let traitsAmounts = []

    traits.map((trait) => {
      traitsNames.push(trait.name);
      traitsRarities.push(trait.rarity);
      traitsAmounts.push(trait.amount);
      traitsPrices.push(parseEther(trait.price.toString()));
    })
    const data = {
      attrId: attribute,
      traitNames: traitsNames,
      traitRarities: traitsRarities,
      traitPirces: traitsPrices,
      traitAmounts: traitsAmounts,
    }

    setIsLoading(true)
    await addNewTraits(data);
    setIsLoading(false)
  }

  useEffect(() => {
    const checkDuplicate = async () => {
      let names = [];

      setIsLoading(true)
      for (var index in selectedImages) {
        names.push(selectedImages[index].name);
      }
      try {
        const result = await axios.post(`${URLs.HoodyBackendURL}/checkImageDuplicate`, { attribute: attr[attribute], traits: names }, { withCredentials: true }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (result.data.length > 0) {
          toast.warn(`These Images already exist: ${result.data.toString()}`)
        }
      } catch (error) {
        toast.error(error)
      }

      setIsLoading(false)
    }
    if (selectedImages.length > 0) {
      checkDuplicate()
    }
  }, [attribute])

  return (
    <div>
      {isLoading && (
        <div className="fixed left-0 right-0 top-[60px] md:top-[80px] bottom-[0px] md:bottom-[0px] flex justify-center items-center backdrop-blur-sm bg-white/5 z-50">
          <ReactLoading type="spinningBubbles" color="#fff" />
        </div>
      )}
      {openModal && (
        <Modal
          open={openModal}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-descript ion"
          className="z-40"
        >
          <Box sx={style} className="border-4 rounded-2xl bg-black bg-opacity-40">
            <div className="w-full h-full relative px-4 py-2">
              <div
                className="absolute right-4 cursor-pointer"
                onClick={() => {
                  setSelectedImages([]);
                  setAttribute(0);
                  setTraits([]);
                  onClose();
                }}
              >
                <img src="/images/closeIcon.svg" className="brightness-150 hover:brightness-200" />
              </div>
              <div className="flex flex-row gap-6">
                <div>
                  <input ref={fileInputRef} type="file" accept=".png" onChange={handleFileChange} multiple hidden />
                  <button className="rounded-md py-1 px-2 text-white bg-blue-800 hover:bg-blue-600"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Import
                  </button>
                </div>
                {selectedImages.length > 0 && (
                  <div className="flex flex-row gap-6">
                    <select value={attribute} onChange={(e) => setAttribute(e.target.value)} className="text-white bg-yellow-600 rounded text-center py-1">
                      <option value="0" disabled>Select Attribute</option>
                      <option value="1">Background</option>
                      <option value="2">Hoodie</option>
                      <option value="3">Chain</option>
                      <option value="4">Eyes</option>
                      <option value="5">Hand</option>
                      <option value="6">Mouth</option>
                      <option value="7">Hat</option>
                    </select>
                    {attribute > 0 && (
                      <button className="rounded-md py-1 px-2 text-white bg-red-800 hover:bg-red-600"
                        onClick={handleUpload}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                )}
              </div>
              {traits.length > 0 && (
                <div className="flex flex-col">
                  <div className="mt-2 h-[340px]">
                    <table className="table-fixed text-white w-full text-center border">
                      <thead className="border">
                        <tr>
                          <th className="w-1/12">No</th>
                          <th className="border w-5/12">TraitName</th>
                          <th className="border w-2/12">Price</th>
                          <th className="border w-2/12">Rarity</th>
                          <th className="border w-2/12">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          traits.map((item, index) => {
                            return (
                              <tr className="border" key={index}>
                                <td>{index + 1}</td>
                                <td className="border">{item.name}</td>
                                <td className="border"><input className="w-full text-black text-center" value={item.price} onChange={(e) => setTraitPrice(index, e.target.value)} /></td>
                                <td className="border">
                                  <select className="text-white bg-yellow-600 rounded text-center py-1 w-full" value={item.rarity} onChange={(e) => setTraitRarity(index, e.target.value)}>
                                    <option value="0">Common</option>
                                    <option value="1">Rare</option>
                                    <option value="2">Legendary</option>
                                  </select></td>
                                <td className="border"> <input className="w-full text-black text-center" value={item.amount} onChange={(e) => setTraitAmount(index, e.target.value)} /></td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full">
                    <button className="w-fit rounded-md py-1 px-2 text-white bg-blue-800 hover:bg-blue-600 float-right"
                      onClick={addTraits}
                    >
                      Add New Traits
                    </button>
                  </div>

                </div>
              )
              }
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
