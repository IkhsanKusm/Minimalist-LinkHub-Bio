import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableLinkItem } from './DraggableLinkList';
import GlassCard from './GlassCard';

const CollectionLinks = ({
  collection,
  links,
  onReorder,
  onEdit,
  onDelete,
  onAssignToCollection,
  onLinkHover,
  onLinkLeave,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { setNodeRef, isOver } = useDroppable({
    id: `collection-links-${collection._id}`,
    data: {
      type: 'collection',
      collection,
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    // Handle reordering links within this collection
    if (active.data.current?.type === 'link' && over.data.current?.type === 'link' && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link._id === active.id);
      const newIndex = links.findIndex((link) => link._id === over.id);

      // Ensure both links are in the current collection before reordering
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(collection._id, arrayMove(links, oldIndex, newIndex));
      }
      return;
    }

    // Handle dropping a link from another list into this collection
    if (active.data.current?.type === 'link' && over.id === `collection-links-${collection._id}`) {
      const linkId = active.id;
      // Prevent re-assigning to the same collection
      if (active.data.current.link.collectionId !== collection._id) {
        onAssignToCollection(linkId, collection._id);
      }
    }
  };

  return (
    <GlassCard className={`p-6 transition-colors ${isOver ? 'bg-blue-50' : ''}`} ref={setNodeRef}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">📁 {collection.title}</h3>
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
                onHover={onLinkHover}
                onLeave={onLinkLeave}
              />
            ))}
            {links.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">Drag links here to add them to this collection.</div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </GlassCard>
  );
};

export default CollectionLinks;