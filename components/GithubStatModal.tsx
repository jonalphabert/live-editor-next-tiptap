import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const THEMES = [
  'default', 'dark', 'radical', 'merko', 'gruvbox',
  'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast'
];

export default function GithubStatsModal({ 
  onInsert
}: {
  onInsert: (username: string, theme: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('default');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (username.trim()) {
      onInsert(username, theme);
    }
    else {
      alert('Please enter a GitHub username.');
      return;
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add GitHub Stats</Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add GitHub Stats</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              GitHub Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              placeholder="your-github-username"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {username && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 border rounded-lg p-4">
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${username}&theme=${theme}&show_icons=true`}
                  alt={`Preview for ${username}`}
                  className="mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="text-xs text-muted-foreground w-full">
            Powered by{' '}
            <a 
              href="https://github.com/anuraghazra/github-readme-stats" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              GitHub Readme Stats
            </a>
          </div>
          <Button type="submit" onClick={handleSubmit}>
            Insert Stats
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}