"use client"

import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { AIResponse, AIResponseSchema } from '@/types/ai'

const ConversationalInput: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai'; content: string | AIResponse }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConversation(prev => [...prev, { type: 'user', content: input }]);
    
    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const aiResponse = AIResponseSchema.parse(data);
      
      setConversation(prev => [...prev, { type: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error processing input:', error);
      setConversation(prev => [...prev, { type: 'ai', content: {
        id: 'error',
        parsed_content: 'Sorry, an error occurred.',
        report_content_id: null,
        created_at: new Date().toISOString(),
      } as AIResponse }]);
    }
    
    setInput('');
  };

  const renderContent = (content: string | AIResponse) => {
    if (typeof content === 'string') {
      return content;
    }
    
    // If parsed_content is an object, convert it to a string or JSX
    if (typeof content.parsed_content === 'object') {
      return (
        <pre>{JSON.stringify(content.parsed_content, null, 2)}</pre>
      );
    }
  
    return content.parsed_content;
  };
  

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        AI Assistant
      </div>
      {isOpen && (
        <div className="p-4">
          <div className="h-64 overflow-y-auto mb-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {renderContent(msg.content)}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex">
            <TextInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConversationalInput;