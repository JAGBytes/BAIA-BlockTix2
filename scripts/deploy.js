const { ethers } = require("hardhat");
const fs = require("fs/promises");
const path = require("path");

async function main() {
  const frontendAbisPath = path.join(__dirname, "../frontend/src/abis");

  const BoletoEvento = await ethers.getContractFactory("BoletoEvento");
  const contract = await BoletoEvento.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ Contrato desplegado en:", contractAddress);

  await fs.mkdir(frontendAbisPath, { recursive: true });

  // Dirección
  await fs.writeFile(
    path.join(frontendAbisPath, "contract-address.json"),
    JSON.stringify({ BoletoEvento: contractAddress }, null, 2)
  );

  // ABI
  const artifact = require("../artifacts/contracts/BoletoEvento.sol/BoletoEvento.json");
  await fs.writeFile(
    path.join(frontendAbisPath, "BoletoEvento.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("📄 ABI y dirección guardados en frontend");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
