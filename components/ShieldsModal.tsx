import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HexColorPicker } from 'react-colorful';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield } from 'lucide-react';
import { LogoCombobox } from './LogoCombobox';
import { LogoOption } from '@/types/LogoType';
import Link from 'next/link';

interface ShieldsModalProps {
  onInsert: (data: {
    label: string;
    logo: string;
    href: string;
    style: string;
    styleColor: string;
  }) => void;
}

export const ShieldsModal = ({ onInsert }: ShieldsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    logo: '',
    href: '',
    style: 'flat',
    styleColor: '#4D4D4D'
  });
  const [selectedLogo, setSelectedLogo] = useState<LogoOption | null>(null);

  const handleLogoChange = (logo: LogoOption) => {
    setFormData({ ...formData, logo: logo.logo_slug, label: logo.logo_name });
    setSelectedLogo(logo)
  }

  const handleInsert = () => {
    onInsert(formData);
    setIsOpen(false);
    setFormData({ 
      label: '', 
      logo: '', 
      href: '',
      style: 'flat',
      styleColor: '#4D4D4D'
    });
    setShowStyleOptions(false);
  };

  const previewUrl = `https://img.shields.io/badge/${
    encodeURIComponent(formData.label || 'label')
  }-${formData.styleColor.replace('#', '')}?style=${formData.style}&logo=${
    formData.logo || 'logo'
  }`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button className='p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Add Tech Badge
        </Button> */}
        <button
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2`}
          title="Heading 4"
        >
          <Shield className="w-4 h-4" />
          Add Tech Badge
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tech Badge</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              Logo
            </Label>
            <div className='w-full col-span-3'>
              <LogoCombobox value={selectedLogo} onChange={handleLogoChange} />
            </div>
          </div>

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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style" className="text-right">
              Badge Style
            </Label>
            <Select defaultValue={formData.style} onValueChange={value => setFormData({...formData, style: value})}>
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="flat-square">Flat Square</SelectItem>
                <SelectItem value="for-the-badge">For The Badge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="styleColor" className="text-right">
              Style Color
            </Label>
            <div className="col-span-3 flex gap-2 flex-col">
              <HexColorPicker
                color={formData.styleColor}
                onChange={(color: string) => setFormData({...formData, styleColor: color})}
                className="w-full h-32"
              />
              <Input
                id="styleColor"
                value={formData.styleColor}
                onChange={e => setFormData({...formData, styleColor: e.target.value})}
                className="w-full"
              />
            </div>
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
        
        <div className="flex justify-end gap-2 mb-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={(handleInsert)}>Insert Image</Button>
        </div>

        <div className='text-center text-xs'>
          Powered by 
          <Link href="https://shields.io/" target="_blank" rel="noopener noreferrer" className='font-bold'> shields.io</Link> 
        </div>
      </DialogContent>
    </Dialog>
  );
};