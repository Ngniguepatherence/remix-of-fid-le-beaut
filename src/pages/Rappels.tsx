import React, { useState, useMemo } from 'react';
import { Bell, MessageSquare, Clock, CheckCircle, Send, ThumbsUp, Calendar, Star, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClients } from '@/hooks/useClients';
import { useSalon } from '@/hooks/useSalon';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { SatisfactionSurvey } from '@/components/sav/SatisfactionSurvey';
import { cn } from '@/lib/utils';
import heroSalon from '@/assets/hero-salon.jpg';
import celebrationImg from '@/assets/celebration.jpg';

export default function Rappels() {
  const { clients, getInactiveClients, updateClient } = useClients();
  const { salon } = useSalon();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSatisfaction, setShowSatisfaction] = useState<string | null>(null);

  const clientesInactives = getInactiveClients(salon.joursRappelInactivite);
  
  // Clientes avec anniversaire ce mois
  const clientesAnniversaire = clients.filter(c => {
    if (!c.dateAnniversaire) return false;
    const today = new Date();
    const anniv = new Date(c.dateAnniversaire);
    return anniv.getMonth() === today.getMonth();
  });

  // Clientes avec visite récente (suivi)
  const clientesSuivi = clients.filter(c => {
    if (!c.derniereVisite) return false;
    const derniere = new Date(c.derniereVisite);
    const daysSince = Math.floor((Date.now() - derniere.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 7 && daysSince <= salon.joursRappelSuivi;
  });

  // Filter by search
  const filterClients = (list: typeof clients) => {
    if (!searchQuery) return list;
    return list.filter(c => 
      c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.telephone.includes(searchQuery)
    );
  };

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

  const handleSatisfactionSubmit = (rating: number, comment: string) => {
    if (showSatisfaction) {
      const client = clients.find(c => c.id === showSatisfaction);
      if (client) {
        // Update client notes with satisfaction
        const satisfactionNote = `[Satisfaction ${rating}/3] ${comment}`;
        updateClient(client.id, {
          notes: client.notes 
            ? `${client.notes}\n${new Date().toLocaleDateString('fr-FR')}: ${satisfactionNote}`
            : `${new Date().toLocaleDateString('fr-FR')}: ${satisfactionNote}`
        });
      }
    }
    setShowSatisfaction(null);
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

N'hésitez pas à nous faire part de vos remarques. Votre avis compte beaucoup pour nous.

${salon.nom} 💇‍♀️✨`;

  const selectedClient = showSatisfaction ? clients.find(c => c.id === showSatisfaction) : null;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Header */}
      <div className="relative h-40 lg:h-48 rounded-2xl overflow-hidden">
        <img 
          src={heroSalon} 
          alt="Service client" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent flex items-center p-6">
          <div className="text-white">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Service Après-Vente</h1>
            <p className="text-white/80 max-w-md">
              Rappels, suivi satisfaction et fidélisation de vos clientes
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Inactives</p>
              <p className="text-2xl font-bold">{clientesInactives.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Anniversaires</p>
              <p className="text-2xl font-bold">{clientesAnniversaire.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center shrink-0">
              <ThumbsUp className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">À suivre</p>
              <p className="text-2xl font-bold">{clientesSuivi.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Délai rappel</p>
              <p className="text-2xl font-bold">{salon.joursRappelInactivite}j</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="inactives" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="inactives" className="text-xs sm:text-sm">
            Inactives ({clientesInactives.length})
          </TabsTrigger>
          <TabsTrigger value="anniversaires" className="text-xs sm:text-sm">
            🎂 ({clientesAnniversaire.length})
          </TabsTrigger>
          <TabsTrigger value="suivi" className="text-xs sm:text-sm">
            Suivi ({clientesSuivi.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            Toutes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inactives" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Clientes inactives
              </CardTitle>
              <CardDescription>
                Pas de visite depuis plus de {salon.joursRappelInactivite} jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filterClients(clientesInactives).length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {filterClients(clientesInactives).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-warning/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
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
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const phone = client.telephone.replace(/\s/g, '').replace('+', '');
                              window.open(`tel:${phone}`, '_self');
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="gradient-primary"
                            onClick={() => handleSendWhatsApp(client, messageInactivite)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyState
                  icon={CheckCircle}
                  title="🎉 Toutes actives !"
                  description="Toutes vos clientes sont venues récemment"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anniversaires" className="space-y-4">
          <Card className="card-shadow overflow-hidden">
            {/* Birthday banner */}
            <div className="relative h-24">
              <img 
                src={celebrationImg} 
                alt="Célébration" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-6">
                <div className="text-white">
                  <h3 className="font-bold text-lg">🎂 Anniversaires ce mois</h3>
                  <p className="text-sm opacity-90">Souhaitez-leur une belle journée !</p>
                </div>
              </div>
            </div>
            <CardContent className="pt-4">
              {filterClients(clientesAnniversaire).length > 0 ? (
                <div className="space-y-3">
                  {filterClients(clientesAnniversaire).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-accent/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                          <span className="text-lg">🎂</span>
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
                <EmptyState
                  icon={Calendar}
                  title="Aucun anniversaire"
                  description="Pas d'anniversaire à célébrer ce mois-ci"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suivi" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-info" />
                Suivi satisfaction
              </CardTitle>
              <CardDescription>
                Clientes venues entre 7 et {salon.joursRappelSuivi} jours - demandez leur avis !
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filterClients(clientesSuivi).length > 0 ? (
                <div className="space-y-3">
                  {filterClients(clientesSuivi).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-info/20 flex items-center justify-center shrink-0">
                          <span className="text-info font-semibold">
                            {client.nom.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.nom}</p>
                          <p className="text-sm text-muted-foreground">
                            Visite le {client.derniereVisite && new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => setShowSatisfaction(client.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Satisfaction
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWhatsApp(client, messageSuivi)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ThumbsUp}
                  title="Aucun suivi en attente"
                  description="Les clientes récentes seront listées ici pour un suivi satisfaction"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Toutes les clientes</CardTitle>
              <CardDescription>
                Envoyez un message personnalisé à n'importe quelle cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {filterClients(clients).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          client.statut === 'vip' 
                            ? 'bg-accent/20' 
                            : 'bg-primary/20'
                        )}>
                          {client.statut === 'vip' ? (
                            <Star className="h-4 w-4 text-accent" />
                          ) : (
                            <span className="text-primary text-sm font-semibold">
                              {client.nom.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{client.nom}</p>
                          <p className="text-xs text-muted-foreground">{client.telephone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowSatisfaction(client.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWhatsApp(client, messageSuivi)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Satisfaction Survey Dialog */}
      {selectedClient && (
        <SatisfactionSurvey
          client={selectedClient}
          isOpen={!!showSatisfaction}
          onClose={() => setShowSatisfaction(null)}
          onSubmit={handleSatisfactionSubmit}
        />
      )}
    </div>
  );
}
