async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const Token = await ethers.getContractFactory('Copyright');
    const contract = await Token.deploy();

    console.log('Contract deployed at:', contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
