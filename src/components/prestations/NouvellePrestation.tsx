import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrestations } from '@/hooks/usePrestations';
import { useClients } from '@/hooks/useClients';
import { toast } from '@/hooks/use-toast';

const prestationSchema = z.object({
  clientId: z.string().min(1, 'Veuillez sélectionner une cliente'),
  typePrestationId: z.string().min(1, 'Veuillez sélectionner une prestation'),
  employe: z.string().optional(),
  notes: z.string().optional(),
});

type PrestationFormData = z.infer<typeof prestationSchema>;

interface NouvellePrestationProps {
  onClose: () => void;
}

export function NouvellePrestation({ onClose }: NouvellePrestationProps) {
  const { typesPrestations, addPrestation, getTypePrestation } = usePrestations();
  const { clients, updateClientStats } = useClients();

  const form = useForm<PrestationFormData>({
    resolver: zodResolver(prestationSchema),
    defaultValues: {
      clientId: '',
      typePrestationId: '',
      employe: '',
      notes: '',
    },
  });

  const selectedType = getTypePrestation(form.watch('typePrestationId'));

  const onSubmit = (data: PrestationFormData) => {
    const type = getTypePrestation(data.typePrestationId);
    if (!type) return;

    addPrestation({
      clientId: data.clientId,
      typePrestationId: data.typePrestationId,
      employe: data.employe,
      notes: data.notes,
      montant: type.prix,
    });

    // Mise à jour des stats client
    updateClientStats(data.clientId, type.prix);

    toast({
      title: 'Prestation enregistrée',
      description: `${type.nom} ajoutée avec succès`,
    });

    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nom} - {client.telephone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typePrestationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de prestation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une prestation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typesPrestations.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.nom} - {type.prix.toLocaleString()} FCFA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType && (
          <div className="p-3 rounded-lg bg-primary/10 text-sm">
            <p className="font-medium">Montant: <span className="text-primary">{selectedType.prix.toLocaleString()} FCFA</span></p>
          </div>
        )}

        <FormField
          control={form.control}
          name="employe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employé(e) (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'employé(e)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Remarques sur la prestation..."
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" className="flex-1 gradient-primary">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}
