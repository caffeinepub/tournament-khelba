import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TournamentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  prizeMin: string;
  prizeMax: string;
  onPrizeMinChange: (value: string) => void;
  onPrizeMaxChange: (value: string) => void;
  selectedFeeBrackets: string[];
  onFeeBracketToggle: (bracket: string) => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

const FEE_BRACKETS = [
  { label: 'Free', value: 'free' },
  { label: '0-50 BDT', value: '0-50' },
  { label: '50-100 BDT', value: '50-100' },
  { label: '100+ BDT', value: '100+' },
];

export default function TournamentFilters({
  searchQuery,
  onSearchChange,
  prizeMin,
  prizeMax,
  onPrizeMinChange,
  onPrizeMaxChange,
  selectedFeeBrackets,
  onFeeBracketToggle,
  onClearFilters,
  filteredCount,
  totalCount,
}: TournamentFiltersProps) {
  return (
    <div className="bg-gray-900/80 border-2 border-cyan-500/30 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Filter Tournaments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div>
        <Label className="text-gray-300 mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tournaments..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Prize Pool Range */}
      <div>
        <Label className="text-gray-300 mb-2 block">Prize Pool Range (BDT)</Label>
        <div className="flex gap-3">
          <Input
            type="number"
            value={prizeMin}
            onChange={(e) => onPrizeMinChange(e.target.value)}
            placeholder="Min"
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Input
            type="number"
            value={prizeMax}
            onChange={(e) => onPrizeMaxChange(e.target.value)}
            placeholder="Max"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Entry Fee Brackets */}
      <div>
        <Label className="text-gray-300 mb-2 block">Entry Fee</Label>
        <div className="flex flex-wrap gap-2">
          {FEE_BRACKETS.map((bracket) => (
            <Badge
              key={bracket.value}
              onClick={() => onFeeBracketToggle(bracket.value)}
              className={`cursor-pointer transition-all ${
                selectedFeeBrackets.includes(bracket.value)
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {bracket.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          Showing <span className="text-cyan-400 font-bold">{filteredCount}</span> of{' '}
          <span className="text-white font-bold">{totalCount}</span> tournaments
        </p>
      </div>
    </div>
  );
}
