import React, { useState, ChangeEvent } from 'react';
import { Card, Textarea, Button, Label, TextInput, Datepicker, Progress } from 'flowbite-react';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { reportStructures } from '../../lib/reportStructures';
import { HeaderInfoType } from '../../lib/reportStructures/header';

interface CardProps {
  title: string;
  description: string;
}

export const InputCard: React.FC<CardProps & { onSubmit: (input: any) => void, existingData?: any }> = ({ 
  title, 
  description, 
  onSubmit, 
  existingData 
}) => (
  <Card className="p-4 text-md w-full">
    {/* Component body */}
    {(() => {
      const [input, setInput] = useState(existingData ? JSON.stringify(existingData, null, 2) : '');
      const [isLoading, setIsLoading] = useState(false);
      const [isIndividualFields, setIsIndividualFields] = useState(false);
      const [individualInputs, setIndividualInputs] = useState<HeaderInfoType>(existingData || {});

      const section = title.toLowerCase();
      const isHeaderSection = section === 'header';
      const sectionSchema = isHeaderSection ? reportStructures.header.schema : null;

      const headerFields = React.useMemo(() => {
        if (isHeaderSection && sectionSchema) {
          return Object.keys(sectionSchema.shape).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
            isDate: ['Birthday', 'DateOfEvaluation', 'DateOfReport'].includes(key),
          }));
        }
        return [];
      }, [isHeaderSection, sectionSchema]);

      const handleSubmit = async () => {
        setIsLoading(true);
        const submittedData = isIndividualFields ? individualInputs : input;
        console.log('Submitting for section:', section);
        await onSubmit(submittedData);
        setIsLoading(false);
      };

      const toggleInputMode = () => {
        if (isIndividualFields) {
          setInput(JSON.stringify(individualInputs, null, 2));
        } else {
          try {
            const parsedInput = JSON.parse(input);
            setIndividualInputs(parsedInput);
          } catch (error) {
            console.error('Failed to parse input as JSON');
          }
        }
        setIsIndividualFields(!isIndividualFields);
      };

      const handleDateChange = (date: Date | null, field: string) => {
        if (date) {
          setIndividualInputs({ ...individualInputs, [field]: date.toISOString().split('T')[0] });
        }
      };

      const renderIndividualFields = () => (
        <div className="grid grid-cols-2 gap-4">
          {/* Name - full width of column 1 */}
          <div className="col-span-1">
            <Label htmlFor={`${section}-name`} value="Name" />
            <TextInput
              id={`${section}-name`}
              value={individualInputs.Name || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>
      
          {/* Age and Birthday - split column 2 */}
          <div className="grid grid-cols-2 gap-4 col-span-1">
            <div>
              <Label htmlFor={`${section}-age`} value="Age" />
              <TextInput
                id={`${section}-age`}
                value={individualInputs.Age || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Age: e.target.value })}
                placeholder="Enter age"
                required
              />
            </div>
            <div>
              <Label htmlFor={`${section}-birthday`} value="Birthday" />
              <Datepicker
                id={`${section}-birthday`}
                value={individualInputs.Birthday || ''}
                onSelectedDateChanged={(date) => handleDateChange(date, 'Birthday')}
                placeholder="Select birthday"
                datepicker-autohider="true"
              />
            </div>
          </div>
      
          {/* Parents - full width of column 1, row 2 */}
          <div className="col-span-1">
            <Label htmlFor={`${section}-parents`} value="Parents" />
            <TextInput
              id={`${section}-parents`}
              value={individualInputs.Parents || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Parents: e.target.value })}
              placeholder="Enter parents' names"
              required
            />
          </div>
      
          {/* Grade and Eligibility - split column 2, row 2 */}
          <div className="grid grid-cols-2 gap-4 col-span-1">
            <div>
              <Label htmlFor={`${section}-grade`} value="Grade" />
              <TextInput
                id={`${section}-grade`}
                value={individualInputs.Grade || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Grade: e.target.value })}
                placeholder="Enter grade"
                required
              />
            </div>
            <div>
              <Label htmlFor={`${section}-eligibility`} value="Eligibility" />
              <TextInput
                id={`${section}-eligibility`}
                value={individualInputs.Eligibility || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Eligibility: e.target.value })}
                placeholder="Enter eligibility"
                required
              />
            </div>
          </div>
      
          {/* Additional fields */}
          <div>
            <Label htmlFor={`${section}-dateOfEvaluation`} value="Date of Evaluation" />
            <Datepicker
              id={`${section}-dateOfEvaluation`}
              value={individualInputs.DateOfEvaluation || ''}
              onSelectedDateChanged={(date) => handleDateChange(date, 'DateOfEvaluation')}
              placeholder="Select evaluation date"
              datepicker-autohider="true"
            />
          </div>
          <div>
            <Label htmlFor={`${section}-dateOfReport`} value="Date of Report" />
            <Datepicker
              id={`${section}-dateOfReport`}
              value={individualInputs.DateOfReport || ''}
              onSelectedDateChanged={(date) => handleDateChange(date, 'DateOfReport')}
              placeholder="Select report date"
              datepicker-autohider="true"
            />
          </div>
      
          <div className="col-span-2">
            <Label htmlFor={`${section}-evaluator`} value="Evaluator" />
            <TextInput
              id={`${section}-evaluator`}
              value={individualInputs.Evaluator || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIndividualInputs({ ...individualInputs, Evaluator: e.target.value })}
              placeholder="Enter evaluator"
              required
            />
          </div>
        </div>
      );
      
      

      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {title} Input
            </h5>
            {isHeaderSection && (
              <Button color="light" onClick={toggleInputMode}>
                <HiSwitchHorizontal className="mr-2 h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="mb-4">
            {isIndividualFields && isHeaderSection ? (
              renderIndividualFields()
            ) : (
              <Textarea
                id={`${section}-input`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()} information`}
                rows={4}
                required
              />
            )}
            <Button onClick={handleSubmit} color="blue" className="w-auto mt-2" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Submit'}
            </Button>
          </div>
        </>
      );
    })()}
  </Card>
);
  
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