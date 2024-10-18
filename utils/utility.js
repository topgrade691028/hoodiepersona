import { BBWL, CommWL, OGWL, URLs, FCFSWL } from "./constants";
import axios from "axios";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { utils } from "ethers";

export const drawImage = async (data) => {
  const res = await axios.post(`${URLs.HoodyBackendURL}/emulate`, { traits: data }, { withCredentials: true }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

const traitPointByRarity = {
  0: 1,
  1: 3,
  2: 9,
};

export const getRarity = (traits) => {
  let totalPoint = 0;
  traits.map((item) => {
    totalPoint += traitPointByRarity[item.rarity];
  });

  if (totalPoint >= 40) return 2;
  else if (totalPoint >= 20) return 1;
  else return 0;
};

export const sortTraits = (traits, option) => {
  let tempList = traits;
  if (option == 0) {
    tempList.sort((a, b) => a.traitLevel - b.traitLevel);
  }
  if (option == 1) {
    tempList.sort((a, b) => b.traitLevel - a.traitLevel);
  } else if (option == 2) {
    tempList.sort((a, b) => a.price - b.price);
  } else if (option == 3) {
    tempList.sort((a, b) => b.price - a.price);
  } else if (option == 4) {
    tempList.sort((a, b) => +b.blockTimestamp - +a.blockTimestamp);
  }

  return tempList;
};

export const getEllipsisTxt = (str, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return '';
};

//merkle tree
const createMerkleProof = async (address, nodes) => {
  const whitelistNodes = nodes.map((x) => {
    return utils.solidityKeccak256(["address"], [x])
  }
  );
  const merkleTree = new MerkleTree(whitelistNodes, keccak256, {
    sortPairs: true,
  });
  const leaf = utils.solidityKeccak256(["address"], [address]);
  const rootHash = merkleTree.getRoot();
  const hexProof = merkleTree.getHexProof(leaf);
  const proof = merkleTree.verify(hexProof, leaf, rootHash);
  return { merkleProof: hexProof, result: proof };
};

export const getMerkleProofs = async (address, phase) => {
  const OGWLProof = await createMerkleProof(address, OGWL);
  const bbMerkleProof = await createMerkleProof(address, BBWL);
  const CommProof = await createMerkleProof(address, CommWL);

  let proofs = [];
  if (OGWLProof.result) proofs.push({ WLTYPE: 0, Proof: OGWLProof.merkleProof });
  if (bbMerkleProof.result) proofs.push({ WLTYPE: 1, Proof: bbMerkleProof.merkleProof });
  if (CommProof.result) proofs.push({ WLTYPE: 2, Proof: CommProof.merkleProof });
  if (phase > 1) {
    const FCFSProof = await createMerkleProof(address, FCFSWL);
    if (FCFSProof.result) proofs.push({ WLTYPE: 3, Proof: FCFSProof.merkleProof });
  }

  return proofs;
}


