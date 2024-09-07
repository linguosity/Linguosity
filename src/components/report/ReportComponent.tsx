import React, { useState } from 'react';
import { Card, Textarea, Button, Table } from 'flowbite-react';

interface ReportCardProps {
  title: string;
  description: string;
}

interface HeaderInfo {
  Name: string;
  Birthday: string;
  DateOfEvaluation: string;
  DateOfReport: string;
  Parents: string;
  Eligibility: string;
  Age: string;
  Grade: string;
  Evaluator: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description }) => {
  console.log(`Rendering ReportCard for ${title}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | HeaderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    console.log(`Submit button clicked for ${title}`);
    setIsLoading(true);
    try {
      const endpoint = title === "Header" 
        ? '/api/ai/process/structured-output'
        : '/api/ai/process';
      console.log(`Using endpoint: ${endpoint}`);

      console.log('Sending request with input:', input);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, title }),
      });

      console.log('Response received');
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      console.log('Parsed response data:', data);
      
      setOutput(data);
      console.log('Output state updated');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  };

  return (
    <div className="flex justify-between gap-4 mb-4">
      <Card className="p-4 text-md w-1/2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {title} Input
        </h5>
        <div className="mb-4">
          <Textarea
            id={`${title.toLowerCase()}-input`}
            value={input}
            onChange={(e) => {
              console.log(`Input changed for ${title}:`, e.target.value);
              setInput(e.target.value);
            }}
            placeholder={`Enter ${title.toLowerCase()} information`}
            rows={4}
            required
          />
          <Button onClick={handleSubmit} color="blue" className="w-auto mt-2" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </Card>

      <Card className="p-4 text-md w-1/2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {title} Output
        </h5>
        {output ? (
          title === "Header" ? (
            <Table>
              <Table.Body className="divide-y">
                {Object.entries(output as HeaderInfo).map(([key, value]) => (
                  <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {key}:
                    </Table.Cell>
                    <Table.Cell>{value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {output as string}
            </p>
          )
        ) : (
          <div className="font-normal text-gray-700 dark:text-gray-400 relative">
            <p className="relative z-10">{description}</p>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 animate-shimmer"></div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportCard;