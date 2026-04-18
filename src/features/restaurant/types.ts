export interface Address {
  line1: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  owner: string;
  mobile: string;
  type: string;
  image: string;
  address: Address;
  rating?: number;
}
