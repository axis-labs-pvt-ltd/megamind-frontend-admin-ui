'use client';

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from 'react';

interface DraggableListItem {
  id: string;
  content: string;
}

interface DraggableListProps {
  items: DraggableListItem[];
  onReorder: (newItems: DraggableListItem[]) => void;
  renderItem: (item: DraggableListItem, index: number) => React.ReactNode;
}

export function DraggableList({ items, onReorder, renderItem }: DraggableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id} index={index}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  id: string;
  index: number;
  children: React.ReactNode;
}

function SortableItem({ id, index, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x-2">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-[var(--bg-secondary)] rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-[var(--text-muted)]" />
      </button>
      <span className="text-sm font-medium text-[var(--text-muted)] w-6">
        {index + 1}
      </span>
      {children}
    </div>
  );
}
