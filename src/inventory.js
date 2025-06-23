import './App.css';
import McText from 'mctext-react'
import { Slot } from './slot';
import { Search } from './search';
import { RequirementFields } from './RequirementFields';
import React, { Component } from 'react';
import YAML from 'js-yaml';
import Modal from 'react-modal';
import _LANG from './lang/english';
import fileDownload from 'js-file-download';
import CollapsibleSection from './components/CollapsibleSection.jsx';
import { FieldWithTooltip } from './components/CustomTooltip';
import DraggableSlot from './components/DraggableSlot.jsx';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import PresetManager from './components/PresetManager';
import MenuTypeSelector from './components/MenuTypeSelector';
import { validateConfig, formatValidationErrors } from './utils/validation';

const LANGLIST = ['russian', 'english', 'chinese'];

let LANG = _LANG;
const _lang = localStorage.getItem('lang') || 'english';

let selectLang = async (lang) => {
  if (lang && LANGLIST.includes(lang)) {
    await import(`./lang/${lang}`).then(res => {
      LANG = res.default;
    });
  }
  localStorage.setItem('lang', lang);
}

// Modal styles
const customStyles = {
  content: {
    width: '500px',
    height: '400px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#2b2b2b',
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '20px',
    zIndex: 1000
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 999
  }
};

// Set up Modal
Modal.setAppElement('#root');

const fields = () => [
  // Basic Properties
  {
    name: LANG['material'],
    value: 'material',
    extra: false,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['amount'],
    value: 'amount',
    extra: false,
    type: 'number',
    tagName: 'input'
  },
  {
    name: LANG['dynamic_amount'],
    value: 'dynamic_amount',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['display_name'],
    value: 'display_name',
    extra: false,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['lore'],
    value: 'lore',
    extra: false,
    type: 'text',
    tagName: 'textarea'
  },
  // Slot and Priority
  {
    name: LANG['slot'],
    value: 'slot',
    extra: false,
    type: 'number',
    tagName: 'input'
  },
  {
    name: LANG['priority'],
    value: 'priority',
    extra: true,
    type: 'number',
    tagName: 'input'
  },
  // Item Data
  {
    name: LANG['data'],
    value: 'data',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['model_data'],
    value: 'model_data',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['durability'],
    value: 'durability',
    extra: true,
    type: 'number',
    tagName: 'input'
  },
  // NBT Data
  {
    name: LANG['nbt_string'],
    value: 'nbt_string',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['nbt_int'],
    value: 'nbt_int',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Banner Customization
  {
    name: LANG['banner_meta'],
    value: 'banner_meta',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  // Color Options
  {
    name: LANG['rgb'],
    value: 'rgb',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['base_color'],
    value: 'base_color',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Item Flags and Effects
  {
    name: LANG['item_flags'],
    value: 'item_flags',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  {
    name: LANG['potion_effects'],
    value: 'potion_effects',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  // Entity Properties
  {
    name: LANG['entity_type'],
    value: 'entity_type',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Enchantments
  {
    name: LANG['enchantments'],
    value: 'enchantments',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  // Item Flags
  {
    name: LANG['hide_enchantments'],
    value: 'hide_enchantments',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  {
    name: LANG['hide_attributes'],
    value: 'hide_attributes',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  {
    name: LANG['hide_effects'],
    value: 'hide_effects',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  {
    name: LANG['hide_unbreakable'],
    value: 'hide_unbreakable',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  {
    name: LANG['unbreakable'],
    value: 'unbreakable',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  // Click Commands
  {
    name: LANG['left_click_commands'],
    value: 'left_click_commands',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  {
    name: LANG['right_click_commands'],
    value: 'right_click_commands',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  {
    name: LANG['middle_click_commands'],
    value: 'middle_click_commands',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  {
    name: LANG['shift_left_click_commands'],
    value: 'shift_left_click_commands',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  {
    name: LANG['shift_right_click_commands'],
    value: 'shift_right_click_commands',
    extra: true,
    type: '',
    tagName: 'textarea'
  },
  // Actions and Updates
  {
    name: LANG['actions'],
    value: 'actions',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  {
    name: LANG['action_delay'],
    value: 'action_delay',
    extra: true,
    type: 'number',
    tagName: 'input'
  },
  {
    name: LANG['action_chance'],
    value: 'action_chance',
    extra: true,
    type: 'number',
    tagName: 'input'
  },
  {
    name: LANG['update'],
    value: 'update',
    extra: true,
    type: 'checkbox',
    tagName: 'input'
  },
  // Meta and Permissions
  {
    name: LANG['meta_data'],
    value: 'meta_data',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  {
    name: LANG['permission_required'],
    value: 'permission_required',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  {
    name: LANG['economy_cost'],
    value: 'economy_cost',
    extra: true,
    type: 'number',
    tagName: 'input'
  },
  {
    name: LANG['external_menu'],
    value: 'external_menu',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Sound Effects
  // Head Database Integration
  {
    name: LANG['head_database_id'],
    value: 'head_database_id',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Custom Head Textures
  {
    name: LANG['head_texture'],
    value: 'head_texture',
    extra: true,
    type: 'text',
    tagName: 'textarea'
  },
  {
    name: LANG['head_owner'],
    value: 'head_owner',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // ItemsAdder Integration
  {
    name: LANG['itemsadder_id'],
    value: 'itemsadder_id',
    extra: true,
    type: 'text',
    tagName: 'input'
  },
  // Oraxen Integration
  {
    name: LANG['oraxen_id'],
    value: 'oraxen_id',
    extra: true,
    type: 'text',
    tagName: 'input'
  }
];

const YAML_DEFAULTS = {
  indent: 2,
  noArrayIndent: false,
  skipInvalid: false,
  flowLevel: -1,
  sortKeys: false,
  lineWidth: 120,
  noRefs: false,
  noCompatMode: false,
  condenseFlow: false,
  quotingType: "'",
  forceQuotes: false,
  styles: {
    '!!null': 'canonical', // dump null as ~
    '!!int': 'decimal',    // dump ints as decimal
    '!!bool': 'lowercase'  // dump bools as true/false
  }
};

const REQUIREMENT_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'has permission', label: 'Has Permission' },
  { value: 'has money', label: 'Has Money' },
  { value: 'has item', label: 'Has Item' },
  { value: 'has meta', label: 'Has Meta' },
  { value: 'has exp', label: 'Has Exp' },
  { value: 'is near', label: 'Is Near' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'string equals', label: 'String Equals' },
  { value: 'string contains', label: 'String Contains' },
  { value: 'regex matches', label: 'Regex Matches' },
  { value: '==', label: 'Equal to (==)' },
  { value: '>=', label: 'Greater than or equal to (>=)' },
  { value: '<=', label: 'Less than or equal to (<=)' },
  { value: '!=', label: 'Not equal to (!=)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '<', label: 'Less than (<)' }
];

const INVENTORY_TYPES = [
  'CHEST', 'ANVIL', 'BARREL', 'BEACON', 'BLAST_FURNACE', 'BREWING',
  'CARTOGRAPHY', 'DISPENSER', 'DROPPER', 'ENCHANTING', 'ENDER_CHEST',
  'FURNACE', 'GRINDSTONE', 'HOPPER', 'LOOM', 'PLAYER', 'SHULKER_BOX',
  'SMOKER', 'WORKBENCH'
];

export class Inventory extends Component {
  constructor(props) {
    super(props);
    console.log('Inventory constructor called');
    this.selectedFromSearch = this.selectedFromSearch.bind(this);
    this.handleSlotSelect = this.handleSlotSelect.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  state = {
    items: {},
    selectedSlot: null,
    showExtra: false,
    showCommand: false,
    showRequirements: false,
    showMinimumRequirements: false,
    showStopAtSuccess: false,
    requirements: [],
    minimumRequirements: 1,
    stopAtSuccess: false,
    denyCommands: [],
    name: '',
    open_command: '',
    size: 27,
    type: 'CHEST',
    pagination: {
      enabled: false,
      next_page_slot: 26,
      previous_page_slot: 18,
      items_per_page: 28
    },
    viewMode: 'visual',
    yamlContent: '',
    yamlError: null,
    selected: null,
    currentItem: {},
    isYamlEditable: false,
    showYamlSection: false,
    showItemPicker: false,
    itemPickerSlot: null,
  };

  computedMaterial = (id) => {
    if (this.state.items[id]) {
      if (typeof this.state.items[id].material !== 'undefined') {
        return this.state.items[id].material;
      }

      if (typeof this.state.items[id].parent === 'number') {
        return this.state.items[this.state.items[id].parent].material;
      }
    }

    return 'none';
  }

  _changeLang = async (e) => {
    await selectLang(e.value);
    this.forceUpdate();
  }

  componentDidMount() {
    this._changeLang({value: _lang});

    let saved = localStorage.getItem('state');
    let initialState = {
      items: {},
      menu_title: '',
      open_command: '',
      size: 27,
      type: 'CHEST',
      selected: null,
      showModal: false,
      currentItem: { material: 'none' }
    };

    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        // Convert items if they're in the old format
        if (Array.isArray(savedState.items)) {
          savedState.items = savedState.items.reduce((acc, item, index) => {
            if (item && item.material) {
              acc[index] = { ...item };
            }
            return acc;
          }, {});
        }
        initialState = { ...initialState, ...savedState };
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }

    // Initialize empty slots
    for (let i = 0; i < initialState.size; i++) {
      if (!initialState.items[i]) {
        initialState.items[i] = { id: i };
      }
    }

    this.setState(initialState);
  }
  handleSlotSelect = (id) => {
    console.log('Slot clicked:', id);
    this.setState({
      showItemPicker: true,
      itemPickerSlot: id,
      selected: id
    }, () => {
      console.log('State after slot click:', {
        showItemPicker: this.state.showItemPicker,
        itemPickerSlot: this.state.itemPickerSlot,
        selected: this.state.selected
      });
    });
  }
  componentDidUpdate() {
    console.log('Saving state to localStorage:', this.state);
    const stateToSave = {
      ...this.state,
      items: Object.values(this.state.items).map(item => {
        if (!item) return { id: item.id };
        return {
          ...item,
          icon: item.icon // Make sure we preserve the icon
        };
      })
    };
    localStorage.setItem('state', JSON.stringify(stateToSave));
  }

  selectedHead = (itm) => {
    let ar = this.state.items;
    ar[this.state.selected] = {
      id: this.state.selected,
      icon: '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',
    }
    this.setState({
      items: ar,
    })
  }
  selectedFromSearch = (item) => {
    console.log('Inventory - Selected item from search:', {
      name: item.name,
      icon: item.icon ? 'Icon present' : 'no icon'
    });
    
    const { itemPickerSlot } = this.state;
    
    if (itemPickerSlot === null) {
      console.log('No slot selected');
      return;
    }

    // Create a new items array
    const newItems = [...this.state.items];
    
    // Update the selected slot with the new item
    newItems[itemPickerSlot] = {
      id: itemPickerSlot,
      icon: item.icon,
      material: item.name.replace(/ /g, '_').toUpperCase(),
      slot: itemPickerSlot,
      amount: 1,
      display_name: item.name,
      lore: ''
    };

    console.log('Updated item in slot:', {
      slot: itemPickerSlot,
      item: newItems[itemPickerSlot]
    });

    this.setState({
      items: newItems,
      showItemPicker: false,
      itemPickerSlot: null,
      selected: itemPickerSlot,
      currentItem: {
        material: newItems[itemPickerSlot].material
      }
    }, () => {
      console.log('State after update:', {
        showItemPicker: this.state.showItemPicker,
        itemPickerSlot: this.state.itemPickerSlot,
        selectedItem: this.state.items[itemPickerSlot]
      });
    });
  }
  computedItems = () => {
    const result = {
      menu_title: this.state.menu_title || this.state.name,
      open_command: this.state.open_command,
      size: this.state.size,
      inventory_type: this.state.type
    };

    // Process items
    const items = {};
    Object.entries(this.state.items).forEach(([index, item]) => {
      if (item && item.material && item.material !== 'none') {
        const itemId = `item_${index}`;
        const computedItem = {
          material: item.material,
          slot: parseInt(index)
        };

        // Basic item properties
        if (item.amount) computedItem.amount = parseInt(item.amount);
        if (item.data) computedItem.data = parseInt(item.data);
        if (item.model_data) computedItem.model_data = parseInt(item.model_data);
        if (item.display_name) computedItem.display_name = item.display_name;
        if (item.lore) computedItem.lore = item.lore.split('\n').filter(line => line.trim());

        // Item flags
        if (item.item_flags) {
          computedItem.item_flags = item.item_flags.split('\n').filter(flag => flag.trim());
        }

        // Enchantments
        if (item.enchantments) {
          try {
            computedItem.enchantments = JSON.parse(item.enchantments);
          } catch (e) {
            computedItem.enchantments = item.enchantments.split('\n')
              .reduce((acc, line) => {
                const [ench, level] = line.split(':').map(s => s.trim());
                if (ench && level) acc[ench] = parseInt(level);
                return acc;
              }, {});
          }
        }

        // Click commands
        ['left', 'right', 'middle', 'shift_left', 'shift_right'].forEach(click => {
          const commandKey = `${click}_click_commands`;
          if (item[commandKey]) {
            computedItem[commandKey] = item[commandKey].split('\n').filter(cmd => cmd.trim());
          }
        });

        // Update flag
        if (item.update) computedItem.update = true;

        // Sound effects
        if (item.sound_effect) {
          computedItem.sound = {
            sound: item.sound_effect,
            volume: parseFloat(item.sound_volume) || 1.0,
            pitch: parseFloat(item.sound_pitch) || 1.0
          };
        }

        // Meta data
        if (item.meta_data) {
          try {
            computedItem.meta_data = JSON.parse(item.meta_data);
          } catch (e) {
            computedItem.meta_data = item.meta_data;
          }
        }

        // Economy cost
        if (item.economy_cost) {
          computedItem.economy_cost = parseFloat(item.economy_cost);
        }

        // Permission required
        if (item.permission_required) {
          computedItem.permission_required = item.permission_required;
        }

        // External menu
        if (item.external_menu) {
          computedItem.external_menu = item.external_menu;
        }

        // Explicitly remove icon property
        delete computedItem.icon;

        items[itemId] = computedItem;
      }
    });

    result.items = items;
    return result;
  }
  handleName = (e) => {
    this.setState({
      menu_title: e.target.value
    });
  }
  handleopen_command = (e) => {
    this.setState({
      open_command: e.target.value
    })
  }
  downloadYaml = () => {
    fileDownload(YAML.dump(this.computedItems(), this.state.yaml), 'menu.yml');
  }
  clearSlot = () => {
    let ar = this.state.items;

    ar[this.state.selected] = {id: this.state.selected};

    for (let i = 0; i < ar.length; i += 1) {
      if (typeof ar[i].slots !== 'undefined' && ar[i].slots.includes(this.state.selected)) {
        let index = ar[i].slots.indexOf(this.state.selected);

        ar[i].slots.splice(index, 1);

        if (ar[i].slots.length === 1) {
          ar[i].slot = ar[i].slots[0];
          delete ar[i].slots;
        }
      }
    }

    this.setState({
      items: ar,
    });
  }
  changeSize = (e) => {
    let newSize = this.state.size;
    if (e.currentTarget.textContent === LANG['button Remove row']) {
      if (this.state.size <= 9) return;
      newSize = this.state.size - 9;
    }
    if (e.currentTarget.textContent === LANG['button Add row']) {
      if (this.state.size >= 54) return;
      newSize = this.state.size + 9;
    }
    // Always create a new items array of the correct size
    let newItems = [];
    for (let i = 0; i < newSize; i++) {
      newItems.push(this.state.items[i] || { id: i });
    }
    this.setState({
      items: newItems,
      size: newSize,
      selected: this.state.selected >= newSize ? 0 : this.state.selected
    });
  }
  showExtra = () => {
    this.setState({
      extra: !this.state.extra,
    });
  }

  handleRightClick = (id) => {
    const item = this.state.items[id];
  
    if (item && item.material) {
      // Copy
      this.setState({ copiedItem: { ...item } });
    } else if (this.state.copiedItem) {
      // Paste
      const items = [...this.state.items];
      items[id] = {
        ...this.state.copiedItem,
        id, // important to override id to target slot
      };
      this.setState({ items });
    }
  }
  updateItem = (e) => {
    let ar = this.state.items;

    if (typeof ar[this.state.selected].material === 'undefined') {
      return;
    }

    let val;

    switch (e.target.type) {
      case 'number':
        val = Number(e.target.value);
        break;
      case 'checkbox':
        val = Boolean(e.target.value);
        break;
      case 'text':
        val = String(e.target.value);
        break;
      default:
        val = String(e.target.value);
        break;
    }

    ar[this.state.selected][e.target.name] = val;

    if ((e.target.type === 'text' || e.target.type === 'textarea') && val === '') {
      delete ar[this.state.selected][e.target.name];
    }

    this.setState({
      items: ar,
    });
  }
  updateRequirement = (type, requirement) => {
    if (type === 'open' || type === 'view') {
      this.setState({
        [`${type}_requirement`]: requirement
      });
    } else if (type.includes('click')) {
      const clickReqs = {...this.state.requirements.click_requirements};
      if (requirement) {
        // Preserve existing requirements and deny_commands if they exist
        const existingReq = clickReqs[type];
        clickReqs[type] = {
          ...requirement,
          requirements: existingReq && existingReq.requirements ? existingReq.requirements : {},
          deny_commands: existingReq && existingReq.deny_commands ? existingReq.deny_commands : []
        };
      } else {
        clickReqs[type] = null;
      }
      this.setState({
        requirements: {
          ...this.state.requirements,
          click_requirements: clickReqs
        }
      });
    }
  }
  updateMinimumRequirements = (value) => {
    this.setState({
      minimum_requirements: parseInt(value) || 0
    });
  }
  updateStopAtSuccess = (value) => {
    this.setState({
      stop_at_success: value
    });
  }

  handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) {
      return;
    }

    const items = [...this.state.items];
    const sourceItem = items[sourceIndex];
    const targetItem = items[targetIndex];

    // Handle items with parent references
    if (sourceItem.parent !== undefined) {
      // If source is a child item, we need to update its parent's slots
      const parentItem = items[sourceItem.parent];
      if (parentItem.slots) {
        parentItem.slots = parentItem.slots.filter(slot => slot !== sourceIndex);
        if (parentItem.slots.length === 1) {
          parentItem.slot = parentItem.slots[0];
          delete parentItem.slots;
        }
      }
    }

    // Swap the items
    [items[sourceIndex], items[targetIndex]] = [items[targetIndex], items[sourceIndex]];

    // Update IDs and slots
    items.forEach((item, idx) => {
      if (item) {
        item.id = idx;
        if (item.slot !== undefined) {
          item.slot = idx;
        }
        // Update parent references
        items.forEach(childItem => {
          if (childItem && childItem.parent === sourceIndex) {
            childItem.parent = targetIndex;
          } else if (childItem && childItem.parent === targetIndex) {
            childItem.parent = sourceIndex;
          }
        });
      }
    });

    this.setState({ items });
  };

  handleConfigChange = (newConfig) => {
    const { isValid, errors } = validateConfig(newConfig);
    if (!isValid) {
      this.setState({
        validationErrors: formatValidationErrors(errors)
      });
    } else {
      this.setState({
        validationErrors: [],
        ...newConfig
      });
    }
  }

  handleDragStart = (e, index) => {
    const item = this.state.items[index];
    const hasIcon = item.icon || (item.parent && this.state.items[item.parent].icon);
    
    if (!hasIcon) {
      e.preventDefault();
      return;
    }

    // Clear any existing drag classes
    document.querySelectorAll('.dragging').forEach(el => 
      el.classList.remove('dragging')
    );

    const slot = e.currentTarget;
    slot.classList.add('dragging');

    // Create a drag image
    if (hasIcon) {
      const img = slot.querySelector('img');
      if (img) {
        const dragImage = img.cloneNode(true);
        dragImage.style.width = '32px';
        dragImage.style.height = '32px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 16, 16);
        setTimeout(() => document.body.removeChild(dragImage), 0);
      }
    }

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }

  handleDragOver = (e) => {
    e.preventDefault();
  }

  handleDragEnter = (e) => {
    const slot = e.target.closest('.slot');
    if (slot && !slot.classList.contains('dragging')) {
      slot.classList.add('drag-over');
    }
  }

  handleDragLeave = (e) => {
    const slot = e.target.closest('.slot');
    if (slot) {
      slot.classList.remove('drag-over');
    }
  }

  handleDragEnd = () => {
    document.querySelectorAll('.slot').forEach(slot => {
      slot.classList.remove('dragging');
      slot.classList.remove('drag-over');
    });
  }

  handleMenuTypeChange = (newConfig) => {
    this.setState({
      type: newConfig.type,
      size: newConfig.size,
      pagination: newConfig.pagination || this.state.pagination
    });
  };

  handleMenuConfigChange = (newConfig) => {
    this.setState({
      size: newConfig.size,
      pagination: newConfig.pagination || this.state.pagination
    });
  };

  toggleYamlMode = () => {
    // This toggle will now control editability within the YAML section
    this.setState({ isYamlEditable: !this.state.isYamlEditable });
  };

  handleYamlChange = (newValue) => {
    this.setState({
      yamlContent: newValue,
      yamlError: null
    });

    try {
      // Only try to parse if we're in editable mode
      if (this.state.isYamlEditable) {
        YAML.load(newValue);
      }
    } catch (error) {
      this.setState({
        yamlError: `YAML Error: ${error.message}`
      });
    }
  };

  handleCloseItemPicker = () => {
    console.log('Closing item picker');
    this.setState({ 
      showItemPicker: false,
      itemPickerSlot: null 
    }, () => {
      console.log('Item picker closed, state:', {
        showItemPicker: this.state.showItemPicker,
        itemPickerSlot: this.state.itemPickerSlot
      });
    });
  }

  handleItemPickerSelect = (item) => {
    console.log('Item selected:', item);
    const { itemPickerSlot } = this.state;
    if (itemPickerSlot === null) {
      console.log('No slot selected');
      return;
    }

    const items = { ...this.state.items };
    items[itemPickerSlot] = {
      id: itemPickerSlot,
      icon: item.icon,
      material: item.name.replace(/ /g, '_').toUpperCase(),
      slot: itemPickerSlot,
      amount: 1,
      display_name: '',
      lore: '',
      data: '',
      model_data: '',
      durability: '',
      nbt_string: '',
      nbt_int: '',
      banner_meta: [],
      rgb: '',
      base_color: '',
      item_flags: [],
      potion_effects: [],
      entity_type: '',
      enchantments: '',
    };

    this.setState({
      items,
      showItemPicker: false,
      itemPickerSlot: null
    }, () => {
      console.log('Item added to slot, state:', {
        showItemPicker: this.state.showItemPicker,
        itemPickerSlot: this.state.itemPickerSlot,
        items: this.state.items[itemPickerSlot]
      });
    });
  }

  render() {
    const allFields = fields();
    const selectedItem = this.state.items[this.state.selected];
    const rows = Math.ceil(this.state.size / 9);
    const totalSlots = rows * 9;

    console.log('Inventory render - items state:', this.state.items);
    console.log('Selected item:', selectedItem);

    return (
      <div className="editor-layout">
        {/* Item Picker Modal */}
        <Modal
          isOpen={this.state.showItemPicker}
          onRequestClose={this.handleCloseItemPicker}
          style={customStyles}
          contentLabel="Select an Item"
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
        >
          <Search onSelect={this.selectedFromSearch} />
        </Modal>

        <div className="inventory">
          <div id="title">
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleName}
              placeholder="Menu Title"
            />
          </div>

          <div className="menu-type">
            <MenuTypeSelector
              selectedType={this.state.type}
              menuConfig={this.getCurrentConfig()}
              onConfigChange={this.handleMenuConfigChange}
              onChangeItem={(slot) => {
                this.setState({ 
                  showItemPicker: true, 
                  itemPickerSlot: slot 
                });
              }}
              selectedSlot={this.state.selected}
            />
          </div>

          <button 
            className="minecraft-btn"
            onClick={() => {
              if (this.state.selected !== null) {
                this.setState({ showModal: true });
              } else {
                alert('Please select a slot first');
              }
            }}
            style={{
              margin: '10px',
              width: 'calc(100% - 20px)',
              background: '#4CAF50',
              border: '2px solid',
              borderColor: '#43A047 #2E7D32 #2E7D32 #43A047',
              color: 'white',
              textShadow: '1px 1px #1B5E20',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'block',
              position: 'relative',
              zIndex: 100
            }}
          >
            Change Selected Item
          </button>

          <div className="slotSpace">
            {Array(totalSlots).fill().map((_, i) => (
              <DraggableSlot
                key={i}
                id={i}
                index={i}
                item={this.state.items[i]}
                onDrop={this.handleDrop}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragEnd={this.handleDragEnd}
                selectedSlot={() => this.handleSlotSelect(i)}
                onRightClick={i < this.state.size ? () => this.handleRightClick(i) : undefined}
                icon={this.state.items[i]?.icon}
                lore={this.state.items[i]?.lore}
                amount={this.state.items[i]?.amount}
                isDisabled={i >= this.state.size}
                isSelected={this.state.selected === i}
              />
            ))}
          </div>
        </div>

        {/* Item Options Panel */}
        {this.state.selected !== null && (
          <div className="item-options-panel">
            <h3>Item Options</h3>
            <button 
              className="change-item-button"
              onClick={() => {
                if (this.state.selected !== null) {
                  this.setState({ 
                    showItemPicker: true, 
                    itemPickerSlot: this.state.selected 
                  });
                }
              }}
            >
              Change Item
            </button>
            <div className="field-group">
              <label>Material</label>
              <input
                type="text"
                name="material"
                value={selectedItem?.material || ''}
                onChange={this.updateItem}
                placeholder="e.g. DIAMOND_SWORD"
              />
            </div>
            <div className="field-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={selectedItem?.amount || '1'}
                onChange={this.updateItem}
                min="1"
                max="64"
              />
            </div>
            <div className="field-group">
              <label>Display Name</label>
              <input
                type="text"
                name="display_name"
                value={selectedItem?.display_name || ''}
                onChange={this.updateItem}
                placeholder="Custom item name"
              />
            </div>
            <div className="field-group">
              <label>Lore</label>
              <textarea
                name="lore"
                value={selectedItem?.lore || ''}
                onChange={this.updateItem}
                placeholder="Item description (one line per entry)"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  getCurrentConfig = () => {
    const config = {
      title: this.state.name,
      size: this.state.size,
      type: this.state.type,
      open_command: this.state.open_command,
      items: this.state.items
    };

    if (this.state.type === 'PAGINATED' && this.state.pagination.enabled) {
      config.pagination = this.state.pagination;
    }

    return config;
  };

  loadPreset = (config) => {
    this.setState({
      name: config.title || '',
      size: config.size || 27,
      type: config.type || 'CHEST',
      open_command: config.open_command || '',
      items: config.items || {},
      pagination: config.pagination || {
        enabled: false,
        next_page_slot: 26,
        previous_page_slot: 18,
        items_per_page: 28
      }
    });
  };

  getFieldTooltip(fieldName) {
    const tooltips = {
      material: "The Minecraft material type (e.g. DIAMOND_SWORD)",
      amount: "Number of items in the stack (1-64)",
      dynamic_amount: "Dynamic amount using placeholders (e.g. %player_level%)",
      display_name: "Custom name for the item (supports color codes with &)",
      lore: "Item description lines (supports color codes with &, one line per entry)",
      data: "Legacy data value for items (pre-1.13)",
      model_data: "Custom model data for resource packs",
      nbt_string: "String NBT data for the item (e.g. {display:{Name:\"Custom Name\"}})",
      nbt_int: "Integer NBT data for the item (e.g. {CustomModelData:1234})",
      banner_meta: "Banner pattern data (one pattern per line, format: COLOR TYPE)",
      rgb: "RGB color code for leather armor (format: R,G,B)",
      base_color: "Base color for potions and leather armor (e.g. RED, BLUE)",
      item_flags: "Hide certain item attributes (one per line: HIDE_ENCHANTS, HIDE_ATTRIBUTES, etc)",
      potion_effects: "Custom potion effects (format: EFFECT:DURATION:AMPLIFIER, one per line)",
      entity_type: "Type of entity for spawn eggs (e.g. ZOMBIE, SKELETON)",
      enchantments: "Item enchantments (format: ENCHANTMENT:LEVEL, one per line)",
      priority: "Display priority for items in the same slot (higher = front)",
      view_requirement: "Requirement to see this item (supports placeholders)",
      left_click_commands: "Commands to execute on left click (one per line, supports [player], [console], etc)",
      right_click_commands: "Commands to execute on right click (one per line)",
      middle_click_commands: "Commands to execute on middle click (one per line)",
      shift_left_click_commands: "Commands to execute on shift + left click (one per line)",
      shift_right_click_commands: "Commands to execute on shift + right click (one per line)",
      update: "Whether to update this item periodically (for dynamic content)",
      hide_enchantments: "Hide enchantment tooltips from the item",
      hide_attributes: "Hide attribute modifiers from the item",
      hide_effects: "Hide potion effects from the item",
      hide_unbreakable: "Hide the unbreakable tag from the item",
      unbreakable: "Make the item unbreakable",
      actions: "List of actions to execute (one per line)",
      action_delay: "Delay in ticks before executing actions",
      action_chance: "Chance (0-100) for actions to execute",
      sound_effect: "Sound to play when interacting (e.g. BLOCK_NOTE_BLOCK_PLING)",
      sound_volume: "Volume of the sound effect (0.0-1.0)",
      sound_pitch: "Pitch of the sound effect (0.0-2.0)",
      meta_data: "Custom metadata for the item (JSON format)",
      permission_required: "Permission node required to interact with this item",
      economy_cost: "Cost to interact with this item (requires Vault)",
      external_menu: "Name of another menu to open when interacting"
    };
    return tooltips[fieldName] || '';
  }

  getFieldPlaceholder(fieldName) {
    const placeholders = {
      lore: "One line per entry",
      enchantments: "ENCHANTMENT:LEVEL (one per line)",
      potion_effects: "EFFECT:DURATION:AMPLIFIER (one per line)",
      item_flags: "One flag per line (e.g. HIDE_ENCHANTS)",
      banner_meta: "COLOR TYPE (one pattern per line)",
      left_click_commands: "One command per line",
      right_click_commands: "One command per line",
      middle_click_commands: "One command per line",
      shift_left_click_commands: "One command per line",
      shift_right_click_commands: "One command per line",
      actions: "One action per line",
      meta_data: "JSON format",
      material: "e.g. DIAMOND_SWORD",
      rgb: "R,G,B format",
      base_color: "e.g. RED, BLUE",
      entity_type: "e.g. ZOMBIE, SKELETON",
      sound_effect: "e.g. BLOCK_NOTE_BLOCK_PLING",
      permission_required: "Permission node",
      external_menu: "Menu name"
    };
    return placeholders[fieldName] || '';
  }
}
