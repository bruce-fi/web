"use client";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { cardsFaucet } from "./FaucetComponents";
import { useStaking } from "@/hooks/query/useStaking";
import { useMintAI } from "@/hooks/mutation/api/useMintAI";
import ButtonMint from "@/components/button/button-mint";
import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";
import { Loader2 } from "lucide-react";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        "object-cover object-center absolute inset-0 h-full w-full transition duration-200"
      )}
      alt="thumbnail"
    />
  );
};

export function FaucetGrid() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const { sData } = useStaking();
  const { mutation: mintMutationAI, result } = useMintAI();
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState<boolean>(false);

  const uniToken = sData?.find((item) => item.nameToken === "UNI");
  const daiToken = sData?.find((item) => item.nameToken === "DAI");
  const wethToken = sData?.find((item) => item.nameToken === "WETH");
  const usdcToken = sData?.find((item) => item.nameToken === "USDC");
  const usdtToken = sData?.find((item) => item.nameToken === "USDT");

  const findToken =
    selectedCard?.id === 2 ? uniToken :
      selectedCard?.id === 3 ? daiToken :
        selectedCard?.id === 4 ? wethToken :
          selectedCard?.id === 5 ? usdtToken :
            selectedCard?.id === 6 ? usdcToken : null;

  const handleMintAI = async () => {
    mintMutationAI.mutate({
      asset_id: findToken?.nameToken.toLowerCase() || '',
      amount: "1000",
    }, {
      onSuccess: () => {
        setIsModalTransactionOpen(true);
      }
    });

  }

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setTransactionStatus("");
  }, []);

  const closeModalTransaction = useCallback(() => {
    setIsModalTransactionOpen(false);
  }, []);

  const getModalTitle = (card: Card | null) => {
    if (!card) return "";
    if (card.id === 1) return "What is Faucet?";

    try {
      const content = card.content as JSX.Element;
      if (content?.props?.children) {
        const titleElement = content.props.children.find(
          (child: { props?: { className?: string } }) => child?.props?.className?.includes('font-bold')
        );
        return titleElement ? `Claim ${titleElement.props.children}` : "Claim Tokens";
      }
      return "Claim Tokens";
    } catch {
      return "Claim Tokens";
    }
  };

  return (
    <div className="w-full h-screen py-10">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-4">
        {cardsFaucet.map((card, i) => (
          <div key={i} className={cn(card.className, "z-30")}>
            <motion.div
              onClick={() => handleCardClick(card)}
              className={cn(
                card.className,
                "relative overflow-hidden cursor-pointer bg-white rounded-xl h-full w-full hover:scale-105 transition-transform duration-200"
              )}
              whileHover={{ y: -5 }}
            >
              <ImageComponent card={card} />
            </motion.div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={closeModal}
        style={{ backgroundImage: `url(${selectedCard?.thumbnail})` }}
        className="max-w-2xl bg-cover bg-center bg-white absolute"
      >
        <ModalContent>
          <div className="backdrop-brightness-25 w-full h-full bg-black/60">
            <ModalHeader className="text-2xl font-bold">
              {getModalTitle(selectedCard)}
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="text-lg pt-20">
                {selectedCard?.content}
              </div>

              {selectedCard?.id !== 1 && (
                <div className="flex flex-col w-full gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className={`flex-1 h-14 min-h-14 sm:w-[50%] ock-font-family text-sm ${selectedCard?.id === 2 ? "bg-pink-500" :
                        selectedCard?.id === 3 ? "bg-purple-500" :
                          selectedCard?.id === 4 ? "bg-purple-500" :
                            selectedCard?.id === 5 ? "bg-green-500" :
                              selectedCard?.id === 6 ? "bg-blue-500" : ""
                        }`}
                      onPress={handleMintAI}
                      disabled={mintMutationAI.isPending}
                    >
                      {mintMutationAI.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : `CLAIM 1000 $${findToken?.nameToken} to AI Wallet`}
                    </Button>
                    <div className="sm:w-[50%]">
                      <ButtonMint
                        addressToken={findToken?.addressToken as HexAddress}
                        amount="1000"
                        bgColor={`${selectedCard?.id === 2 ? "!bg-pink-500" :
                          selectedCard?.id === 3 ? "!bg-purple-500" :
                            selectedCard?.id === 4 ? "!bg-purple-500" :
                              selectedCard?.id === 5 ? "!bg-green-500" :
                                selectedCard?.id === 6 ? "!bg-blue-500" : ""
                          }`}
                        disabled={!!transactionStatus}
                        buttonText={`CLAIM 1000 $${findToken?.nameToken} to Main wallet`}
                      />
                    </div>

                  </div>
                  <Button
                    className="flex-1 min-h-10"
                    variant="flat"
                    onPress={closeModal}
                  >
                    Close
                  </Button>
                </div>
              )}
            </ModalBody>
          </div>
        </ModalContent>
      </Modal>
      <ModalTransactionCustom
        isOpen={isModalTransactionOpen}
        setIsOpen={closeModalTransaction}
        status={mintMutationAI.status || ""}
        data={result?.txhash || ""}
        errorMessage={mintMutationAI.error?.message || undefined}
        name='mint'
      />
    </div>
  );
}