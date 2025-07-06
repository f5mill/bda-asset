import type { Asset } from './types';

export const assets: Asset[] = [
  {
    id: 'ASSET-001',
    name: 'MacBook Pro 16"',
    description: 'M2 Max, 64GB RAM, 2TB SSD. For engineering team.',
    qrCodeId: 'QR-A1B2C3',
    status: 'Checked Out',
    assignedLocation: 'Floor 5, Desk 21, Los Angeles Office',
    custodian: {
      id: 'USER-101',
      name: 'Alice Johnson',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
    location: {
      lat: 34.052235,
      lng: -118.243683,
      address: 'Floor 5, Desk 21, Los Angeles Office',
    },
    lastScan: '2023-10-26T10:00:00Z',
    scanDetails: {
      device: 'Desktop',
      browser: 'Chrome',
      os: 'macOS',
      source: 'Manual Entry'
    }
  },
  {
    id: 'ASSET-002',
    name: 'Dell 4K Monitor',
    description: 'U2723QE 27-inch 4K UHD. For design team.',
    qrCodeId: 'QR-D4E5F6',
    status: 'Available',
    assignedLocation: 'Storage Room B, New York Office',
    location: {
      lat: 40.712776,
      lng: -74.005974,
      address: 'Storage Room B, New York Office',
    },
    lastScan: '2023-09-15T14:30:00Z',
    scanDetails: {
      device: 'Desktop',
      browser: 'Firefox',
      os: 'Windows',
      source: 'Initial Import'
    }
  },
  {
    id: 'ASSET-003',
    name: 'Sony A7 IV Camera',
    description: 'Full-frame mirrorless camera with 24-70mm f/2.8 lens.',
    qrCodeId: 'QR-G7H8I9',
    status: 'Booked',
    assignedLocation: 'Marketing Dept, London Office',
    location: {
      lat: 51.507351,
      lng: -0.127758,
      address: 'Marketing Dept, London Office',
    },
    lastScan: '2023-10-20T09:00:00Z',
     scanDetails: {
      device: 'Mobile',
      browser: 'Safari',
      os: 'iOS',
      source: 'QR Code Scan'
    }
  },
  {
    id: 'ASSET-004',
    name: 'Conference Projector',
    description: 'Epson Pro EX9240 for meeting rooms.',
    qrCodeId: 'QR-J1K2L3',
    status: 'In Repair',
    assignedLocation: 'IT Department, Tokyo Office',
    location: {
      lat: 35.689487,
      lng: 139.691711,
      address: 'IT Department, Tokyo Office',
    },
    lastScan: '2023-10-22T11:20:00Z',
    scanDetails: {
      device: 'Desktop',
      browser: 'Edge',
      os: 'Windows',
      source: 'Manual Entry'
    }
  },
  {
    id: 'ASSET-005',
    name: 'Company Van',
    description: 'Ford Transit for logistics and deliveries.',
    qrCodeId: 'QR-M4N5P6',
    status: 'Available',
    assignedLocation: 'Parking Garage, Level 2, Sydney Office',
    location: {
      lat: -33.868820,
      lng: 151.209290,
      address: 'Parking Garage, Level 2, Sydney Office',
    },
    lastScan: '2023-10-25T18:05:00Z',
    scanDetails: {
      device: 'Mobile',
      browser: 'Chrome',
      os: 'Android',
      source: 'QR Code Scan'
    }
  },
];
