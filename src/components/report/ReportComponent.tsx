import React, { useState } from 'react';
import { Card, Textarea, Button, Table } from 'flowbite-react';

interface CardProps {
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

export const InputCard: React.FC<CardProps & { onSubmit: (input: string) => void }> = ({ title, description, onSubmit }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(input);
    setIsLoading(false);
  };

  return (
    <Card className="p-4 text-md w-full">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        {title} Input
      </h5>
      <div className="mb-4">
        <Textarea
          id={`${title.toLowerCase()}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter ${title.toLowerCase()} information`}
          rows={4}
          required
        />
        <Button onClick={handleSubmit} color="blue" className="w-auto mt-2" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </Card>
  );
};

export const OutputCard: React.FC<CardProps & { output: any }> = ({
    title,
    description,
    output,
  }) => {
    return (
        <Card className="p-4 text-md w-full">
  <h5 className="text-xl text-center font-normal tracking-tight text-gray-900 dark:text-white mb-4">
    {title} Output
  </h5>
  {output ? (
    title === "Header" ? (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <tbody>
            {(() => {
              const entries = Object.entries(output as HeaderInfo);
              const rows = [];
              for (let i = 0; i < entries.length; i += 2) {
                const [key1, value1] = entries[i];
                const [key2, value2] = entries[i + 1] || [null, null];
                rows.push(
                  <tr key={i} className="bg-white dark:bg-gray-800">
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap border-b border-gray-200 dark:border-gray-600">
                      {key1}:
                    </td>
                    <td
                      className={`px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 ${
                        !value1 || value1 === "Not provided" ? 'missing-data' : ''
                      }`}
                    >
                      {value1 && value1 !== "Not provided" ? value1 : ''}
                    </td>
                    {key2 && (
                      <>
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap border-b border-gray-200 dark:border-gray-600">
                          {key2}:
                        </td>
                        <td
                          className={`px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 ${
                            !value2 || value2 === "Not provided" ? 'missing-data' : ''
                          }`}
                        >
                          {value2 && value2 !== "Not provided" ? value2 : ''}
                        </td>
                      </>
                    )}
                  </tr>
                );
              }
              return rows;
            })()}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="font-normal text-gray-700 dark:text-gray-300">
        {output as string}
      </p>
    )
  ) : (
    <div className="font-normal text-gray-700 dark:text-gray-300">
      <p>{description}</p>
    </div>
  )}
</Card>


      
    );
  };
  