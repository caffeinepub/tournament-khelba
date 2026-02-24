import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_TOURNAMENTS } from '../../hooks/useQueries';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ResultsUploadPanel() {
  const [selectedTournament, setSelectedTournament] = useState('');

  const handleUpload = () => {
    toast.info('Backend results upload not yet implemented');
  };

  return (
    <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white">Upload Tournament Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tournament" className="text-white">Select Tournament</Label>
          <Select value={selectedTournament} onValueChange={setSelectedTournament}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Choose tournament" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {MOCK_TOURNAMENTS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.mode} Tournament - {new Date(t.startTime).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Player Results (Top 5)</Label>
          {[1, 2, 3, 4, 5].map((rank) => (
            <div key={rank} className="grid grid-cols-3 gap-3">
              <Input
                placeholder={`Rank ${rank} - Player Name`}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                type="number"
                placeholder="Kills"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                type="number"
                placeholder="Prize (৳)"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Results
        </Button>
      </CardContent>
    </Card>
  );
}
