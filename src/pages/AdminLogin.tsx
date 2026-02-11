import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(email, password)) {
      toast({ title: 'Connecté en tant qu\'administrateur' });
      navigate('/admin');
    } else {
      toast({ title: 'Identifiants incorrects', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-4">
            <Shield className="h-9 w-9 text-background" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Administration</h1>
          <p className="text-muted-foreground">LeaderBright BeautyFlow</p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Connexion Admin</CardTitle>
            <CardDescription>Gérez les salons et abonnements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Mot de passe</Label>
                <Input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-muted-foreground">
            <Sparkles className="h-4 w-4 mr-1" />
            Espace Salon
          </Button>
        </div>
      </div>
    </div>
  );
}
