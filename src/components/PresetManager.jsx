import React, { useState, useEffect } from 'react';
import YAML from 'js-yaml';
import CollapsibleSection from './CollapsibleSection';
import './PresetManager.css';

const defaultPluginIntegrations = {
  headDatabase: false,
  itemsAdder: false,
  oraxen: false
};

const defaultLang = {
  'Plugin Integrations': 'Plugin Integrations',
  'External Menus': 'External Menus',
  'preset_name': 'Preset Name',
  'save_preset': 'Save Preset',
  'paste_yaml': 'Paste YAML Configuration',
  'import': 'Import',
  'export': 'Export',
  'load': 'Load',
  'delete': 'Delete'
};

const PresetManager = ({ currentConfig, onLoadPreset, LANG = defaultLang }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [presetName, setPresetName] = useState('');
  const [yamlContent, setYamlContent] = useState('');
  const [savedPresets, setSavedPresets] = useState(() => {
    const saved = localStorage.getItem('menuPresets');
    return saved ? JSON.parse(saved) : {};
  });
  const [externalMenus, setExternalMenus] = useState({});
  const [pluginIntegrations, setPluginIntegrations] = useState(() => {
    // Try to get plugin integrations from currentConfig, fallback to defaults
    return currentConfig?.pluginIntegrations || { ...defaultPluginIntegrations };
  });

  // Load external menus from a directory
  const handleLoadExternalMenus = async (e) => {
    const files = e.target.files;
    const newExternalMenus = { ...externalMenus };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.yml')) {
        try {
          const content = await readFileAsync(file);
          const menuConfig = YAML.load(content);
          newExternalMenus[file.name] = menuConfig;
        } catch (error) {
          console.error(`Error loading ${file.name}:`, error);
        }
      }
    }

    setExternalMenus(newExternalMenus);
  };

  // Helper function to read file content
  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const newPresets = {
      ...savedPresets,
      [presetName]: {
        ...currentConfig,
        category: selectedCategory !== 'all' ? selectedCategory : 'custom',
        createdAt: new Date().toISOString(),
        pluginIntegrations: { ...pluginIntegrations }
      }
    };

    setSavedPresets(newPresets);
    localStorage.setItem('menuPresets', JSON.stringify(newPresets));
    setPresetName('');
  };

  const handleDeletePreset = (name) => {
    const newPresets = { ...savedPresets };
    delete newPresets[name];
    setSavedPresets(newPresets);
    localStorage.setItem('menuPresets', JSON.stringify(newPresets));
  };

  const handleImportYAML = () => {
    try {
      const config = YAML.load(yamlContent);
      onLoadPreset(config);
      setYamlContent('');
    } catch (error) {
      alert('Invalid YAML configuration: ' + error.message);
    }
  };

  const handleExportYAML = () => {
    const configToExport = {
      ...currentConfig,
      plugin_integrations: Object.entries(pluginIntegrations)
        .filter(([_, enabled]) => enabled)
        .map(([plugin]) => plugin)
    };

    const yamlStr = YAML.dump(configToExport);
    const blob = new Blob([yamlStr], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_config.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="preset-manager">
      {/* Plugin Integrations */}
      <CollapsibleSection title={LANG['Plugin Integrations']}>
        <div className="plugin-integrations">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="headDatabase"
              checked={!!pluginIntegrations?.headDatabase}
              onChange={(e) => {
                const checked = e.target?.checked ?? false;
                setPluginIntegrations(prev => ({
                  ...prev,
                  headDatabase: checked
                }));
              }}
            />
            <label htmlFor="headDatabase">HeadDatabase</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="itemsAdder"
              checked={!!pluginIntegrations?.itemsAdder}
              onChange={(e) => {
                const checked = e.target?.checked ?? false;
                setPluginIntegrations(prev => ({
                  ...prev,
                  itemsAdder: checked
                }));
              }}
            />
            <label htmlFor="itemsAdder">ItemsAdder</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="oraxen"
              checked={!!pluginIntegrations?.oraxen}
              onChange={(e) => {
                const checked = e.target?.checked ?? false;
                setPluginIntegrations(prev => ({
                  ...prev,
                  oraxen: checked
                }));
              }}
            />
            <label htmlFor="oraxen">Oraxen</label>
          </div>
        </div>
      </CollapsibleSection>

      {/* External Menus */}
      <CollapsibleSection title={LANG['External Menus']}>
        <div className="external-menus">
          <input
            type="file"
            multiple
            accept=".yml"
            onChange={handleLoadExternalMenus}
            className="file-input"
          />
          <div className="external-menu-list">
            {Object.entries(externalMenus).map(([filename, menu]) => (
              <div key={filename} className="external-menu-item">
                <span>{filename}</span>
                <button onClick={() => onLoadPreset(menu)}>Load</button>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Save Preset */}
      <div className="preset-form">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder={LANG['preset_name']}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="custom">Custom</option>
          <option value="shop">Shop</option>
          <option value="menu">Menu</option>
          <option value="gui">GUI</option>
        </select>
        <button onClick={handleSavePreset}>{LANG['save_preset']}</button>
      </div>

      {/* Saved Presets */}
      <div className="preset-list">
        {Object.entries(savedPresets).map(([name, preset]) => (
          <div key={name} className="preset-item">
            <div className="preset-info">
              <span className="preset-name">{name}</span>
              <span className="preset-category">{preset.category}</span>
              <span className="preset-date">
                {new Date(preset.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="preset-actions">
              <button onClick={() => onLoadPreset(preset)}>{LANG['load']}</button>
              <button onClick={() => handleDeletePreset(name)}>{LANG['delete']}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetManager; 