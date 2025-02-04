import ContractAbi from "../abi/AlignedLayerServiceManager.json" with { type: "json" };
import { getContract, PublicClient } from 'viem'
import { AlignedVerificationData } from "./types.js";

export { verifyProofOnchain };

const verifyProofOnchain = async (
  verificationData: AlignedVerificationData,
  chain: "devnet" | "holesky" = "holesky",
  provider: PublicClient
) => {
  const contractAddress =
    chain === "devnet"
      ? "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8"
      : "0x58F280BeBE9B34c9939C3C39e0890C81f163B623";
  
  const contract = getContract({
    address: contractAddress,
    abi: ContractAbi.abi,
    // 1a. Insert a single client
    client: provider
  });

  const flatMerklePath =
  verificationData.batchInclusionProof.merkle_path.flat();

  
  const result: boolean = await contract.read.verifyBatchInclusion([
    verificationData.verificationDataCommitment.proofCommitment,
    verificationData.verificationDataCommitment.publicInputCommitment,
    verificationData.verificationDataCommitment.provingSystemAuxDataCommitment,
    verificationData.verificationDataCommitment.proofGeneratorAddr,
    verificationData.batchMerkleRoot,
    flatMerklePath,
    verificationData.indexInBatch]) as boolean;

  return result;
};
