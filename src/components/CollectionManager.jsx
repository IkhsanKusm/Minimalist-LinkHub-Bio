import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableCollectionItem = ({ collection, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: collection._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center bg-gray-100 rounded-full pl-2 pr-2 py-1 text-sm font-medium text-gray-700 shadow-sm">
      <button {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-gray-400 touch-none">
        <GripVertical size={16} />
      </button>
      <span className="pl-2">{collection.title}</span>
      <button 
        onClick={() => onDelete(collection._id)}
        className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full"
        aria-label={`Delete ${collection.title}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const CollectionManager = ({ collections = [], onCreate, onDelete, onReorder }) => {
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCreate = () => {
    if (!newCollectionTitle.trim()) return;
    onCreate(newCollectionTitle);
    setNewCollectionTitle(''); // Reset input after creation
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = collections.findIndex(c => c._id === active.id);
      const newIndex = collections.findIndex(c => c._id === over.id);
      onReorder(arrayMove(collections, oldIndex, newIndex));
    }
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Collections</h2>
      <div className="space-y-4">
        {/* List of existing collections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={collections.map(c => c._id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-3">
              {collections.map(collection => (
                <SortableCollectionItem key={collection._id} collection={collection} onDelete={onDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {/* Input for new collection */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCollectionTitle}
            onChange={(e) => setNewCollectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New collection name..."
            className="flex-grow px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <NeumorphicButton onClick={handleCreate}>
            <Plus size={20} />
          </NeumorphicButton>
        </div>
      </div>
    </GlassCard>
  );
};

export default CollectionManager;