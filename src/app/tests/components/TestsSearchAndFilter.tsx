import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterDifficulty, FilterStatus, FilterType } from '../hooks/useTestFilters';

interface TestsSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  activeFiltersCount: number;
  clearAllFilters: () => void;
  selectedType: FilterType;
  setSelectedType: (value: FilterType) => void;
  selectedDifficulty: FilterDifficulty;
  setSelectedDifficulty: (value: FilterDifficulty) => void;
  selectedStatus: FilterStatus;
  setSelectedStatus: (value: FilterStatus) => void;
}

interface FilterGroupProps<T extends string> {
  options: readonly T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  getLabel: (value: T) => string;
}

function FilterGroup<T extends string>({ 
  options, 
  selectedValue, 
  onSelect, 
  getLabel 
}: FilterGroupProps<T>) {
  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <Badge
          key={option}
          variant={selectedValue === option ? 'primary' : 'secondary'}
          className="cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => onSelect(option)}
        >
          {getLabel(option)}
        </Badge>
      ))}
    </div>
  );
}

export function TestsSearchAndFilter({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFiltersCount,
  clearAllFilters,
  selectedType,
  setSelectedType,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus
}: TestsSearchAndFilterProps) {
  return (
    <>
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          type="search"
          placeholder="Search tests, descriptions, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          className="flex-1"
        />
        
        <div className="flex items-center gap-3">
          <Button
            variant={showAdvancedFilters ? "primary" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="whitespace-nowrap"
          >
             <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2 bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
               <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
        </div>
        
        {/* Test Type */}
        <FilterGroup
          options={['all', 'static', 'dynamic'] as const}
          selectedValue={selectedType}
          onSelect={setSelectedType}
          getLabel={(type) => type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
        />

        {/* Difficulty */}
        <FilterGroup
          options={['all', 'beginner', 'intermediate', 'advanced'] as const}
          selectedValue={selectedDifficulty}
          onSelect={setSelectedDifficulty}
          getLabel={(difficulty) => difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        />

        {/* Status */}
        <FilterGroup
          options={['all', 'active', 'inactive'] as const}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
          getLabel={(status) => status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
        />
      </div>
    </>
  );
}
