/* eslint-disable no-unused-vars */
import React, { useState, useLayoutEffect, useRef } from 'react';
import { getLinkDetails } from '../utils/linkParser'; 
export { SortableLinkItem } from './SortableLinkItem'; // Export for re-use
import {
  useDroppable,
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

const Collection = ({ collection }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `collection-${collection._id}`,
    data: {
      type: 'collection',
      collection,
    },
  });

  return (
    <div ref={setNodeRef} className={`p-4 rounded-xl border-2 transition-all ${isOver ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}>
      <h3 className="font-semibold text-gray-800">📁 {collection.title}</h3>
    </div>
  );
};

const SortableLinkItem = ({ link, onEdit, onDelete, onHover, onLeave }) => {
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

const LinkPreviewCard = ({ link, containerRef }) => {
  const [style, setStyle] = useState({});
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    if (link && containerRef.current && cardRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = link.element.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const gap = 16;

      let leftPosition;
      const rightEdge = itemRect.right + gap + cardRect.width;
      const leftEdge = itemRect.left - gap - cardRect.width;

      // Prefer to position on the right
      if (rightEdge < window.innerWidth) {
        leftPosition = itemRect.width + gap;
      // If not enough space on the right, try the left
      } else if (leftEdge > 0) {
        leftPosition = -cardRect.width - gap;
      // If not enough space on either side, align it to the right edge of the viewport
      } else {
        leftPosition = window.innerWidth - containerRect.left - cardRect.width - gap;
      }

      setStyle({
        position: 'absolute',
        top: `${itemRect.top - containerRect.top}px`,
        left: `${leftPosition}px`,
        transform: 'translateY(-50%)',
        opacity: 1,
      });
    }
  }, [link, containerRef]);

  if (!link) return null;

  const details = getLinkDetails(link.url);
  if (details.type === 'standard') return null;

  return (
    <div ref={cardRef} style={style} className="w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 transition-opacity duration-200 pointer-events-none opacity-0">
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

const DraggableLinkList = ({ links, collections = [], onReorder, onEdit, onDelete, onAssignToCollection }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [hoveredLink, setHoveredLink] = useState(null);
  const containerRef = useRef(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    // Handle dropping a link into a collection
    if (active.data.current?.type === 'link' && over.data.current?.type === 'collection') {
      const linkId = active.id;
      const collectionId = over.data.current.collection._id;
      onAssignToCollection(linkId, collectionId);
      return;
    }

    // Handle reordering links
    if (active.data.current?.type === 'link' && over.data.current?.type === 'link' && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link._id === active.id);
      const newIndex = links.findIndex((link) => link._id === over.id);
      onReorder(arrayMove(links, oldIndex, newIndex));
    }
  };

  const handleHover = (link, element) => {
    setHoveredLink({ ...link, element });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="relative" ref={containerRef}>
        {collections.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
            <h3 className="font-semibold text-gray-700 mb-3">My Collections</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <UncategorizedDropZone onAssignToCollection={onAssignToCollection} />
              {collections.map(collection => (
                <Collection key={collection._id} collection={collection} />
              ))}
            </div>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Uncategorized Links</h3>
        <SortableContext items={links.map(link => link._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {links.map((link) => (
              <SortableLinkItem
                key={link._id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
                onHover={handleHover}
                onLeave={() => setHoveredLink(null)}
              />
            ))}
          </div>
        </SortableContext>
        <LinkPreviewCard link={hoveredLink} containerRef={containerRef} />
      </div>
    </DndContext>
  );
};

const UncategorizedDropZone = ({ onAssignToCollection }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'collection-uncategorized',
    data: {
      type: 'collection',
      collection: { _id: null }, // Use null to signify uncategorized
    },
  });

  return (
    <div ref={setNodeRef} className={`p-4 rounded-xl border-2 transition-all ${isOver ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'}`}>
      <h3 className="font-semibold text-gray-800">📥 Uncategorized</h3>
    </div>
  );
};


export default DraggableLinkList;