import React, { useState } from 'react';
import { Send, Users, Star, Clock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/useClients';
import { useSalon } from '@/hooks/useSalon';
import { toast } from '@/hooks/use-toast';
import { Client } from '@/types';

export default function Campagnes() {
  const { clients, getInactiveClients } = useClients();
  const { salon } = useSalon();
  const [message, setMessage] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const clientesInactives = getInactiveClients(salon.joursRappelInactivite);
  const clientesVIP = clients.filter(c => c.statut === 'vip');
  const clientesNouvelles = clients.filter(c => c.statut === 'nouvelle');

  const groups = [
    { id: 'all', label: 'Toutes les clientes', icon: Users, count: clients.length },
    { id: 'vip', label: 'Clientes VIP', icon: Star, count: clientesVIP.length },
    { id: 'inactives', label: 'Clientes inactives', icon: Clock, count: clientesInactives.length },
    { id: 'nouvelles', label: 'Nouvelles clientes', icon: UserPlus, count: clientesNouvelles.length },
  ];

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  const getSelectedClients = (): Client[] => {
    const clientSet = new Set<string>();
    
    selectedGroups.forEach(group => {
      let groupClients: Client[] = [];
      switch (group) {
        case 'all':
          groupClients = clients;
          break;
        case 'vip':
          groupClients = clientesVIP;
          break;
        case 'inactives':
          groupClients = clientesInactives;
          break;
        case 'nouvelles':
          groupClients = clientesNouvelles;
          break;
      }
      groupClients.forEach(c => clientSet.add(c.id));
    });

    return clients.filter(c => clientSet.has(c.id));
  };

  const selectedClients = getSelectedClients();

  const handleSendCampaign = () => {
    if (selectedClients.length === 0) {
      toast({
        title: 'Aucune cliente sélectionnée',
        description: 'Veuillez sélectionner au moins un groupe',
        variant: 'destructive',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'Message vide',
        description: 'Veuillez écrire un message',
        variant: 'destructive',
      });
      return;
    }

    // Simuler l'envoi
    toast({
      title: 'Campagne lancée !',
      description: `${selectedClients.length} messages prêts à envoyer`,
    });

    // Ouvrir WhatsApp pour le premier client (simulation)
    const firstClient = selectedClients[0];
    const formattedMessage = message.replace('{nom}', firstClient.nom);
    const phone = firstClient.telephone.replace(/\s/g, '').replace('+', '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(formattedMessage)}`, '_blank');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Campagnes</h1>
        <p className="text-muted-foreground">Envoyez des messages groupés à vos clientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups selection */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Sélectionner les destinataires</CardTitle>
            <CardDescription>Choisissez un ou plusieurs groupes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.map((group) => {
              const Icon = group.icon;
              const isSelected = selectedGroups.includes(group.id);
              
              return (
                <div
                  key={group.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isSelected} />
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{group.label}</p>
                      <p className="text-sm text-muted-foreground">{group.count} clientes</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {selectedClients.length > 0 && (
              <div className="p-4 rounded-xl bg-primary/10 mt-4">
                <p className="font-medium text-primary">
                  {selectedClients.length} cliente(s) sélectionnée(s)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message composition */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Composer le message</CardTitle>
            <CardDescription>
              Utilisez {'{nom}'} pour personnaliser avec le prénom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Bonjour {nom} ! 👋

Nous avons une offre spéciale pour vous...

${salon.nom}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
            />

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessage(prev => prev + '{nom}')}
              >
                + Prénom
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessage(prev => prev + salon.nom)}
              >
                + Nom salon
              </Button>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full gradient-primary"
                size="lg"
                onClick={handleSendCampaign}
                disabled={selectedClients.length === 0 || !message.trim()}
              >
                <Send className="h-5 w-5 mr-2" />
                Lancer la campagne ({selectedClients.length})
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Les messages seront ouverts dans WhatsApp
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Modèles de messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Promotion',
                message: `🎉 Offre spéciale !

Bonjour {nom},

Profitez de -20% sur toutes nos prestations cette semaine !

Prenez rendez-vous vite ! 💇‍♀️

${salon.nom}`,
              },
              {
                title: 'Nouveauté',
                message: `✨ Nouveauté au salon !

Bonjour {nom},

Nous sommes ravis de vous annoncer l'arrivée de nouvelles prestations !

Venez découvrir nos nouveautés. 🌟

${salon.nom}`,
              },
              {
                title: 'Fêtes',
                message: `🎄 Joyeuses fêtes !

Chère {nom},

Toute l'équipe vous souhaite de merveilleuses fêtes de fin d'année !

À très bientôt au salon ! 💕

${salon.nom}`,
              },
            ].map((template) => (
              <div
                key={template.title}
                className="p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all"
                onClick={() => setMessage(template.message)}
              >
                <p className="font-medium mb-2">{template.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.message.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
