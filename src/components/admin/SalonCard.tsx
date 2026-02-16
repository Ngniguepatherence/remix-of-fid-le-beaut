import React from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalonAccount } from '@/types/auth';
import { isSalonSubscriptionActive } from '@/lib/auth';

interface Props {
  salon: SalonAccount;
  onRenew: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}

function daysRemaining(salon: SalonAccount): number {
  const expiry = new Date(salon.dernierPaiement);
  expiry.setDate(expiry.getDate() + salon.joursAbonnement);
  const diff = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function SalonCard({ salon, onRenew, onToggle }: Props) {
  const active = isSalonSubscriptionActive(salon);
  const days = daysRemaining(salon);

  return (
    <div className={`p-3 sm:p-4 rounded-xl border ${active ? 'border-border bg-card' : 'border-destructive/30 bg-destructive/5'}`}>
      <div className="flex flex-col gap-3">
        {/* Salon info */}
        <div className="flex items-start gap-3">
          <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary/20' : 'bg-destructive/20'}`}>
            <Building2 className={`h-4 w-4 sm:h-5 sm:w-5 ${active ? 'text-primary' : 'text-destructive'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">{salon.nom}</h3>
              <Badge className={`text-[10px] sm:text-xs ${active ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                {active ? `${days}j restants` : 'Expiré'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{salon.proprietaire} · {salon.telephone}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{salon.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-12 sm:ml-[52px]">
          <Button size="sm" variant="outline" onClick={() => onRenew(salon.id)} className="text-xs h-8">
            <RefreshCw className="h-3 w-3 mr-1" />
            Renouveler
          </Button>
          <Button size="sm" variant={active ? 'destructive' : 'default'} onClick={() => onToggle(salon.id, !active)} className="text-xs h-8">
            {active ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
