// Validation rules for menu configuration
const rules = {
  menu_title: {
    required: true,
    type: 'string',
    maxLength: 128,
  },
  open_command: {
    required: true,
    type: ['string', 'array'],
    pattern: /^[a-zA-Z0-9_-]+$/,
    maxLength: 32,
  },
  size: {
    required: true,
    type: 'number',
    min: 1,
    max: 54,
  },
  inventory_type: {
    type: 'string',
    validValues: [
      'CHEST', 
      'HOPPER', 
      'DROPPER', 
      'DISPENSER', 
      'BREWING', 
      'FURNACE', 
      'WORKBENCH', 
      'ENCHANTING', 
      'ANVIL',
      'CARTOGRAPHY',
      'GRINDSTONE',
      'SMITHING',
      'LOOM',
      'STONECUTTER'
    ],
  },
  register_command: {
    type: 'boolean',
  },
  args: {
    type: 'array',
    itemType: 'string',
  },
  args_usage_message: {
    type: 'string',
  },
  update_interval: {
    type: 'number',
    min: 1,
  },
  open_commands: {
    type: 'array',
    itemType: 'string',
  },
  close_commands: {
    type: 'array',
    itemType: 'string',
  },
  minimum_requirements: {
    type: 'number',
    min: 0,
  },
  stop_at_success: {
    type: 'boolean',
  },
  items: {
    type: 'object',
    properties: {
      material: {
        required: true,
        type: 'string',
      },
      amount: {
        type: 'number',
        min: 1,
        max: 64,
      },
      display_name: {
        type: 'string',
      },
      lore: {
        type: 'array',
        itemType: 'string',
      },
      slot: {
        type: 'number',
        min: 0,
      },
      priority: {
        type: 'number',
        min: 0,
      },
      nbt_data: {
        type: 'object',
      },
      custom_model_data: {
        type: 'number',
        min: 0,
      },
      enchantments: {
        type: 'array',
        itemType: 'object',
        itemProperties: {
          enchantment: {
            required: true,
            type: 'string',
          },
          level: {
            type: 'number',
            min: 1,
          },
        },
      },
      potion_effects: {
        type: 'array',
        itemType: 'object',
        itemProperties: {
          effect: {
            required: true,
            type: 'string',
          },
          duration: {
        type: 'number',
        min: 1,
      },
          amplifier: {
            type: 'number',
            min: 0,
          },
        },
      },
      banner_patterns: {
        type: 'array',
        itemType: 'object',
        itemProperties: {
          pattern: {
            required: true,
            type: 'string',
          },
          color: {
            required: true,
            type: 'string',
          },
        },
      },
      head_owner: {
        type: 'string',
      },
      head_texture: {
        type: 'string',
      },
      item_flags: {
        type: 'array',
        itemType: 'string',
        validValues: [
          'HIDE_ENCHANTS',
          'HIDE_ATTRIBUTES',
          'HIDE_UNBREAKABLE',
          'HIDE_DESTROYS',
          'HIDE_PLACED_ON',
          'HIDE_POTION_EFFECTS',
          'HIDE_DYE'
        ],
      },
      unbreakable: {
        type: 'boolean',
      },
      update: {
        type: 'boolean',
      },
      hide_attributes: {
        type: 'boolean',
      },
      view_requirement: {
        type: 'object',
      },
      left_click_requirement: {
        type: 'object',
      },
      right_click_requirement: {
        type: 'object',
      },
      shift_left_click_requirement: {
        type: 'object',
      },
      shift_right_click_requirement: {
        type: 'object',
      },
      middle_click_requirement: {
        type: 'object',
      },
      double_click_requirement: {
        type: 'object',
      },
      drag_requirement: {
        type: 'object',
      },
      left_click_commands: {
        type: 'array',
        itemType: 'string',
      },
      right_click_commands: {
        type: 'array',
        itemType: 'string',
              },
      shift_left_click_commands: {
                type: 'array',
                itemType: 'string',
              },
      shift_right_click_commands: {
        type: 'array',
        itemType: 'string',
            },
      middle_click_commands: {
        type: 'array',
        itemType: 'string',
          },
      double_click_commands: {
        type: 'array',
        itemType: 'string',
        },
      drag_commands: {
        type: 'array',
        itemType: 'string',
      },
    },
  },
  open_requirement: {
    type: 'object',
  },
  view_requirement: {
    type: 'object',
  },
  click_requirement: {
    type: 'object',
  },
  global_requirements: {
    type: 'object',
  },
};

// Helper function to validate a single field
const validateField = (value, rules) => {
  if (rules.required && (value === undefined || value === null || value === '')) {
    return 'This field is required';
  }

  if (value !== undefined && value !== null) {
    if (Array.isArray(rules.type)) {
      if (!rules.type.includes(typeof value)) {
        return `Value must be one of: ${rules.type.join(', ')}`;
      }
    } else if (typeof value !== rules.type) {
      return `Value must be a ${rules.type}`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
      return 'Value does not match required pattern';
    }

    if (rules.maxLength && String(value).length > rules.maxLength) {
      return `Value must be no longer than ${rules.maxLength} characters`;
  }

  if (rules.min !== undefined && value < rules.min) {
      return `Value must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && value > rules.max) {
      return `Value must be no more than ${rules.max}`;
  }

    if (rules.validValues && !rules.validValues.includes(value)) {
      return `Value must be one of: ${rules.validValues.join(', ')}`;
    }

    if (rules.itemType && Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== rules.itemType) {
          return `Array items must be of type ${rules.itemType}`;
      }
        if (rules.itemProperties) {
          const itemError = validateField(item, rules.itemProperties);
          if (itemError) {
            return `Invalid array item: ${itemError}`;
          }
        }
      }
    }
  }

  return null;
};

// Validate an entire menu configuration
export const validateConfig = (config) => {
  const errors = {};

  // Validate top-level fields
  Object.entries(rules).forEach(([field, fieldRules]) => {
    if (field !== 'items') {
      const error = validateField(config[field], fieldRules);
      if (error) {
        errors[field] = error;
      }
    }
  });

  // Validate items
  if (config.items) {
    const itemErrors = {};
    Object.entries(config.items).forEach(([itemId, item]) => {
      const itemFieldErrors = {};
      Object.entries(rules.items.properties).forEach(([prop, propRules]) => {
        const error = validateField(item[prop], propRules);
        if (error) {
          itemFieldErrors[prop] = error;
        }
      });
      if (Object.keys(itemFieldErrors).length > 0) {
        itemErrors[itemId] = itemFieldErrors;
      }
    });
    if (Object.keys(itemErrors).length > 0) {
      errors.items = itemErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper function to format validation errors for display
export const formatValidationErrors = (errors) => {
  const messages = [];

  Object.entries(errors).forEach(([field, error]) => {
    if (field === 'items') {
      Object.entries(error).forEach(([itemId, itemErrors]) => {
        Object.entries(itemErrors).forEach(([prop, msg]) => {
          messages.push(`Item ${itemId} ${prop}: ${msg}`);
        });
      });
    } else {
      messages.push(`${field}: ${error}`);
    }
  });

  return messages;
}; 