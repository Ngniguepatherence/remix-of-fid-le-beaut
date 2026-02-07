import React from 'react';
import { CalendrierRendezVous } from '@/components/prestations/CalendrierRendezVous';

export default function RendezVousPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Rendez-vous</h1>
        <p className="text-muted-foreground">Planifiez et gérez les rendez-vous du salon</p>
      </div>
      <CalendrierRendezVous />
    </div>
  );
}
