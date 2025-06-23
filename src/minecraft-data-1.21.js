// Minecraft 1.21 items data
const minecraft121Items = {
  // New 1.21 items
  'trial_key': {
    name: 'trial_key',
    displayName: 'Trial Key',
    stackSize: 1,
    isBlock: false
  },
  'ominous_trial_key': {
    name: 'ominous_trial_key',
    displayName: 'Ominous Trial Key',
    stackSize: 1,
    isBlock: false
  },
  'vault': {
    name: 'vault',
    displayName: 'Vault',
    stackSize: 64,
    isBlock: true
  },
  'heavy_core': {
    name: 'heavy_core',
    displayName: 'Heavy Core',
    stackSize: 64,
    isBlock: false
  },
  'wind_charge': {
    name: 'wind_charge',
    displayName: 'Wind Charge',
    stackSize: 16,
    isBlock: false
  },
  'mace': {
    name: 'mace',
    displayName: 'Mace',
    stackSize: 1,
    isBlock: false,
    maxDurability: 250
  },
  'wolf_armor': {
    name: 'wolf_armor',
    displayName: 'Wolf Armor',
    stackSize: 1,
    isBlock: false,
    maxDurability: 200
  },
  'copper_bulb': {
    name: 'copper_bulb',
    displayName: 'Copper Bulb',
    stackSize: 64,
    isBlock: true
  },
  'copper_grate': {
    name: 'copper_grate',
    displayName: 'Copper Grate',
    stackSize: 64,
    isBlock: true
  },
  'pale_oak_log': {
    name: 'pale_oak_log',
    displayName: 'Pale Oak Log',
    stackSize: 64,
    isBlock: true
  },
  'firefly_bush': {
    name: 'firefly_bush',
    displayName: 'Firefly Bush',
    stackSize: 64,
    isBlock: true
  },
  'pitcher_plant': {
    name: 'pitcher_plant',
    displayName: 'Pitcher Plant',
    stackSize: 64,
    isBlock: true
  },
  'pitcher_pod': {
    name: 'pitcher_pod',
    displayName: 'Pitcher Pod',
    stackSize: 64,
    isBlock: false
  }
};

// Function to get all items
export const getAll121Items = () => minecraft121Items;

// Function to get a specific item
export const get121Item = (name) => {
  if (!name) return null;
  return minecraft121Items[name.toLowerCase()];
};

export default {
  getAll121Items,
  get121Item
}; 