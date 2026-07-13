export type PartOutcome = "passed" | "rejected" | "review";

export type PartRecord = {
  id: string;
  time: string;
  product: string;
  version: string;
  printer: string;
  spool: string;
  material: string;
  job: string;
  slice: string;
  outcome: PartOutcome;
  weight: number;
  bin: string;
  incident?: string;
};

export const partRecords: PartRecord[] = [
  { id: "PT-000275", time: "14:12", product: "Корпус датчика", version: "v7", printer: "K1C-02", spool: "#17", material: "PETG", job: "#041", slice: "74d2", outcome: "passed", weight: 104, bin: "A-12" },
  { id: "PT-000271", time: "13:47", product: "Корпус датчика", version: "v7", printer: "K1C-04", spool: "#17", material: "PETG", job: "#041", slice: "74d2", outcome: "passed", weight: 104, bin: "A-12" },
  { id: "PT-000274", time: "13:31", product: "Корпус датчика", version: "v7", printer: "K1C-01", spool: "#17", material: "PETG", job: "#041", slice: "74d2", outcome: "passed", weight: 103, bin: "A-12" },
  { id: "PT-000273", time: "12:58", product: "Корпус датчика", version: "v7", printer: "K1C-03", spool: "#17", material: "PETG", job: "#041", slice: "74d2", outcome: "passed", weight: 104, bin: "A-12" },
  { id: "PT-000272", time: "12:21", product: "Корпус датчика", version: "v7", printer: "K1C-04", spool: "#17", material: "PETG", job: "#041", slice: "74d2", outcome: "passed", weight: 105, bin: "A-12" },
  { id: "PT-000270", time: "11:59", product: "Корпус датчика", version: "v7", printer: "K1C-02", spool: "#08", material: "ABS", job: "#041", slice: "74d2", outcome: "review", weight: 101, bin: "карантин", incident: "INC-148" },
  { id: "PT-000269", time: "11:32", product: "Кронштейн-12", version: "v3", printer: "K1C-01", spool: "#13", material: "PLA", job: "#039", slice: "731d", outcome: "rejected", weight: 68, bin: "брак", incident: "INC-147" },
  { id: "PT-000268", time: "10:48", product: "Заглушка корпуса", version: "v2", printer: "K1C-03", spool: "#17", material: "PETG", job: "#038", slice: "70af", outcome: "passed", weight: 42, bin: "B-04" },
];
