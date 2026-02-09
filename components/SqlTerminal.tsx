import React from 'react';
import { TerminalIcon, DatabaseIcon } from './Icons';

interface Props {
  query: string | null;
  latency?: number;
}

const SqlTerminal: React.FC<Props> = ({ query, latency }) => {
  if (!query) return null;

  return (
    <div className="w-full bg-black rounded-lg border border-gray-800 font-mono text-sm shadow-xl overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 font-medium">Database Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-green-500 text-xs uppercase">Connected</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-3 text-green-400">
          <span className="text-gray-500 select-none">{'>'}</span>
          <span className="break-all">{query}</span>
        </div>
        {latency && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
             <DatabaseIcon className="w-3 h-3 mr-1" />
             Query executed in {latency}ms
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlTerminal;
