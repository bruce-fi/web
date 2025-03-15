export const normalizeAPY = (apy: number) => {
    return apy / 100;
}

export const truncateAddress = (address: string, startLength = 6, endLength = 4) => {
    if (!address) return "No Account";
    const regex = new RegExp(`^(0x[a-zA-Z0-9]{${startLength}})[a-zA-Z0-9]+([a-zA-Z0-9]{${endLength}})$`);
    const match = address.match(regex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

export const formatPercent = (value: number) => `${(value).toFixed(2)}%`;

export const formatUSD = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);