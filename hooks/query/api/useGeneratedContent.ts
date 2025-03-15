import React from 'react';

const useGenerateContent = () => {
  const [risk, setRisk] = React.useState<string | null>(null);
  const [riskSaved, setRiskSaved] = React.useState<string | null>(null);
  const [protocolId, setProtocolId] = React.useState<string | null>(null);
  const [protocolIdSaved, setProtocolIdSaved] = React.useState<string | null>(null);

  const setItemWithExpiry = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const getItemWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (now - item.timestamp > tenMinutes) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  React.useEffect(() => {
    if (risk) {
      setItemWithExpiry("risk", JSON.stringify(risk));
    }
    
    if (protocolId) {
      setItemWithExpiry("protocolId", JSON.stringify(protocolId));
    }

    const cleanup = setInterval(() => {
      getItemWithExpiry("risk");
      getItemWithExpiry("protocolId");
    }, 60000);

    return () => clearInterval(cleanup);
  }, [risk, protocolId]);

  React.useEffect(() => {
    const risk = localStorage.getItem("risk");
    if (risk) {
      setRiskSaved(risk);
    }

    const protocolId = localStorage.getItem("protocolId");
    if (protocolId) {
      setProtocolIdSaved(protocolId);
    }
  }, []);

  return { risk, setRisk, protocolId, setProtocolId, riskSaved, protocolIdSaved };
};

export default useGenerateContent;