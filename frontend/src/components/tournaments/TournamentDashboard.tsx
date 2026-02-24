import { useState } from 'react';
import { useGetFeaturedTournaments, useGetPracticeMatches } from '../../hooks/useQueries';
import { useListTournaments } from '../../hooks/useTournamentQueries';
import { useTournamentFilters } from '../../hooks/useTournamentFilters';
import BackendTournamentCard from './BackendTournamentCard';
import TournamentFilters from './TournamentFilters';
import FeaturedTournamentsSection from './FeaturedTournamentsSection';
import PracticeModeSection from './PracticeModeSection';
import SponsorBanner from '../sponsor/SponsorBanner';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import PageTransition from '../common/PageTransition';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, SlidersHorizontal, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import type { Tournament } from '../../backend';

type GameMode = 'All' | 'Solo' | 'Duo' | 'Squad' | 'Practice';

export default function TournamentDashboard() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('All');
  const [showFilters, setShowFilters] = useState(false);

  const { data: featuredTournaments, isLoading: featuredLoading } = useGetFeaturedTournaments();
  const { data: practiceMatches, isLoading: practiceLoading } = useGetPracticeMatches();
  const { data: allTournaments, isLoading: tournamentsLoading } = useListTournaments();

  const regularTournaments: Tournament[] = (allTournaments ?? []);
  const modeFilteredTournaments = selectedMode === 'All'
    ? regularTournaments
    : regularTournaments.filter(t => t.gameType === selectedMode);

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
    <PageTransition>
      <div className="space-y-8">
        {/* Sponsor Banner */}
        <SponsorBanner className="animate-in slide-in-from-top duration-500" />

        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden animate-in fade-in duration-700">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Tournament Banner"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent flex items-center">
            <div className="px-8 max-w-2xl">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 mb-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
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

        {/* Featured Tournaments */}
        {featuredLoading ? (
          <SkeletonLoader type="grid" count={3} />
        ) : featuredTournaments && featuredTournaments.length > 0 ? (
          <FeaturedTournamentsSection tournaments={featuredTournaments} />
        ) : null}

        {/* Filter Tabs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Upcoming Tournaments</h2>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-cyan-500/30 hover:bg-cyan-500/10 min-h-[44px]"
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
            <TabsList className="bg-gray-800 border border-cyan-500/30 w-full md:w-auto">
              <TabsTrigger value="All" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 min-h-[44px] px-6">
                All Modes
              </TabsTrigger>
              <TabsTrigger value="Solo" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 min-h-[44px] px-6">
                Solo
              </TabsTrigger>
              <TabsTrigger value="Duo" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 min-h-[44px] px-6">
                Duo
              </TabsTrigger>
              <TabsTrigger value="Squad" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 min-h-[44px] px-6">
                Squad
              </TabsTrigger>
              <TabsTrigger value="Practice" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 min-h-[44px] px-6">
                Practice
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedMode} className="mt-6">
              {selectedMode === 'Practice' ? (
                practiceLoading ? (
                  <SkeletonLoader type="grid" count={3} />
                ) : practiceMatches && practiceMatches.length > 0 ? (
                  <PracticeModeSection matches={practiceMatches} />
                ) : (
                  <EmptyState
                    icon={Trophy}
                    title="No Practice Matches Available"
                    description="Check back later for practice matches to hone your skills."
                  />
                )
              ) : tournamentsLoading ? (
                <SkeletonLoader type="grid" count={6} />
              ) : filteredTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTournaments.map((tournament) => (
                    <BackendTournamentCard key={tournament.id.toString()} tournament={tournament} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Trophy}
                  title="No Tournaments Found"
                  description={
                    allTournaments && allTournaments.length === 0
                      ? 'No tournaments have been created yet. Check back soon!'
                      : 'Try adjusting your filters or check back later for new tournaments.'
                  }
                  action={
                    allTournaments && allTournaments.length > 0
                      ? { label: 'Clear Filters', onClick: clearFilters }
                      : undefined
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
