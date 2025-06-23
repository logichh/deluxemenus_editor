import './App.css';
import React, { Component } from 'react';
import { getTextureBase64 } from './utils/textureLoader';

export class Item extends Component {
  getItemIcon(name) {
    if (!name) return null;
    const icon = getTextureBase64(name);
    return icon ? `data:image/png;base64,${icon}` : null;
  }

  render() {
    // Try to get icon from props or look it up
    let imgSrc = this.props.icon ? `data:image/png;base64,${this.props.icon}` : null;
    if (!imgSrc && this.props.img) {
      imgSrc = this.getItemIcon(this.props.img);
    }

    // Default to stone icon
    const defaultIcon = getTextureBase64('stone') || '';

    return (
      <div className="item">
        <img
          src={imgSrc || `data:image/png;base64,${defaultIcon}`}
          title={this.props.name}
          alt={this.props.name || ''}
          style={{
            width: '32px',
            height: '32px',
            imageRendering: 'pixelated',
            backgroundColor: 'transparent'
          }}
          onError={(e) => {
            console.log('Failed to load image:', this.props.img);
            // Try to get the item with different name variations
            const icon = this.getItemIcon(this.props.img);
            if (icon) {
              e.target.src = icon;
            } else {
              e.target.src = `data:image/png;base64,${defaultIcon}`;
            }
          }}
        />
        {this.props.count > 1 && (
        <div className="number">
          {this.props.count}
        </div>
        )}
      </div>
    );
  }
}
