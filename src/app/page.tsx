"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import ReportCard from "../components/report/ReportComponent";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface ReportItem {
  id: string;
  title: string;
  description: string;
}

export default function Home() {
  console.log('Rendering Home component');

  const [reportItems, setReportItems] = useState<ReportItem[]>([
    { id: 'header', title: "Header", description: "Generate the header section of the report with client information." },
    { id: 'articulation', title: "Articulation", description: "Assess and report on the client's articulation skills." },
    { id: 'language', title: "Language", description: "Evaluate and document the client's language abilities." },
    { id: 'fluency', title: "Fluency", description: "Analyze and report on the client's speech fluency." },
  ]);

  useEffect(() => {
    console.log('Initial reportItems:', reportItems);
  }, []);

  const onDragEnd = (result: any) => {
    console.log('Drag ended:', result);
    if (!result.destination) {
      console.log('No destination, skipping reorder');
      return;
    }

    const items = Array.from(reportItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    console.log('New order:', items);
    setReportItems(items);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="report-cards">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full max-w-5xl"
            >
              {reportItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ReportCard
                        title={item.title}
                        description={item.description}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-12">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}