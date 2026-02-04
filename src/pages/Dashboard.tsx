import React from 'react';
import { Users, UserCheck, UserX, Calendar, TrendingUp, Scissors } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import { usePrestations } from '@/hooks/usePrestations';
import { useSalon } from '@/hooks/useSalon';

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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur {salon.nom}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          subtitle={`Plus de ${salon.joursRappelInactivite} jours`}
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
          title="Types de prestations"
          value={typesPrestations.length}
          icon={Scissors}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prestations populaires */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Prestations les plus demandées</CardTitle>
          </CardHeader>
          <CardContent>
            {prestationsPopulaires.length > 0 ? (
              <div className="space-y-4">
                {prestationsPopulaires.map((item, index) => (
                  <div key={item.nom} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.nom}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.count / prestationsPopulaires[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.count} fois
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune prestation enregistrée
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clientes récentes */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Clientes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length > 0 ? (
              <div className="space-y-3">
                {clients
                  .sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime())
                  .slice(0, 5)
                  .map((client) => (
                    <div key={client.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {client.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{client.nom}</p>
                        <p className="text-xs text-muted-foreground">{client.telephone}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        client.statut === 'vip' 
                          ? 'bg-accent/20 text-accent' 
                          : client.statut === 'reguliere'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {client.statut.charAt(0).toUpperCase() + client.statut.slice(1)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune cliente enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
