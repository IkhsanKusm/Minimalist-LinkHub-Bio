import React, { useState } from 'react';
import { getLinkDetails } from '../utils/linkParser';
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

const SortableLinkItem = ({ link, onEdit, onDelete, onHover, onLeave }) => {
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
      onMouseEnter={() => onHover(link)}
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

const LinkPreviewCard = ({ link }) => {
  if (!link) return null;

  const details = getLinkDetails(link.url);
  if (details.type === 'standard') return null;

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-full mr-4 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in pointer-events-none">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {details.type === 'image' && (
          <img src={details.src} alt="Link preview" className="w-full h-full object-cover" />
        )}
        {details.type === 'video' && details.platform === 'youtube' && (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${details.videoId}?autoplay=1&mute=1&controls=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        {details.type === 'video' && details.platform === 'vimeo' && (
          <iframe
            className="w-full h-full"
            src={`https://player.vimeo.com/video/${details.videoId}?autoplay=1&muted=1&background=1`}
            title="Vimeo video player"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen></iframe>
        )}
      </div>
      <div className="p-3 text-sm truncate">
        <p className="font-semibold text-gray-800">{link.title}</p>
        <p className="text-gray-500">{link.url}</p>
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

  const [hoveredLink, setHoveredLink] = useState(null);

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
      <div className="relative">
        <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {links.map((link) => (
              <SortableLinkItem
                key={link._id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
                onHover={setHoveredLink}
                onLeave={() => setHoveredLink(null)}
              />
            ))}
          </div>
        </SortableContext>
        <LinkPreviewCard link={hoveredLink} />
      </div>
    </DndContext>
  );
};

export default DraggableLinkList;