import React from 'react';

function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Card 1</h2>
            <div className="bg-blue-500 text-white p-4 rounded-lg">Blue Card</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Card 2</h2>
            <div className="bg-green-500 text-white p-4 rounded-lg">Green Card</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Card 3</h2>
            <div className="bg-purple-500 text-white p-4 rounded-lg">Purple Card</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">If you can see colors above, Tailwind is working!</h2>
          <p className="text-gray-600">All cards should have different background colors (blue, green, purple).</p>
        </div>
      </div>
    </div>
  );
}

export default TestTailwind;
