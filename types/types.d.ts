type HexAddress = `0x${string}`;

interface Window {
  ethereum?: import('ethers').providers.ExternalProvider;
}