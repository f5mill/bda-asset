import type { Asset, Location, Category } from './types';

export const categories: Category[] = [
  { id: 'CAT-001', name: 'Electronics', description: 'Laptops, monitors, and peripherals.', color: '#3b82f6' },
  { id: 'CAT-002', name: 'Furniture', description: 'Desks, chairs, and office furniture.', color: '#a855f7' },
  { id: 'CAT-003', name: 'Vehicles', description: 'Company cars, vans, and trucks.', color: '#f97316' },
  { id: 'CAT-004', name: 'Equipment', description: 'Specialized tools and machinery.', color: '#ef4444' },
];

export const assets: Asset[] = [
  {
    id: 'ASSET-001',
    name: 'MacBook Pro 16"',
    description: 'M2 Max, 64GB RAM, 2TB SSD. For engineering team.',
    qrCodeId: 'QR-A1B2C3',
    status: 'Checked Out',
    categoryId: 'CAT-001',
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
    categoryId: 'CAT-001',
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
    categoryId: 'CAT-004',
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
    categoryId: 'CAT-004',
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
    categoryId: 'CAT-003',
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

export const locations: Location[] = [
  { id: 'LOC-001', name: 'Floor 5, Desk 21, Los Angeles Office', address: '123 Main St, Los Angeles, CA 90012', description: 'Primary engineering workspace.' },
  { id: 'LOC-002', name: 'Storage Room B, New York Office', address: '456 Market St, New York, NY 10004', description: 'Used for storing spare monitors and peripherals.' },
  { id: 'LOC-003', name: 'Marketing Dept, London Office', address: '789 High St, London, WC2N 5DU', description: 'Hot-desking area for the marketing team.' },
  { id: 'LOC-004', name: 'IT Department, Tokyo Office', address: '1-1-2 Otemachi, Chiyoda-ku, Tokyo 100-8111', description: 'IT support and repair center.' },
  { id: 'LOC-005', name: 'Parking Garage, Level 2, Sydney Office', address: '222 George St, Sydney NSW 2000', description: 'Designated parking for company vehicles.' },
];
