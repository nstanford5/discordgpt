type Nullable<T> = T | null

type Chain = 'eth' | 'sol'

type CollectibleMediaType = 'IMAGE' | 'VIDEO' | 'GIF' | 'THREE_D'

type Collectible = {
  id: string
  tokenId: string
  name: Nullable<string>
  description: Nullable<string>
  mediaType: CollectibleMediaType
  frameUrl: Nullable<string>
  imageUrl: Nullable<string>
  gifUrl: Nullable<string>
  videoUrl: Nullable<string>
  threeDUrl: Nullable<string>
  isOwned: boolean
  dateCreated: Nullable<string>
  dateLastTransferred: Nullable<string>
  externalLink: Nullable<string>
  permaLink: Nullable<string>
  assetContractAddress: Nullable<string>
  chain: Chain
  wallet: string
}

type CollectibleState = {
  [wallet: string]: Collectible[]
}

type OpenSeaClientProps = {
  apiEndpoint?: string
  apiKey?: string
  assetLimit?: number
  eventLimit?: number
}

type SolanaClientProps = {
  rpcEndpoint?: string
}

declare type FetchNFTClientProps = {
    openSeaConfig?: OpenSeaClientProps;
    solanaConfig?: SolanaClientProps;
};
declare class FetchNFTClient {
    private ethClient;
    private solClient;
    constructor(props?: FetchNFTClientProps);
    getEthereumCollectibles: (wallets: string[]) => Promise<CollectibleState>;
    getSolanaCollectibles: (wallets: string[]) => Promise<CollectibleState>;
    getCollectibles: (args: {
        ethWallets?: string[];
        solWallets?: string[];
    }) => Promise<{
        ethCollectibles: CollectibleState;
        solCollectibles: CollectibleState;
    }>;
}

export { Collectible, CollectibleState, FetchNFTClient };
