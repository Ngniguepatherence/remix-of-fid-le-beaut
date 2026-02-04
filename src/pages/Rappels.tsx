import React, { useState, useMemo } from 'react';
import { Bell, MessageSquare, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClients } from '@/hooks/useClients';
import { useSalon } from '@/hooks/useSalon';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Rappels() {
  const { clients, getInactiveClients } = useClients();
  const { salon } = useSalon();

  const clientesInactives = getInactiveClients(salon.joursRappelInactivite);
  
  // Clientes avec anniversaire ce mois
  const clientesAnniversaire = clients.filter(c => {
    if (!c.dateAnniversaire) return false;
    const today = new Date();
    const anniv = new Date(c.dateAnniversaire);
    return anniv.getMonth() === today.getMonth();
  });

  const handleSendWhatsApp = (client: typeof clients[0], message: string) => {
    const formattedMessage = message
      .replace('{nom}', client.nom)
      .replace('{derniere_prestation}', client.derniereVisite 
        ? new Date(client.derniereVisite).toLocaleDateString('fr-FR') 
        : 'N/A'
      );
    
    const phone = client.telephone.replace(/\s/g, '').replace('+', '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(formattedMessage)}`, '_blank');
    
    toast({
      title: 'WhatsApp ouvert',
      description: `Message préparé pour ${client.nom}`,
    });
  };

  const messageInactivite = `Bonjour {nom} ! 💇‍♀️

Cela fait un moment que nous ne vous avons pas vue au salon. Vous nous manquez !

Votre dernière visite remonte au {derniere_prestation}. Nous serions ravis de vous revoir et de prendre soin de vous.

À très bientôt ! ✨
${salon.nom}`;

  const messageAnniversaire = `🎂 Joyeux anniversaire {nom} ! 🎉

Toute l'équipe de ${salon.nom} vous souhaite une merveilleuse journée !

Pour célébrer, nous vous offrons une surprise lors de votre prochaine visite. 🎁

À bientôt ! 💕`;

  const messageSuivi = `Bonjour {nom} ! 😊

Nous espérons que votre dernière visite vous a satisfaite !

N'hésitez pas à prendre rendez-vous pour votre prochain soin. Nous serons ravis de vous accueillir !

${salon.nom} 💇‍♀️✨`;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Rappels</h1>
        <p className="text-muted-foreground">Gérez vos rappels et relances clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes inactives</p>
              <p className="text-2xl font-bold">{clientesInactives.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Bell className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anniversaires ce mois</p>
              <p className="text-2xl font-bold">{clientesAnniversaire.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Délai rappel</p>
              <p className="text-2xl font-bold">{salon.joursRappelInactivite}j</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inactives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inactives">
            Inactives ({clientesInactives.length})
          </TabsTrigger>
          <TabsTrigger value="anniversaires">
            Anniversaires ({clientesAnniversaire.length})
          </TabsTrigger>
          <TabsTrigger value="suivi">
            Suivi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inactives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Clientes inactives depuis +{salon.joursRappelInactivite} jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientesInactives.length > 0 ? (
                <div className="space-y-3">
                  {clientesInactives.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                          <span className="text-warning font-semibold">
                            {client.nom.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.nom}</p>
                          <p className="text-sm text-muted-foreground">
                            Dernière visite: {client.derniereVisite 
                              ? new Date(client.derniereVisite).toLocaleDateString('fr-FR')
                              : 'Jamais'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="gradient-primary"
                        onClick={() => handleSendWhatsApp(client, messageInactivite)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  🎉 Toutes vos clientes sont actives !
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anniversaires" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎂 Anniversaires ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              {clientesAnniversaire.length > 0 ? (
                <div className="space-y-3">
                  {clientesAnniversaire.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent font-semibold">🎂</span>
                        </div>
                        <div>
                          <p className="font-medium">{client.nom}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.dateAnniversaire && new Date(client.dateAnniversaire).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="gradient-primary"
                        onClick={() => handleSendWhatsApp(client, messageAnniversaire)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Souhaiter
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun anniversaire ce mois
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suivi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Message de suivi personnalisé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envoyez un message de suivi à n'importe quelle cliente
              </p>
              <div className="space-y-3">
                {clients.slice(0, 10).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-sm font-semibold">
                          {client.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{client.nom}</p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendWhatsApp(client, messageSuivi)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
