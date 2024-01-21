export interface ICoin {
    id: number;
    issuer: string;
    years: string;
    value: string;
    currency: string;
    composition: string;
    weight: string;
    diameter: string;
    thickness: string;
    obverse: string;
    reverse: string;
    images: {
      front: string;
      back: string;
    };
}