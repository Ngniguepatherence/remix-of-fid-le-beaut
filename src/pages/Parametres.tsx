import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Gift, Bell, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useSalon } from '@/hooks/useSalon';
import { toast } from '@/hooks/use-toast';

const salonSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  telephone: z.string().min(9, 'Numéro de téléphone invalide'),
  adresse: z.string().optional(),
});

const fideliteSchema = z.object({
  visitesRequises: z.coerce.number().min(1, 'Minimum 1 visite'),
  reductionPourcentage: z.coerce.number().min(1).max(100, 'Maximum 100%'),
  visitesVIP: z.coerce.number().min(1, 'Minimum 1 visite'),
});

const rappelSchema = z.object({
  joursRappelInactivite: z.coerce.number().min(1, 'Minimum 1 jour'),
  joursRappelSuivi: z.coerce.number().min(1, 'Minimum 1 jour'),
});

export default function Parametres() {
  const { salon, updateSalon, updateConfigFidelite } = useSalon();

  const salonForm = useForm({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      nom: salon.nom,
      telephone: salon.telephone,
      adresse: salon.adresse || '',
    },
  });

  const fideliteForm = useForm({
    resolver: zodResolver(fideliteSchema),
    defaultValues: {
      visitesRequises: salon.configFidelite.visitesRequises,
      reductionPourcentage: salon.configFidelite.reductionPourcentage,
      visitesVIP: salon.configFidelite.visitesVIP,
    },
  });

  const rappelForm = useForm({
    resolver: zodResolver(rappelSchema),
    defaultValues: {
      joursRappelInactivite: salon.joursRappelInactivite,
      joursRappelSuivi: salon.joursRappelSuivi,
    },
  });

  const onSalonSubmit = (data: z.infer<typeof salonSchema>) => {
    updateSalon(data);
    toast({ title: 'Paramètres du salon mis à jour' });
  };

  const onFideliteSubmit = (data: z.infer<typeof fideliteSchema>) => {
    updateConfigFidelite(data);
    toast({ title: 'Configuration fidélité mise à jour' });
  };

  const onRappelSubmit = (data: z.infer<typeof rappelSchema>) => {
    updateSalon(data);
    toast({ title: 'Paramètres de rappel mis à jour' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre salon</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salon info */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Informations du salon</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...salonForm}>
              <form onSubmit={salonForm.handleSubmit(onSalonSubmit)} className="space-y-4">
                <FormField
                  control={salonForm.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du salon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={salonForm.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={salonForm.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Quartier, Ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gradient-primary">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Fidélité config */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-accent" />
              <CardTitle>Programme de fidélité</CardTitle>
            </div>
            <CardDescription>
              Configurez les règles de votre programme de fidélité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...fideliteForm}>
              <form onSubmit={fideliteForm.handleSubmit(onFideliteSubmit)} className="space-y-4">
                <FormField
                  control={fideliteForm.control}
                  name="visitesRequises"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visites pour une réduction</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre de visites avant d'obtenir une réduction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={fideliteForm.control}
                  name="reductionPourcentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pourcentage de réduction</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={fideliteForm.control}
                  name="visitesVIP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visites pour statut VIP</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Après ce nombre de visites, la cliente devient VIP
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gradient-primary">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Rappels config */}
        <Card className="card-shadow lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              <CardTitle>Configuration des rappels</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...rappelForm}>
              <form onSubmit={rappelForm.handleSubmit(onRappelSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={rappelForm.control}
                    name="joursRappelInactivite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jours avant rappel inactivité</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Une cliente est considérée inactive après ce délai
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rappelForm.control}
                    name="joursRappelSuivi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jours avant rappel de suivi</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Délai après une prestation pour envoyer un suivi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="gradient-primary">
                  Enregistrer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
