import React, { useState } from 'react';
import { TestCard } from '../components/molecules/TestCard';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Search, Filter } from 'lucide-react';
import { mockTests, mockTestAttempts } from '../data/mockData';

interface TestsPageProps {
  onPageChange: (page: string) => void;
}

export const TestsPage: React.FC<TestsPageProps> = ({ onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'static' | 'dynamic'>('all');

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || test.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
          <p className="text-gray-600">Choose a test to start practicing</p>
        </div>
        <Button
          variant="primary"
          onClick={() => onPageChange('create-test')}
        >
          Create Test
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={setSearchTerm}
          icon={Search}
          className="flex-1 max-w-md"
        />
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">Type:</span>
          <div className="flex space-x-2">
            {(['all', 'static', 'dynamic'] as const).map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? 'primary' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            attemptCount={mockTestAttempts.filter(attempt => attempt.testId === test.id).length}
            onStart={() => onPageChange('take-test')}
          />
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};