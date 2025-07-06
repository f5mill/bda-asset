export type AssetStatus = "Available" | "Checked Out" | "In Repair" | "Booked";

export type ScanDetails = {
  device?: string;
  browser?: string;
  os?: string;
  source?: string;
};

export type Asset = {
  id: string;
  name: string;
  description: string;
  qrCodeId: string;
  status: AssetStatus;
  assignedLocation: string;
  custodian?: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastScan: string; // ISO date string
  scanDetails?: ScanDetails;
};

export type UnclaimedQRCode = {
    id: string;
    qrCodeValue: string; // The data embedded in the QR
    createdAt: string; // ISO date string
};

export type Location = {
  id: string;
  name: string;
  address?: string;
  description?: string;
};
