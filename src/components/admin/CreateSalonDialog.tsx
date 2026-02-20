import React, { useState } from 'react';
import { Plus, UserPlus, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { createSalonAccount, addStaffToSalon } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

interface StaffEntry {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
}

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
  const [staffList, setStaffList] = useState<StaffEntry[]>([]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffNom, setStaffNom] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPwd, setStaffPwd] = useState('');
  const [staffTel, setStaffTel] = useState('');

  const resetForm = () => {
    setNom(''); setProprietaire(''); setTelephone(''); setAdresse(''); setEmail(''); setMotDePasse('');
    setStaffList([]); setShowStaffForm(false);
    setStaffNom(''); setStaffEmail(''); setStaffPwd(''); setStaffTel('');
  };

  const addStaff = () => {
    if (!staffNom || !staffEmail || !staffPwd) return;
    if (staffEmail === email || staffList.some(s => s.email === staffEmail) || existingEmails.includes(staffEmail)) {
      toast({ title: 'Cet email est déjà utilisé', variant: 'destructive' });
      return;
    }
    setStaffList([...staffList, { nom: staffNom, email: staffEmail, motDePasse: staffPwd, telephone: staffTel }]);
    setStaffNom(''); setStaffEmail(''); setStaffPwd(''); setStaffTel('');
    setShowStaffForm(false);
  };

  const removeStaff = (index: number) => {
    setStaffList(staffList.filter((_, i) => i !== index));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingEmails.includes(email)) {
      toast({ title: 'Cet email est déjà utilisé', variant: 'destructive' });
      return;
    }
    const salon = createSalonAccount({
      nom, proprietaire, telephone, adresse, email, motDePasse,
      dernierPaiement: new Date().toISOString().split('T')[0],
    });

    // Add staff members
    if (staffList.length > 0) {
      staffList.forEach(staff => {
        addStaffToSalon(salon.id, staff);
      });
    }

    toast({ title: 'Salon créé avec succès', description: `${nom} — ${1 + staffList.length} utilisateur(s) créé(s).` });
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
      <DialogContent className="max-w-[95vw] sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Créer un nouveau salon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-3">
          {/* Salon info */}
          <div className="space-y-1">
            <Label className="text-sm">Nom du salon</Label>
            <Input value={nom} onChange={e => setNom(e.target.value)} required className="h-10 text-base sm:text-sm" />
          </div>

          {/* Owner section */}
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Users className="h-4 w-4" />
              Propriétaire (Owner)
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Nom du propriétaire</Label>
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
          </div>

          {/* Staff section */}
          <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                <UserPlus className="h-4 w-4" />
                Staff ({staffList.length})
              </div>
              {!showStaffForm && (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowStaffForm(true)} className="text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>

            {/* Staff list */}
            {staffList.map((staff, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md bg-background border text-sm">
                <div>
                  <span className="font-medium">{staff.nom}</span>
                  <span className="text-muted-foreground ml-2 text-xs">{staff.email}</span>
                  <Badge variant="secondary" className="ml-2 text-[10px]">Staff</Badge>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeStaff(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}

            {/* Add staff form */}
            {showStaffForm && (
              <div className="space-y-2 p-2 rounded-md bg-background border">
                <Input placeholder="Nom du staff" value={staffNom} onChange={e => setStaffNom(e.target.value)} className="h-9 text-sm" />
                <Input placeholder="Email" type="email" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} className="h-9 text-sm" />
                <Input placeholder="Mot de passe" type="password" value={staffPwd} onChange={e => setStaffPwd(e.target.value)} className="h-9 text-sm" />
                <Input placeholder="Téléphone (optionnel)" value={staffTel} onChange={e => setStaffTel(e.target.value)} className="h-9 text-sm" />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addStaff} className="text-xs h-8 gradient-primary">Ajouter</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowStaffForm(false)} className="text-xs h-8">Annuler</Button>
                </div>
              </div>
            )}
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
