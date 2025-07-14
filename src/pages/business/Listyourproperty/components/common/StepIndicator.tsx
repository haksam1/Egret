import React from 'react';

interface Workflow {
  name: string;
  steps: number;
  color: string;
}

interface StepIndicatorProps {
  workflows: Workflow[];
  currentWorkflow: number;
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  workflows,
  currentWorkflow,
  currentStep
}) => {
  const getTotalStepsCompleted = () => {
    let total = 0;
    for (let i = 0; i < currentWorkflow; i++) {
      total += workflows[i].steps;
    }
    return total + currentStep;
  };

  const getTotalSteps = () => {
    return workflows.reduce((sum, workflow) => sum + workflow.steps, 0);
  };

  const progressPercentage = (getTotalStepsCompleted() / getTotalSteps()) * 100;

  return (
    <div className="bg-white/90 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-700">List Your Property</h1>
        <div className="text-sm text-gray-600">
          Step {getTotalStepsCompleted() + 1} of {getTotalSteps()}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Current Workflow */}
      <div className="mb-4">
        {workflows && workflows[currentWorkflow] ? (
          <>
            <h2 className={`text-lg font-semibold ${workflows[currentWorkflow].color} mb-2`}>
              {workflows[currentWorkflow].name}
            </h2>
            <div className="flex items-center gap-2">
              {Array.from({ length: workflows[currentWorkflow].steps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-green-400 to-teal-400' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Unknown Step</h2>
        )}
      </div>

      {/* Workflow Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {workflows && workflows.length > 0 ? (
          workflows.map((workflow, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded-lg text-center transition-all duration-300 ${
                index === currentWorkflow
                  ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white'
                  : index < currentWorkflow
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {workflow.name}
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center text-gray-400">No steps defined</div>
        )}
      </div>
    </div>
  );
};
