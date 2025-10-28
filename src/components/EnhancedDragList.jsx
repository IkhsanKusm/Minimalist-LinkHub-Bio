import React, { useState } from 'react';

const EnhancedDragList = ({ links, onReorder, onEdit, onDelete }) => {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragStart = (e, linkId) => {
    setDraggingId(linkId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, linkId) => {
    e.preventDefault();
    if (linkId !== draggingId) {
      setDragOverId(linkId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetLinkId) => {
    e.preventDefault();
    
    if (!draggingId || draggingId === targetLinkId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const draggedIndex = links.findIndex(link => link.id === draggingId);
    const targetIndex = links.findIndex(link => link.id === targetLinkId);

    const newLinks = [...links];
    const [movedItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, movedItem);
    
    onReorder(newLinks);
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div
          key={link.id}
          draggable
          onDragStart={(e) => handleDragStart(e, link.id)}
          onDragOver={(e) => handleDragOver(e, link.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, link.id)}
          onDragEnd={handleDragEnd}
          className={`
            p-4 rounded-xl border-2 transition-all duration-300 cursor-move
            ${
              link.id === draggingId
                ? 'bg-blue-50 border-blue-500 shadow-lg rotate-1 scale-105'
                : link.id === dragOverId
                ? 'bg-green-50 border-green-500 border-dashed'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`
                text-2xl transition-opacity
                ${link.id === draggingId ? 'opacity-100' : 'opacity-60'}
              `}>
                👆
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.url}</p>
                {link.clicks !== undefined && (
                  <p className="text-xs text-blue-600 mt-1">{link.clicks} clicks</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEdit(link)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(link.id)} 
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedDragList;