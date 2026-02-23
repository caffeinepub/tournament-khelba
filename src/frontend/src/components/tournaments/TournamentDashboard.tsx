import { useState } from 'react';
import { MOCK_TOURNAMENTS, useGetFeaturedTournaments, useGetPracticeMatches } from '../../hooks/useQueries';
import { useTournamentFilters } from '../../hooks/useTournamentFilters';
import TournamentCard from './TournamentCard';
import TournamentFilters from './TournamentFilters';
import FeaturedTournamentsSection from './FeaturedTournamentsSection';
import PracticeModeSection from './PracticeModeSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type GameMode = 'All' | 'Solo' | 'Duo' | 'Squad' | 'Practice';

export default function TournamentDashboard() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('All');
  const [showFilters, setShowFilters] = useState(false);
  const { data: featuredTournaments } = useGetFeaturedTournaments();
  const { data: practiceMatches } = useGetPracticeMatches();

  const regularTournaments = MOCK_TOURNAMENTS.filter(t => !t.isFeatured && !t.isPractice);
  const modeFilteredTournaments = selectedMode === 'All' 
    ? regularTournaments 
    : regularTournaments.filter(t => t.mode === selectedMode);

  const {
    searchQuery,
    setSearchQuery,
    prizeMin,
    setPrizeMin,
    prizeMax,
    setPrizeMax,
    selectedFeeBrackets,
    toggleFeeBracket,
    clearFilters,
    filteredTournaments,
  } = useTournamentFilters(modeFilteredTournaments);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src="/assets/generated/hero-banner.dim_1200x400.png" 
          alt="Tournament Banner" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent flex items-center">
          <div className="px-8 max-w-2xl">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 mb-4">
              TOURNAMENT KHELBA
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Compete. Win. Dominate.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Presented by</span>
              <img 
                src="/assets/generated/code11-logo.dim_200x60.png" 
                alt="Code 11" 
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backend Status Alert */}
      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Backend tournament management is not yet implemented. 
          The tournaments shown below are sample data to demonstrate the UI design.
        </AlertDescription>
      </Alert>

      {/* Featured Tournaments */}
      {featuredTournaments && featuredTournaments.length > 0 && (
        <FeaturedTournamentsSection tournaments={featuredTournaments} />
      )}

      {/* Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Upcoming Tournaments</h2>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-cyan-500/30 hover:bg-cyan-500/10"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent className="mb-6">
            <TournamentFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              prizeMin={prizeMin}
              prizeMax={prizeMax}
              onPrizeMinChange={setPrizeMin}
              onPrizeMaxChange={setPrizeMax}
              selectedFeeBrackets={selectedFeeBrackets}
              onFeeBracketToggle={toggleFeeBracket}
              onClearFilters={clearFilters}
              filteredCount={filteredTournaments.length}
              totalCount={modeFilteredTournaments.length}
            />
          </CollapsibleContent>
        </Collapsible>

        <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as GameMode)}>
          <TabsList className="bg-gray-800 border border-cyan-500/30">
            <TabsTrigger value="All" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
              All Modes
            </TabsTrigger>
            <TabsTrigger value="Solo" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
              Solo
            </TabsTrigger>
            <TabsTrigger value="Duo" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
              Duo
            </TabsTrigger>
            <TabsTrigger value="Squad" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
              Squad
            </TabsTrigger>
            <TabsTrigger value="Practice" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
              Practice
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMode} className="mt-6">
            {selectedMode === 'Practice' ? (
              <PracticeModeSection matches={practiceMatches || []} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
                {filteredTournaments.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">No tournaments match your filters</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
