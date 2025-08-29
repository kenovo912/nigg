import React from 'react';

interface ComingSoonToolProps {
  toolName: string;
  // Fix: The type for the `icon` prop was not specific enough for TypeScript to know that `className` is a valid prop for the element.
  // By changing `React.ReactElement` to `React.ReactElement<{ className?: string }>`, we provide the necessary type information to `React.cloneElement`.
  icon: React.ReactElement<{ className?: string }>;
}

const ComingSoonTool: React.FC<ComingSoonToolProps> = ({ toolName, icon }) => {
  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{toolName}</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          This tool is currently under development.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-indigo-500 mb-4">
            {React.cloneElement(icon, { className: 'h-16 w-16' })}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Coming Soon!</h3>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          We're working hard to bring you the best {toolName.toLowerCase()} experience.
          <br />
          Check back soon for updates!
        </p>
      </div>
    </div>
  );
};

export default ComingSoonTool;
