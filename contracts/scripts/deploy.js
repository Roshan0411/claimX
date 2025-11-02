const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ParametricInsurance contract to Sepolia...");

  // Get the contract factory
  const ParametricInsurance = await ethers.getContractFactory("ParametricInsurance");

  // Deploy the contract
  const contract = await ParametricInsurance.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("✅ ParametricInsurance deployed to:", contractAddress);
  console.log("🔗 Etherscan URL: https://sepolia.etherscan.io/address/" + contractAddress);
  
  // Update the environment variables
  console.log("\n📝 Update your environment variables:");
  console.log("REACT_APP_CONTRACT_ADDRESS=" + contractAddress);
  
  // Optional: Verify deployment
  try {
    console.log("\n🔍 Verifying contract deployment...");
    const admin = await contract.admin();
    console.log("Contract admin:", admin);
    console.log("✅ Contract deployed successfully!");
  } catch (error) {
    console.log("❌ Error verifying deployment:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });