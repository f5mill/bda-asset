
import type { Asset, Location, Category, Booking, QRBatch, User } from './types';

export const users: User[] = [
  { id: 'USER-101', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'USER-102', name: 'Bob Williams', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'USER-103', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'USER-104', name: 'Diana Prince', avatarUrl: 'https://placehold.co/100x100.png' },
];

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
    qrCodeId: 'QR-T4U5V6',
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
    },
    isBookable: true,
  },
  {
    id: 'ASSET-002',
    name: 'Dell 4K Monitor',
    description: 'U2723QE 27-inch 4K UHD. For design team.',
    qrCodeId: 'QR-Q1R2S3',
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
    },
    isBookable: true,
  },
  {
    id: 'ASSET-003',
    name: 'Sony A7 IV Camera',
    description: 'Full-frame mirrorless camera with 24-70mm f/2.8 lens.',
    qrCodeId: 'QR-G7H8I0',
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
    },
    isBookable: true,
  },
  {
    id: 'ASSET-004',
    name: 'Conference Projector',
    description: 'Epson Pro EX9240 for meeting rooms.',
    qrCodeId: 'QR-Q1R2S4',
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
    },
    isBookable: false,
  },
  {
    id: 'ASSET-005',
    name: 'Company Van',
    description: 'Ford Transit for logistics and deliveries.',
    qrCodeId: 'QR-G1H2I3',
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
    },
    isBookable: true,
  },
];

export const bookings: Booking[] = [
  {
    id: 'BOOK-001',
    purpose: 'Product Launch Photoshoot',
    assetIds: ['ASSET-003'],
    bookedBy: 'Marketing Team',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    notes: 'For the upcoming product launch photoshoot.'
  },
  {
    id: 'BOOK-002',
    purpose: 'Engineering Project',
    assetIds: ['ASSET-001'],
    bookedBy: 'Alice Johnson',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    id: 'BOOK-003',
    purpose: 'Internal Tech Fair',
    assetIds: ['ASSET-004', 'ASSET-002'],
    bookedBy: 'IT Support',
    startDate: '2023-10-10T09:00:00Z',
    endDate: '2023-10-12T17:00:00Z',
    status: 'Completed',
    notes: 'Internal tech fair setup.'
  },
  {
    id: 'BOOK-004',
    purpose: 'Logistics Delivery',
    assetIds: ['ASSET-005'],
    bookedBy: 'Logistics Dept',
    startDate: '2023-09-01T08:00:00Z',
    endDate: '2023-09-05T18:00:00Z',
    status: 'Completed',
  },
   {
    id: 'BOOK-005',
    purpose: 'Cancelled Project',
    assetIds: ['ASSET-002'],
    bookedBy: 'Alex Smith',
    startDate: '2023-08-15T09:00:00Z',
    endDate: '2023-08-16T17:00:00Z',
    status: 'Cancelled',
    notes: 'Project requirements changed.'
  }
];

export const locations: Location[] = [
  { id: 'LOC-001', name: 'Floor 5, Desk 21, Los Angeles Office', address: '123 Main St, Los Angeles, CA 90012', description: 'Primary engineering workspace.' },
  { id: 'LOC-002', name: 'Storage Room B, New York Office', address: '456 Market St, New York, NY 10004', description: 'Used for storing spare monitors and peripherals.' },
  { id: 'LOC-003', name: 'Marketing Dept, London Office', address: '789 High St, London, WC2N 5DU', description: 'Hot-desking area for the marketing team.' },
  { id: 'LOC-004', name: 'IT Department, Tokyo Office', address: '1-1-2 Otemachi, Chiyoda-ku, Tokyo 100-8111', description: 'IT support and repair center.' },
  { id: 'LOC-005', name: 'Parking Garage, Level 2, Sydney Office', address: '222 George St, Sydney NSW 2000', description: 'Designated parking for company vehicles.' },
];

export const qrBatches: QRBatch[] = [
  { id: 'BATCH-001', createdAt: '2023-11-06T14:00:00Z', quantity: 2, codes: [ { id: 'QR-1A2B3C', assignedTo: null }, { id: 'QR-4D5E6F', assignedTo: null } ] },
  { id: 'BATCH-002', createdAt: '2023-11-05T13:00:00Z', quantity: 2, codes: [ { id: 'QR-T4U5V7', assignedTo: null }, { id: 'QR-X7Y8Z9', assignedTo: null } ] },
  { id: 'BATCH-003', createdAt: '2023-11-04T12:00:00Z', quantity: 2, codes: [ { id: 'QR-M4N5P7', assignedTo: null }, { id: 'QR-Q1R2S4', assignedTo: 'ASSET-004' } ] },
  { id: 'BATCH-004', createdAt: '2023-11-03T11:00:00Z', quantity: 2, codes: [ { id: 'QR-G7H8I0', assignedTo: 'ASSET-003' }, { id: 'QR-J1K2L4', assignedTo: null } ] },
  { id: 'BATCH-005', createdAt: '2023-11-02T10:00:00Z', quantity: 2, codes: [ { id: 'QR-A1B2C4', assignedTo: null }, { id: 'QR-D4E5F7', assignedTo: null } ] },
  { id: 'BATCH-006', createdAt: '2023-11-01T10:00:00Z', quantity: 3, codes: [ { id: 'QR-G1H2I3', assignedTo: 'ASSET-005' }, { id: 'QR-J4K5L6', assignedTo: null }, { id: 'QR-M7N8P9', assignedTo: null } ] },
  { id: 'BATCH-007', createdAt: '2023-10-31T15:20:00Z', quantity: 2, codes: [ { id: 'QR-Q1R2S3', assignedTo: 'ASSET-002' }, { id: 'QR-T4U5V6', assignedTo: 'ASSET-001' } ] },
];
