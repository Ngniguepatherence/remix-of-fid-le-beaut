import React from 'react';
import { Users, UserCheck, UserX, Calendar, TrendingUp, Scissors, ArrowRight, Gift, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClients } from '@/hooks/useClients';
import { usePrestations } from '@/hooks/usePrestations';
import { useSalon } from '@/hooks/useSalon';
import heroSalon from '@/assets/hero-salon.jpg';
import serviceHair from '@/assets/service-hair.jpg';
import serviceMakeup from '@/assets/service-makeup.jpg';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export default function Dashboard() {
  const { clients, getInactiveClients } = useClients();
  const { getPrestationsCeMois, getRevenusCeMois, getPrestationsPopulaires, typesPrestations } = usePrestations();
  const { salon } = useSalon();

  const clientesInactives = getInactiveClients(salon.joursRappelInactivite);
  const clientesActives = clients.length - clientesInactives.length;
  const visitesCeMois = getPrestationsCeMois().length;
  const revenusCeMois = getRevenusCeMois();
  const prestationsPopulaires = getPrestationsPopulaires();
  const clientesVIP = clients.filter(c => c.statut === 'vip');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Header */}
      <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
        <img 
          src={heroSalon} 
          alt="Salon de beauté" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent flex items-end p-6">
          <div className="text-white">
            <p className="text-white/80 mb-1">Bienvenue sur</p>
            <h1 className="text-2xl lg:text-4xl font-bold">{salon.nom}</h1>
            <p className="text-white/80 mt-2 hidden sm:block">
              Gérez votre salon et fidélisez vos clientes
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <StatCard
          title="Total Clientes"
          value={clients.length}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Clientes Actives"
          value={clientesActives}
          subtitle="Ces 30 derniers jours"
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Clientes Inactives"
          value={clientesInactives.length}
          subtitle={`+${salon.joursRappelInactivite} jours`}
          icon={UserX}
          variant="warning"
        />
        <StatCard
          title="Visites ce mois"
          value={visitesCeMois}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrency(revenusCeMois)}
          icon={TrendingUp}
          variant="accent"
        />
        <StatCard
          title="Prestations"
          value={typesPrestations.length}
          icon={Scissors}
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-shadow overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="flex h-full">
            <div className="w-1/3 relative">
              <img 
                src={serviceHair} 
                alt="Coiffure" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-4 flex flex-col justify-center">
              <h3 className="font-semibold text-lg mb-2">Nouvelle prestation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Enregistrez une visite cliente
              </p>
              <Link to="/prestations">
                <Button size="sm" className="gradient-primary">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>

        <Card className="card-shadow overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="flex h-full">
            <div className="w-1/3 relative">
              <img 
                src={serviceMakeup} 
                alt="Maquillage" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-4 flex flex-col justify-center">
              <h3 className="font-semibold text-lg mb-2">Nouvelle cliente</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ajoutez une cliente à votre base
              </p>
              <Link to="/clientes">
                <Button size="sm" className="gradient-primary">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prestations populaires */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Prestations les plus demandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prestationsPopulaires.length > 0 ? (
              <div className="space-y-4">
                {prestationsPopulaires.map((item, index) => (
                  <div key={item.nom} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.nom}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.count / prestationsPopulaires[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground shrink-0">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scissors className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucune prestation enregistrée</p>
                <Link to="/prestations">
                  <Button variant="link" className="mt-2">
                    Ajouter une prestation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VIP Clients */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Clientes VIP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientesVIP.length > 0 ? (
              <div className="space-y-3">
                {clientesVIP.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{client.nom}</p>
                      <p className="text-xs text-muted-foreground">{client.nombreVisites} visites</p>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-0">
                      <Gift className="h-3 w-3 mr-1" />
                      {client.pointsFidelite} pts
                    </Badge>
                  </div>
                ))}
                {clientesVIP.length > 5 && (
                  <Link to="/clientes" className="block">
                    <Button variant="ghost" className="w-full">
                      Voir les {clientesVIP.length - 5} autres VIP
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Pas encore de clientes VIP</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Après {salon.configFidelite.visitesVIP} visites, une cliente devient VIP
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Clientes récentes
          </CardTitle>
          <Link to="/clientes">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clients
                .sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime())
                .slice(0, 6)
                .map((client) => (
                  <div key={client.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold">
                        {client.nom.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{client.nom}</p>
                      <p className="text-xs text-muted-foreground">{client.telephone}</p>
                    </div>
                    <Badge className={`shrink-0 ${
                      client.statut === 'vip' 
                        ? 'bg-accent/20 text-accent' 
                        : client.statut === 'reguliere'
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {client.statut === 'vip' && <Star className="h-3 w-3 mr-1" />}
                      {client.statut.charAt(0).toUpperCase() + client.statut.slice(1)}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune cliente enregistrée</p>
              <Link to="/clientes">
                <Button variant="link" className="mt-2">
                  Ajouter votre première cliente
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
