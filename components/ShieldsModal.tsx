import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShieldsModalProps {
  onInsert: (data: {
    label: string;
    logo: string;
    logoColor: string;
    href: string;
  }) => void;
}

export const ShieldsModal = ({ onInsert }: ShieldsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    logo: '',
    logoColor: 'white',
    href: ''
  });

  const handleInsert = () => {
    onInsert({
      label: formData.label,
      logo: formData.logo,
      logoColor: formData.logoColor,
      href: formData.href
    });
    setIsOpen(false);
    setFormData({ label: '', logo: '', logoColor: 'white', href: '' });
  };

  const previewUrl = `https://img.shields.io/badge/${
    encodeURIComponent(formData.label || 'label')
  }-informational?logo=${formData.logo || 'logo'}&logoColor=${
    formData.logoColor || 'white'
  }`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tech Badge</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Form fields remain the same as previous version */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={e => setFormData({...formData, label: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              Logo
            </Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={e => setFormData({...formData, logo: e.target.value})}
              className="col-span-3"
              placeholder="npm, docker, python, etc."
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoColor" className="text-right">
              Logo Color
            </Label>
            <Input
              id="logoColor"
              value={formData.logoColor}
              onChange={e => setFormData({...formData, logoColor: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="href" className="text-right">
              Custom Link
            </Label>
            <Input
              id="href"
              value={formData.href}
              onChange={e => setFormData({...formData, href: e.target.value})}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          
          <div className="mt-4">
            <Label>Preview:</Label>
            <img 
              src={previewUrl} 
              alt="Preview badge" 
              className="mt-2 max-w-full h-auto"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleInsert}>Insert Image</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};