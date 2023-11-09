import { Nullable } from 'utils/typeUtils';
export declare type Chain = 'eth' | 'sol';
export declare type CollectibleMediaType = 'IMAGE' | 'VIDEO' | 'GIF' | 'THREE_D';
export declare type Collectible = {
    id: string;
    tokenId: string;
    name: Nullable<string>;
    description: Nullable<string>;
    mediaType: CollectibleMediaType;
    frameUrl: Nullable<string>;
    imageUrl: Nullable<string>;
    gifUrl: Nullable<string>;
    videoUrl: Nullable<string>;
    threeDUrl: Nullable<string>;
    isOwned: boolean;
    dateCreated: Nullable<string>;
    dateLastTransferred: Nullable<string>;
    externalLink: Nullable<string>;
    permaLink: Nullable<string>;
    assetContractAddress: Nullable<string>;
    chain: Chain;
    wallet: string;
};
export declare type CollectibleState = {
    [wallet: string]: Collectible[];
};
