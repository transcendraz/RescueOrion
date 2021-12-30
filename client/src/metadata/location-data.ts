import { LocationType, LocationMetadata } from './types';

const metadata: LocationMetadata = {
  'sagittarius': {
    location: {
      id: 'sagittarius',
      type: LocationType.BeaconStar,
      spaceStationName: 'sagittarius',
    },
    neighbors: [
      't1',
      'b3',
    ],
    pixelPosition: { left: 487, top: 594 },
  },
  'cassiopeia': {
    location: {
      id: 'cassiopeia',
      type: LocationType.BeaconStar,
      spaceStationName: 'cassiopeia',
    },
    neighbors: [
      'b6',
      'b35',
      'h2',
    ],
    pixelPosition: { left: 803, top: 695 },
  },
  'andromeda': {
    location: {
      id: 'andromeda',
      type: LocationType.BeaconStar,
      spaceStationName: 'andromeda',
    },
    neighbors: [
      'b27',
      'h4',
    ],
    pixelPosition: { left: 1027, top: 184 },
  },
  'b2': {
    location: {
      id: 'b2',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b3',
      'b21',
    ],
    pixelPosition: { left: 435, top: 417 },
  },
  'b3': {
    location: {
      id: 'b3',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b2',
      'b4',
      'h1',
      'sagittarius',
    ],
    pixelPosition: { left: 593, top: 511 },
  },
  'b4': {
    location: {
      id: 'b4',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b3',
      'b19',
      'b35',
      'b16',
    ],
    pixelPosition: { left: 657, top: 592 },
  },
  'b6': {
    location: {
      id: 'b6',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b7',
      'cassiopeia',
    ],
    pixelPosition: { left: 928, top: 737 },
  },
  'b8': {
    location: {
      id: 'b8',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b25',
      'b34',
    ],
    pixelPosition: { left: 846, top: 237 },
  },
  'b7': {
    location: {
      id: 'b7',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b6',
      't5',
    ],
    pixelPosition: { left: 1088, top: 744 },
  },
  'b9': {
    location: {
      id: 'b9',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b10',
      't5',
    ],
    pixelPosition: { left: 1289, top: 509 },
  },
  'b10': {
    location: {
      id: 'b10',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b9',
      'b11',
      'b33',
    ],
    pixelPosition: { left: 1267, top: 409 },
  },
  'b11': {
    location: {
      id: 'b11',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b10',
      'b33',
      't2',
    ],
    pixelPosition: { left: 1297, top: 238 },
  },
  'b12': {
    location: {
      id: 'b12',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b18',
      'b20',
      'b30',
    ],
    pixelPosition: { left: 639, top: 279 },
  },
  'b13': {
    location: {
      id: 'b13',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b14',
      't3',
    ],
    pixelPosition: { left: 956, top: 424 },
  },
  'b14': {
    location: {
      id: 'b14',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b13',
      'b17',
      'b32',
      'b15',
      'h2',
    ],
    pixelPosition: { left: 1003, top: 509 },
  },
  'b15': {
    location: {
      id: 'b15',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b14',
      't5',
    ],
    pixelPosition: { left: 1084, top: 584 },
  },
  'b16': {
    location: {
      id: 'b16',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b4',
      'b17',
    ],
    pixelPosition: { left: 780, top: 534 },
  },
  'b17': {
    location: {
      id: 'b17',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b14',
      'b16',
    ],
    pixelPosition: { left: 875, top: 533 },
  },
  'b18': {
    location: {
      id: 'b18',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b12',
      'b34',
    ],
    pixelPosition: { left: 744, top: 229 },
  },
  'b19': {
    location: {
      id: 'b19',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b4',
      't3',
    ],
    pixelPosition: { left: 691, top: 475 },
  },
  'b20': {
    location: {
      id: 'b20',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b12',
      't3',
    ],
    pixelPosition: { left: 722, top: 348 },
  },
  'b21': {
    location: {
      id: 'b21',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b2',
      't4',
    ],
    pixelPosition: { left: 436, top: 237 },
  },
  'b23': {
    location: {
      id: 'b23',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'h3',
      't4',
    ],
    pixelPosition: { left: 660, top: 33 },
  },
  'b24': {
    location: {
      id: 'b24',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b25',
      'b28',
      'h3',
    ],
    pixelPosition: { left: 878, top: 102 },
  },
  'b25': {
    location: {
      id: 'b25',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b8',
      'b24',
      'b29',
    ],
    pixelPosition: { left: 947, top: 235 },
  },
  'b27': {
    location: {
      id: 'b27',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'andromeda',
      't2',
    ],
    pixelPosition: { left: 1152, top: 171 },
  },
  'b28': {
    location: {
      id: 'b28',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b24',
      't2',
    ],
    pixelPosition: { left: 984, top: 37 },
  },
  'b29': {
    location: {
      id: 'b29',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b25',
      'b33',
    ],
    pixelPosition: { left: 1015, top: 338 },
  },
  'b30': {
    location: {
      id: 'b30',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b12',
      'b31',
    ],
    pixelPosition: { left: 659, top: 135 },
  },
  'b31': {
    location: {
      id: 'b31',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b30',
      't4',
    ],
    pixelPosition: { left: 562, top: 201 },
  },
  'b32': {
    location: {
      id: 'b32',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b14',
      'b33',
    ],
    pixelPosition: { left: 1101, top: 489 },
  },
  'b33': {
    location: {
      id: 'b33',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b32',
      'b29',
      'b10',
      'b11',
      'h4',
    ],
    pixelPosition: { left: 1141, top: 400 },
  },
  'b34': {
    location: {
      id: 'b34',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b18',
      'b8',
    ],
    pixelPosition: { left: 787, top: 144 },
  },
  'b35': {
    location: {
      id: 'b35',
      type: LocationType.BeaconStar,
    },
    neighbors: [
      'b4',
      'cassiopeia',
    ],
    pixelPosition: { left: 677, top: 688 },
  },
  'h1': {
    location: {
      id: 'h1',
      type: LocationType.HyperGate,
    },
    neighbors: [
      'h2',
      'h3',
      'h4',
      'b3',
      't4',
      't3',
    ],
    pixelPosition: { left: 625, top: 397 },
  },
  'h2': {
    location: {
      id: 'h2',
      type: LocationType.HyperGate,
    },
    neighbors: [
      'h1',
      'h3',
      'h4',
      'b14',
      'cassiopeia',
      't5',
    ],
    pixelPosition: { left: 932, top: 637 },
  },
  'h3': {
    location: {
      id: 'h3',
      type: LocationType.HyperGate,
    },
    neighbors: [
      'b23',
      'b24',
      'h1',
      'h2',
      'h4',
    ],
    pixelPosition: { left: 794, top: 50 },
  },
  'h4': {
    location: {
      id: 'h4',
      type: LocationType.HyperGate,
    },
    neighbors: [
      'h1',
      'h2',
      'h3',
      'andromeda',
      't2',
      'b33',
    ],
    pixelPosition: { left: 1132, top: 310 },
  },
  't1': {
    location: {
      id: 't1',
      type: LocationType.TimePortal,
    },
    neighbors: [
      'sagittarius',
      't2',
      't3',
      't4',
      't5',
    ],
    pixelPosition: { left: 569, top: 731 },
  },
  't2': {
    location: {
      id: 't2',
      type: LocationType.TimePortal,
      spaceStationName: 'orion',
    },
    neighbors: [
      'b11',
      'b27',
      'b28',
      'h4',
      't1',
      't3',
      't4',
      't5',
    ],
    pixelPosition: { left: 1246, top: 110 },
  },
  't3': {
    location: {
      id: 't3',
      type: LocationType.TimePortal,
      spaceStationName: 'aquarius',
    },
    neighbors: [
      'b20',
      'b19',
      'b13',
      'h1',
      't1',
      't2',
      't4',
      't5',
    ],
    pixelPosition: { left: 849, top: 365 },
  },
  't4': {
    location: {
      id: 't4',
      type: LocationType.TimePortal,
      spaceStationName: 'capricorn',
    },
    neighbors: [
      'b21',
      'b31',
      'b23',
      'h1',
      't1',
      't2',
      't3',
      't5',
    ],
    pixelPosition: { left: 505, top: 110 },
  },
  't5': {
    location: {
      id: 't5',
      type: LocationType.TimePortal,
      spaceStationName: 'borealis',
    },
    neighbors: [
      'b7',
      'b15',
      'b9',
      'h2',
      't1',
      't2',
      't3',
      't4',
    ],
    pixelPosition: { left: 1254, top: 695 },
  },
}

export default metadata;
