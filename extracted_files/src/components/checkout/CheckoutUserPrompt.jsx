
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { AlertTriangle } from 'lucide-react';

    const CheckoutUserPrompt = () => {
      return (
        <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <CardTitle className="text-amber-700 dark:text-amber-300">¿Ya tienes cuenta?</CardTitle>
              <CardDescription className="text-amber-600 dark:text-amber-400">
                <Link to="/auth?tab=login&redirect=/checkout" className="underline font-semibold hover:text-amber-500">Inicia sesión</Link> para un proceso más rápido o 
                <Link to="/auth?tab=register&redirect=/checkout" className="underline font-semibold hover:text-amber-500"> regístrate</Link>.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      );
    };
    export default CheckoutUserPrompt;
  