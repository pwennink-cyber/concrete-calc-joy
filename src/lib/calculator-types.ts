import type { ConcreteTypeId, ProjectTypeId, UnloadingMethodId } from "@/config/site";

export type CustomerType = "particulier" | "zakelijk";
export type VolumeMode = "known" | "calculate";
export type AccessAnswer = "ja" | "nee" | "weetniet";

export interface CalculatorState {
  // Stap 1
  postcode: string;
  houseNumber: string;
  addition: string;
  customerType: CustomerType;
  projectType: ProjectTypeId | "";

  // Stap 2
  volumeMode: VolumeMode;
  knownVolume: string;
  length: string;
  width: string;
  thicknessCm: string;
  surfaces: string;
  useSafetyMargin: boolean;

  // Stap 3
  concreteType: ConcreteTypeId | "onbekend" | "";

  // Stap 4
  accessWithinFourMeters: AccessAnswer | "";
  unloadingMethod: UnloadingMethodId | "";
  unloadingMinutes: string;
  distanceMeters: string;
  obstacles: string;
  extraHoseMeters: string;

  // Stap 5
  asap: boolean;
  preferredDate: string;
  timeslot: string;
  flexible: boolean;
}

export const initialCalculatorState: CalculatorState = {
  postcode: "",
  houseNumber: "",
  addition: "",
  customerType: "particulier",
  projectType: "",
  volumeMode: "calculate",
  knownVolume: "",
  length: "",
  width: "",
  thicknessCm: "",
  surfaces: "1",
  useSafetyMargin: true,
  concreteType: "",
  accessWithinFourMeters: "",
  unloadingMethod: "",
  unloadingMinutes: "30",
  distanceMeters: "",
  obstacles: "",
  extraHoseMeters: "0",
  asap: false,
  preferredDate: "",
  timeslot: "",
  flexible: false,
};

export interface PriceLine {
  label: string;
  detail?: string;
  amount: number;
}

export interface PriceResult {
  netVolume: number;
  marginVolume: number;
  orderVolume: number;
  lines: PriceLine[];
  subtotal: number;
  vat: number;
  total: number;
  hasVolume: boolean;
}
