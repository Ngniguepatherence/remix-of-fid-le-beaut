import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Building2, Calendar, CreditCard, CheckCircle, XCircle, RefreshCw, LogOut, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getSalonAccounts, createSalonAccount, renewSalonSubscription, toggleSalonActive, isSalonSubscriptionActive } from '@/lib/auth';
import { SalonAccount } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { StatCard } from '@/components/dashboard/StatCard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', { style: 'decimal', minimumFractionDigits: 0 }).format(amount) + ' FCFA';
}

function daysRemaining(salon: SalonAccount): number {
  const expiry = new Date(salon.dernierPaiement);
  expiry.setDate(expiry.getDate() + salon.joursAbonnement);
  const diff = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [salons, setSalons] = useState<SalonAccount[]>(getSalonAccounts);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [nom, setNom] = useState('');
  const [proprietaire, setProprietaire] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const refresh = () => setSalons(getSalonAccounts());

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (salons.find(s => s.email === email)) {
      toast({ title: 'Cet email est déjà utilisé', variant: 'destructive' });
      return;
    }
    createSalonAccount({
      nom, proprietaire, telephone, adresse, email, motDePasse,
      dernierPaiement: new Date().toISOString().split('T')[0],
    });
    toast({ title: 'Salon créé avec succès', description: `${nom} peut maintenant se connecter.` });
    setNom(''); setProprietaire(''); setTelephone(''); setAdresse(''); setEmail(''); setMotDePasse('');
    setDialogOpen(false);
    refresh();
  };

  const handleRenew = (id: string) => {
    renewSalonSubscription(id);
    toast({ title: 'Abonnement renouvelé pour 30 jours' });
    refresh();
  };

  const handleToggle = (id: string, active: boolean) => {
    toggleSalonActive(id, active);
    toast({ title: active ? 'Salon activé' : 'Salon désactivé' });
    refresh();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const activeSalons = salons.filter(s => isSalonSubscriptionActive(s));
  const revenuMensuel = activeSalons.length * 25000;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <Shield className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">LeaderBright Admin</h1>
              <p className="text-xs text-muted-foreground">Gestion des salons</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Salons" value={salons.length} icon={Building2} variant="primary" />
          <StatCard title="Salons Actifs" value={activeSalons.length} icon={CheckCircle} variant="success" />
          <StatCard title="Salons Expirés" value={salons.length - activeSalons.length} icon={XCircle} variant="warning" />
          <StatCard title="Revenu Mensuel" value={formatCurrency(revenuMensuel)} icon={TrendingUp} variant="accent" />
        </div>

        {/* Salon list */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Salons enregistrés
              </CardTitle>
              <CardDescription>{salons.length} salon(s)</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau salon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau salon</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div className="space-y-1">
                    <Label>Nom du salon</Label>
                    <Input value={nom} onChange={e => setNom(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Propriétaire</Label>
                    <Input value={proprietaire} onChange={e => setProprietaire(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Téléphone</Label>
                      <Input value={telephone} onChange={e => setTelephone(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <Label>Adresse</Label>
                      <Input value={adresse} onChange={e => setAdresse(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Email de connexion</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required minLength={4} />
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                    💰 Abonnement : <strong>25 000 FCFA/mois</strong> — Activé automatiquement pour 30 jours
                  </div>
                  <Button type="submit" className="w-full gradient-primary">Créer le salon</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {salons.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun salon enregistré</p>
                <p className="text-sm text-muted-foreground">Créez votre premier salon pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {salons.map(salon => {
                  const active = isSalonSubscriptionActive(salon);
                  const days = daysRemaining(salon);
                  return (
                    <div key={salon.id} className={`p-4 rounded-xl border ${active ? 'border-border bg-card' : 'border-destructive/30 bg-destructive/5'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                            <Building2 className={`h-5 w-5 ${active ? 'text-primary' : 'text-destructive'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{salon.nom}</h3>
                            <p className="text-sm text-muted-foreground">{salon.proprietaire} · {salon.telephone}</p>
                            <p className="text-xs text-muted-foreground">{salon.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={active ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}>
                            {active ? `${days}j restants` : 'Expiré'}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleRenew(salon.id)}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Renouveler
                          </Button>
                          <Button size="sm" variant={active ? 'destructive' : 'default'} onClick={() => handleToggle(salon.id, !active)}>
                            {active ? 'Désactiver' : 'Activer'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
