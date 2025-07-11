
export type AssetStatus = "Available" | "Checked Out" | "In Repair" | "Booked";

export type ScanDetails = {
  device?: string;
  browser?: string;
  os?: string;
  source?: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  color: string; // e.g., a hex color string
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Asset = {
  id: string;
  name: string;
  description: string;
  qrCodeId: string;
  status: AssetStatus;
  categoryId?: string;
  assignedLocation: string;
  custodian?: User;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastScan: string; // ISO date string
  scanDetails?: ScanDetails;
  isBookable?: boolean;
};

export type QRCode = {
  id: string;
  assignedTo: string | null;
};

export type QRBatch = {
  id: string;
  createdAt: string;
  quantity: number;
  codes: QRCode[];
};


export type UnclaimedQRCode = {
    id: string;
    qrCodeValue: string; // The data embedded in the QR
    createdAt: string; // ISO date string
};

export type Location = {
  id:string;
  name: string;
  address?: string;
  description?: string;
};

export type BookingStatus = "Upcoming" | "Active" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  purpose: string;
  assetIds: string[];
  bookedBy: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: BookingStatus;
  notes?: string;
};
