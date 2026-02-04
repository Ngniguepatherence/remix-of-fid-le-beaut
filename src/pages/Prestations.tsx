import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrestations } from '@/hooks/usePrestations';
import { useClients } from '@/hooks/useClients';
import { TypePrestation } from '@/types';
import { TypePrestationForm } from '@/components/prestations/TypePrestationForm';
import { NouvellePrestation } from '@/components/prestations/NouvellePrestation';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export default function Prestations() {
  const { typesPrestations, prestations, addTypePrestation, updateTypePrestation, deleteTypePrestation, getTypePrestation } = usePrestations();
  const { clients, getClient } = useClients();
  const [showAddType, setShowAddType] = useState(false);
  const [editingType, setEditingType] = useState<TypePrestation | null>(null);
  const [showNouvellePrestation, setShowNouvellePrestation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddType = (data: Omit<TypePrestation, 'id'>) => {
    addTypePrestation(data);
    setShowAddType(false);
  };

  const handleEditType = (data: Partial<TypePrestation>) => {
    if (editingType) {
      updateTypePrestation(editingType.id, data);
      setEditingType(null);
    }
  };

  const handleDeleteType = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de prestation ?')) {
      deleteTypePrestation(id);
    }
  };

  const categories = [...new Set(typesPrestations.map(t => t.categorie).filter(Boolean))];

  const recentPrestations = [...prestations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Prestations</h1>
          <p className="text-muted-foreground">{typesPrestations.length} types de prestations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddType(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau type
          </Button>
          <Button onClick={() => setShowNouvellePrestation(true)} className="gradient-primary">
            <Scissors className="h-4 w-4 mr-2" />
            Enregistrer prestation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Types de prestations</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          {/* Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typesPrestations.map((type) => (
              <Card key={type.id} className="card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{type.nom}</h3>
                      {type.categorie && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {type.categorie}
                        </span>
                      )}
                      {type.description && (
                        <p className="text-sm text-muted-foreground mt-2">{type.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setEditingType(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteType(type.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(type.prix)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Recent prestations */}
          <Card>
            <CardHeader>
              <CardTitle>Prestations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPrestations.length > 0 ? (
                <div className="space-y-3">
                  {recentPrestations.map((prestation) => {
                    const type = getTypePrestation(prestation.typePrestationId);
                    const client = getClient(prestation.clientId);
                    return (
                      <div key={prestation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium">{type?.nom || 'Prestation inconnue'}</p>
                          <p className="text-sm text-muted-foreground">
                            {client?.nom || 'Cliente inconnue'} • {new Date(prestation.date).toLocaleDateString('fr-FR')}
                            {prestation.employe && ` • Par ${prestation.employe}`}
                          </p>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatCurrency(prestation.montant)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucune prestation enregistrée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Type Dialog */}
      <Dialog open={showAddType} onOpenChange={setShowAddType}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau type de prestation</DialogTitle>
          </DialogHeader>
          <TypePrestationForm onSubmit={handleAddType} onCancel={() => setShowAddType(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Type Dialog */}
      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le type de prestation</DialogTitle>
          </DialogHeader>
          {editingType && (
            <TypePrestationForm 
              type={editingType}
              onSubmit={handleEditType} 
              onCancel={() => setEditingType(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Nouvelle Prestation Dialog */}
      <Dialog open={showNouvellePrestation} onOpenChange={setShowNouvellePrestation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer une prestation</DialogTitle>
          </DialogHeader>
          <NouvellePrestation onClose={() => setShowNouvellePrestation(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
