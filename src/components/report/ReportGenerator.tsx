import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import ReportSectionModule from './ReportSectionModule';

interface OutlineItem {
  id: string;
  content: string;
  checked: boolean;
}

interface ReportSection {
  id: string;
  title: string;
  outline: OutlineItem[];
}

const ReportBuilder: React.FC = () => {
  const [sections, setSections] = useState<ReportSection[]>([
    {
      id: 'articulation-1',
      title: 'Articulation',
      outline: [
        { id: 'item-1', content: 'GFTA-3 results', checked: true },
        { id: 'item-2', content: 'Speech sample analysis', checked: true },
        { id: 'item-3', content: 'Parent report', checked: true },
      ],
    },
    {
      id: 'language-1',
      title: 'Language',
      outline: [
        { id: 'item-1', content: 'Receptive language assessment', checked: true },
        { id: 'item-2', content: 'Expressive language assessment', checked: true },
        { id: 'item-3', content: 'Pragmatic skills', checked: true },
      ],
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const handleOutlineConfirm = (sectionId: string, confirmedItems: OutlineItem[]) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId ? { ...section, outline: confirmedItems } : section
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="report">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, index) => (
              <ReportSectionModule
                key={section.id}
                id={section.id}
                index={index}
                title={section.title}
                initialOutline={section.outline}
                onOutlineConfirm={(items) => handleOutlineConfirm(section.id, items)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ReportBuilder;