export type ProductStatus = "night" | "series" | "calibrating" | "blocked";

export type Product = {
  id: string;
  name: string;
  version: string;
  format: "3MF" | "STL";
  asset: string;
  material: string;
  profile: string | null;
  calibrationDone: number;
  calibrationTarget: number;
  references: number;
  compatiblePrinters: string[];
  artifact: string | null;
  status: ProductStatus;
  seriesAllowed: boolean;
  nightAllowed: boolean;
  blocker: string | null;
  updatedAt: string;
};

export const products: Product[] = [
  {
    id: "P-024",
    name: "Кронштейн-12",
    version: "v3",
    format: "3MF",
    asset: "assets/product-bracket.svg",
    material: "PLA · серый",
    profile: "K1C · PLA · PEI",
    calibrationDone: 5,
    calibrationTarget: 5,
    references: 5,
    compatiblePrinters: ["K1C-03", "K1C-05", "K1C-07", "K1C-08"],
    artifact: "slice 74d2",
    status: "night",
    seriesAllowed: true,
    nightAllowed: true,
    blocker: null,
    updatedAt: "11.07 · 12:48",
  },
  {
    id: "P-017",
    name: "Корпус датчика",
    version: "v7",
    format: "3MF",
    asset: "assets/product-sensor-housing.svg",
    material: "PETG · чёрный",
    profile: "K1C · PETG · PEI",
    calibrationDone: 5,
    calibrationTarget: 5,
    references: 4,
    compatiblePrinters: ["K1C-01", "K1C-02", "K1C-04"],
    artifact: "slice 8a1f",
    status: "night",
    seriesAllowed: true,
    nightAllowed: true,
    blocker: null,
    updatedAt: "10.07 · 17:21",
  },
  {
    id: "P-041",
    name: "Кожух вентилятора",
    version: "v2",
    format: "STL",
    asset: "assets/product-fan-shroud.svg",
    material: "PETG · белый",
    profile: "K1C · PETG · PEI",
    calibrationDone: 3,
    calibrationTarget: 5,
    references: 2,
    compatiblePrinters: ["K1C-02", "K1C-06"],
    artifact: "slice c201",
    status: "calibrating",
    seriesAllowed: false,
    nightAllowed: false,
    blocker: "Нужно завершить 2 калибровочные печати и принять эталон первого слоя.",
    updatedAt: "12.07 · 09:14",
  },
  {
    id: "P-032",
    name: "Заглушка корпуса",
    version: "v1",
    format: "STL",
    asset: "assets/product-end-cap.svg",
    material: "PLA · белый",
    profile: null,
    calibrationDone: 0,
    calibrationTarget: 5,
    references: 0,
    compatiblePrinters: [],
    artifact: null,
    status: "blocked",
    seriesAllowed: false,
    nightAllowed: false,
    blocker: "Нет производственного профиля для связки K1C · PLA · PEI.",
    updatedAt: "12.07 · 08:42",
  },
  {
    id: "P-063",
    name: "Втулка направляющей",
    version: "v5",
    format: "3MF",
    asset: "assets/selected-product.svg",
    material: "PLA · графит",
    profile: "K1C · PLA · PEI",
    calibrationDone: 5,
    calibrationTarget: 5,
    references: 3,
    compatiblePrinters: ["K1C-01", "K1C-03", "K1C-04", "K1C-05"],
    artifact: "slice 91b4",
    status: "series",
    seriesAllowed: true,
    nightAllowed: false,
    blocker: "Допуск к серии есть, ночной допуск ожидает ревью трёх эталонов.",
    updatedAt: "09.07 · 16:05",
  },
];

export const productCounts = {
  all: 31,
  night: 18,
  calibrating: 4,
  blocked: 3,
} as const;
