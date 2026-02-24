import { useState, useMemo } from 'react';
import type { Tournament } from '../backend';

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
          tournament.name.toLowerCase().includes(query) ||
          tournament.gameType.toLowerCase().includes(query) ||
          tournament.description.toLowerCase().includes(query) ||
          tournament.id.toString().includes(query);
        if (!matchesSearch) return false;
      }

      // Prize pool filter (backend stores as bigint)
      const prizePoolNum = Number(tournament.prizePool);
      if (prizeMin && prizePoolNum < parseInt(prizeMin)) return false;
      if (prizeMax && prizePoolNum > parseInt(prizeMax)) return false;

      // Entry fee bracket filter
      const entryFeeNum = Number(tournament.entryFee);
      if (selectedFeeBrackets.length > 0) {
        const matchesBracket = selectedFeeBrackets.some((bracket) => {
          if (bracket === 'free') return entryFeeNum === 0;
          if (bracket === '0-50') return entryFeeNum > 0 && entryFeeNum <= 50;
          if (bracket === '50-100') return entryFeeNum > 50 && entryFeeNum <= 100;
          if (bracket === '100+') return entryFeeNum > 100;
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
