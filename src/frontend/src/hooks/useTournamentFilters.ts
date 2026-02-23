import { useState, useMemo } from 'react';
import { Tournament } from './useQueries';

export function useTournamentFilters(tournaments: Tournament[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [prizeMin, setPrizeMin] = useState('');
  const [prizeMax, setPrizeMax] = useState('');
  const [selectedFeeBrackets, setSelectedFeeBrackets] = useState<string[]>([]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tournament.mode.toLowerCase().includes(query) ||
          tournament.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Prize pool filter
      if (prizeMin && tournament.prizePool < parseInt(prizeMin)) return false;
      if (prizeMax && tournament.prizePool > parseInt(prizeMax)) return false;

      // Entry fee bracket filter
      if (selectedFeeBrackets.length > 0) {
        const matchesBracket = selectedFeeBrackets.some((bracket) => {
          if (bracket === 'free') return tournament.entryFee === 0;
          if (bracket === '0-50') return tournament.entryFee > 0 && tournament.entryFee <= 50;
          if (bracket === '50-100') return tournament.entryFee > 50 && tournament.entryFee <= 100;
          if (bracket === '100+') return tournament.entryFee > 100;
          return false;
        });
        if (!matchesBracket) return false;
      }

      return true;
    });
  }, [tournaments, searchQuery, prizeMin, prizeMax, selectedFeeBrackets]);

  const toggleFeeBracket = (bracket: string) => {
    setSelectedFeeBrackets((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPrizeMin('');
    setPrizeMax('');
    setSelectedFeeBrackets([]);
  };

  return {
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
  };
}
