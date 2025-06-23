import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Slot } from '../slot';

const DraggableSlot = ({ id, index, ...props }) => {
  return (
    <Draggable draggableId={`slot-${id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`draggable-slot ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <Slot id={id} {...props} />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableSlot; 