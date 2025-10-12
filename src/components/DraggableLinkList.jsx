import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableLinkItem = ({ link, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-4 bg-white rounded-xl border-2 transition-all duration-50 cursor-grab
        ${isDragging 
          ? 'border-blue-500 shadow-lg rotate-2 z-50' 
          : 'border-gray-200 hover:border-blue-300'
        }
        active:cursor-grabbing
      `}
    >
      <div className="flex items-center justify-between">
        <div 
          {...attributes} 
          {...listeners} 
          className="flex flex-grow items-center space-x-4 cursor-grab active:cursor-grabbing"
        >
          <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            👆
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{link.title}</h3>
            <p className="text-sm text-gray-600">{link.url}</p>
            {link.clicks !== undefined && (
              <p className="text-xs text-blue-600 mt-1">{link.clicks} click{link.clicks !== 1 && 's'}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(link)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onPointerDown={(e) => e.stopPropagation()}
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(link._id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            onPointerDown={(e) => e.stopPropagation()}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

const DraggableLinkList = ({ links, onReorder, onEdit, onDelete }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((link) => link._id === active.id);
      const newIndex = links.findIndex((link) => link._id === over.id);

      const reorderedLinks = arrayMove(links, oldIndex, newIndex);
      onReorder(reorderedLinks);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {links.map((link) => (
            <SortableLinkItem
              key={link._id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableLinkList;