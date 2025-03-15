const SkeletonOne = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        What is faucet?
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Faucet is a service that provides small amounts of cryptocurrency for free, usually for testing purposes.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        $UNI
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        UNI token is the governance token of Uniswap, one of the largest decentralized exchanges (DEX) built on Ethereum.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        $DAI
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        DAI token is a decentralized, collateral-backed stablecoin that aims to maintain a 1:1 peg with the US dollar.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        $WETH
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        WETH (Wrapped Ether) is a token that represents ETH (Ethereum) in an ERC-20 compatible form.
      </p>
    </div>
  );
};

const SkeletonFive = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        $USDT
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        USDT (Tether) is a centralized stablecoin pegged to the US dollar, meaning 1 USDT ≈ $1.
      </p>
    </div>
  );
};

const SkeletonSix = () => {
  return (
    <div className="cursor-default">
      <p className="font-bold md:text-4xl text-xl text-white">
        $USDC
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        USDC (USD Coin) is a centralized stablecoin pegged to the US dollar (1 USDC = $1).
      </p>
    </div>
  );
};

export const cardsFaucet = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "/bg-faucet.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "/bg-uni.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "/bg-dai.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "/bg-weth.jpg",
  },
  {
    id: 5,
    content: <SkeletonFive />,
    className: "md:col-span-2",
    thumbnail:
      "/bg-usdt.jpg",
  },
  {
    id: 6,
    content: <SkeletonSix />,
    className: "col-span-1",
    thumbnail:
      "/bg-usdc.jpeg",
  },
];
