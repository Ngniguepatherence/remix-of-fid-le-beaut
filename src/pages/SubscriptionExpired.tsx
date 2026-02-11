import React from 'react';
import { AlertTriangle, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionExpired() {
  const { logout, currentSalon } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full card-shadow">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Abonnement expiré</h1>
            <p className="text-muted-foreground">
              L'abonnement de <strong>{currentSalon?.nom || 'votre salon'}</strong> a expiré.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Comment renouveler ?</p>
            <p>Contactez LeaderBright pour effectuer le paiement de <strong>25 000 FCFA</strong> et réactiver votre accès.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Contacter LeaderBright
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
