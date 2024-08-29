const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("deploy", (m) => {
  const token = m.contract("Copyright", 
                            []);
  return { token };
});