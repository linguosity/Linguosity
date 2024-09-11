// Importing necessary components and functions from React and Flowbite
import React, { useState } from 'react';
import { Card, Textarea, Button, Table, Progress } from 'flowbite-react';
import { reportStructures } from '../../lib/reportStructures' // Adjust the path as needed

// This defines what properties our card components should have
interface CardProps {
  title: string;
  description: string;
}

// This is the component for the input card where users enter information
export const InputCard: React.FC<CardProps & { onSubmit: (input: any) => void, existingData?: any }> = ({ title, description, onSubmit, existingData }) => {
    // These are variables to store the input and loading state
    const [input, setInput] = useState(existingData || '');
    const [isLoading, setIsLoading] = useState(false);
  
    // This function handles what happens when the submit button is clicked
    const handleSubmit = async () => {
      setIsLoading(true);
      const mergedInput = { ...existingData, new_information: input };  // Combine new and existing data
      console.log('Submitting for section:', title); 
      await onSubmit(mergedInput);  // Send the combined data
      setIsLoading(false);
    };
  
    // This is what the input card looks like
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
            {isLoading ? 'Generating...' : 'Submit'}
          </Button>
        </div>
      </Card>
    );
  };
  
// This is the component for the output card that displays the results
export const OutputCard: React.FC<CardProps & { output: any, existingData?: any }> = ({
  title,
  description,
  output,
  existingData,
}) => {
  // Combine existing data and new output
  const mergedData = { ...existingData, ...output };

  // Function to count filled elements
  const countFilledElements = (data: any): number => {
    if (typeof data !== 'object' || data === null) return 0;
    return Object.values(data).filter(value => 
      value !== null && value !== undefined && value !== '' && value !== 'Not provided'
    ).length;
  };

  // Function to get total number of elements for a section
  const getTotalElements = (title: string): number => {
    const sectionKey = title.toLowerCase();
    if (reportStructures[sectionKey]) {
      return Object.keys(reportStructures[sectionKey].schema.shape).length;
    }
    // Fallback for any sections not defined in reportStructures
    return Object.keys(mergedData).length;
  };

  // Calculate progress
  const totalElements = getTotalElements(title);
  const filledElements = countFilledElements(mergedData);
  const progressPercentage = Math.round((filledElements / totalElements) * 100);

  // This function decides how to display the content based on the section
  const renderContent = () => {
    if (title.toLowerCase() === 'articulation') {
      // For articulation, we only want to show the summary paragraph
      if (mergedData && mergedData.summaryParagraph) {
        return (
          <div className="font-normal text-gray-700 dark:text-gray-300">
            <h3 className="text-lg font-semibold mb-2">Articulation Summary</h3>
            <p>{mergedData.summaryParagraph}</p>
          </div>
        );
      } else {
        return <p>No summary available for the articulation assessment.</p>;
      }
    } else if (title === "Header") {
      // For the header, we display a table with all the information
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <colgroup>
            <col className="w-1/4" /> {/* First column */}
            <col className="w-1/4" /> {/* Second column */}
            <col className="w-1/4" /> {/* Third column */}
            <col className="w-1/4" /> {/* Fourth column */}
          </colgroup>
            <tbody>
              {(() => {
                const entries = Object.entries(mergedData);
                const rows = [];
                for (let i = 0; i < entries.length; i += 2) {
                  const [key1, value1] = entries[i];
                  const [key2, value2] = entries[i + 1] || [null, null];
                  rows.push(
                    <tr key={i} className="bg-white dark:bg-gray-800">
                      {/* First key-value pair */}
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap border-b border-gray-200 dark:border-gray-600">
                        {key1}:
                      </td>
                      <td
                        className={`px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 ${
                          !value1 || value1 === "Not provided" ? 'missing-data' : ''
                        }`}
                      >
                        {typeof value1 === 'object' ? (
                          <div className="bg-diagonal-lines h-5 w-full"></div>
                        ) : (
                          value1 && value1 !== "Not provided" ? (
                            String(value1)
                          ) : (
                            <div className="bg-diagonal-lines h-5 w-full"></div>
                          )
                        )}
                      </td>
  
                      {/* Second key-value pair (if it exists) */}
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
                            {typeof value2 === 'object' ? (
                              <div className="bg-diagonal-lines h-5 w-full"></div>
                            ) : (
                              value2 && value2 !== "Not provided" ? (
                                String(value2)
                              ) : (
                                <div className="bg-diagonal-lines h-5 w-full"></div>
                              )
                            )}
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
      );
    } else {
      // For all other sections, we display the raw data as a formatted string
      return (
        <p className="font-normal text-gray-700 dark:text-gray-300">
          {typeof mergedData === 'object' ? JSON.stringify(mergedData, null, 2) : mergedData}
        </p>
      );
    }
  };

  // This is what the output card looks like
  return (
    <Card className="p-4 text-md w-full border-dotted border-2 border-gray-400">
      <h5 className="text-xl text-center font-thin tracking-tight text-gray-900 dark:text-white mb-4">
        {title}
      </h5>
      {mergedData ? renderContent() : (
        <div className="font-normal text-gray-700 dark:text-gray-300">
          <p>{description}</p>
        </div>
      )}
      <hr className="my-4"/>
      <div className="mt-4">
        <Progress progress={progressPercentage} size="lg" color="blue" />
        <p className="text-sm text-gray-500 mb-2">Completion: {filledElements}/{totalElements}</p>
      </div>
    </Card>
  );
};