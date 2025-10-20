import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableLinkItem = ({ link, onEdit, onDelete, onHover, onLeave }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: link._id,
    data: {
      type: 'link',
      link,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={(e) => onHover(link, e.currentTarget)}
      onMouseLeave={onLeave}
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
          className="flex flex-grow items-center space-x-4 cursor-grab active:cursor-grabbing min-w-0"
        >
          <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            👆
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
            <p className="text-sm text-gray-600 truncate" title={link.url}>
              {link.url}
            </p>
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