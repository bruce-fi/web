"use client";

import HistoryCard from "@/components/card/card-history";
import SwapCard from "@/components/card/card-swap";
import TransferCard from "@/components/card/card-transfer";
import { Tabs, Tab } from "@heroui/tabs";
import { CircleFadingArrowUp, History, RefreshCcw } from "lucide-react";
import React from "react";

export default function TransactionTabs() {
  const [selected, setSelected] = React.useState("photos");

  return (
    <div>
      <div className="flex w-full flex-col gap-5 items-center">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#22d3ee]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          }}
          className="w-fit"
          color="primary"
          variant="underlined"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
        >
          <Tab
            key="photos"
            title={
              <div className="flex items-center space-x-2">
                <RefreshCcw />
                <span>Swap</span>
              </div>
            }
          />
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <CircleFadingArrowUp />
                <span>Transfer</span>
              </div>
            }
          />
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2">
                <History />
                <span>History</span>
              </div>
            }
          />
        </Tabs>
        {selected === "photos" && <SwapCard />}
        {selected === "music" && <TransferCard />}
        {selected === "videos" && <HistoryCard />}
      </div>
    </div>
  )
}
