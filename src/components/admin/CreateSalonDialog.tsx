import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createSalonAccount } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEmails: string[];
  onCreated: () => void;
}

export default function CreateSalonDialog({ open, onOpenChange, existingEmails, onCreated }: Props) {
  const [nom, setNom] = useState('');
  const [proprietaire, setProprietaire] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const resetForm = () => {
    setNom(''); setProprietaire(''); setTelephone(''); setAdresse(''); setEmail(''); setMotDePasse('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingEmails.includes(email)) {
      toast({ title: 'Cet email est déjà utilisé', variant: 'destructive' });
      return;
    }
    createSalonAccount({
      nom, proprietaire, telephone, adresse, email, motDePasse,
      dernierPaiement: new Date().toISOString().split('T')[0],
    });
    toast({ title: 'Salon créé avec succès', description: `${nom} peut maintenant se connecter.` });
    resetForm();
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gradient-primary w-full sm:w-auto" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau salon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Créer un nouveau salon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm">Nom du salon</Label>
            <Input value={nom} onChange={e => setNom(e.target.value)} required className="h-10 text-base sm:text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Propriétaire</Label>
            <Input value={proprietaire} onChange={e => setProprietaire(e.target.value)} required className="h-10 text-base sm:text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Téléphone</Label>
              <Input value={telephone} onChange={e => setTelephone(e.target.value)} required className="h-10 text-base sm:text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Adresse</Label>
              <Input value={adresse} onChange={e => setAdresse(e.target.value)} className="h-10 text-base sm:text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Email de connexion</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-10 text-base sm:text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Mot de passe</Label>
            <Input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required minLength={4} className="h-10 text-base sm:text-sm" />
          </div>
          <div className="p-3 rounded-lg bg-muted text-xs sm:text-sm text-muted-foreground">
            💰 Abonnement : <strong>25 000 FCFA/mois</strong> — Activé automatiquement pour 30 jours
          </div>
          <Button type="submit" className="w-full gradient-primary h-11 sm:h-10">Créer le salon</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
