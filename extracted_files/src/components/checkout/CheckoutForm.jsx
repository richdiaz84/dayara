
    import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Textarea } from '@/components/ui/textarea';
    import { Checkbox } from '@/components/ui/checkbox';

    const CheckoutForm = ({ 
      customerInfo,
      setCustomerInfo,
      shippingAddress, 
      setShippingAddress,
      billingAddress, 
      setBillingAddress,
      useShippingForBilling, 
      setUseShippingForBilling,
      orderNotes,
      setOrderNotes,
      acceptsMarketing,
      setAcceptsMarketing,
      isUserLoggedIn
    }) => {

      const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
      };

      const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress(prev => ({ ...prev, [name]: value }));
      };
      
      const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
      };


      return (
        <div className="space-y-8">
          {!isUserLoggedIn && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="customerName">Nombre Completo</Label>
                  <Input id="customerName" name="name" value={customerInfo.name} onChange={handleCustomerInfoChange} required />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Correo Electrónico</Label>
                  <Input id="customerEmail" name="email" type="email" value={customerInfo.email} onChange={handleCustomerInfoChange} required />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Información de Envío</CardTitle>
              <CardDescription>¿A dónde enviaremos tu pedido?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isUserLoggedIn && ( /* Only show name/email for shipping if user is logged in, otherwise it's in customerInfo */
                <>
                  <div className="md:col-span-2">
                    <Label htmlFor="shippingFullName">Nombre Completo (Envío)</Label>
                    <Input id="shippingFullName" name="fullName" value={shippingAddress.fullName || customerInfo.name} onChange={handleShippingChange} required />
                  </div>
                </>
              )}
               <div className="md:col-span-2">
                <Label htmlFor="shippingStreet">Dirección (Calle y Número)</Label>
                <Input id="shippingStreet" name="street" value={shippingAddress.street} onChange={handleShippingChange} required />
              </div>
              <div>
                <Label htmlFor="shippingCity">Ciudad</Label>
                <Input id="shippingCity" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
              </div>
              <div>
                <Label htmlFor="shippingState">Estado/Provincia</Label>
                <Input id="shippingState" name="state" value={shippingAddress.state} onChange={handleShippingChange} />
              </div>
              <div>
                <Label htmlFor="shippingZip">Código Postal</Label>
                <Input id="shippingZip" name="zip" value={shippingAddress.zip} onChange={handleShippingChange} required />
              </div>
              <div>
                <Label htmlFor="shippingCountry">País</Label>
                <Input id="shippingCountry" name="country" value={shippingAddress.country} onChange={handleShippingChange} required />
              </div>
               <div className="md:col-span-2">
                <Label htmlFor="shippingPhone">Teléfono de Contacto (Envío)</Label>
                <Input id="shippingPhone" name="phone" type="tel" value={shippingAddress.phone} onChange={handleShippingChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Información de Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="useShippingForBilling" 
                  checked={useShippingForBilling} 
                  onCheckedChange={setUseShippingForBilling}
                />
                <Label htmlFor="useShippingForBilling" className="cursor-pointer">La dirección de facturación es la misma que la de envío.</Label>
              </div>
              {!useShippingForBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="billingFullName">Nombre Completo (Facturación)</Label>
                    <Input id="billingFullName" name="fullName" value={billingAddress.fullName} onChange={handleBillingChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="billingStreet">Dirección (Facturación)</Label>
                    <Input id="billingStreet" name="street" value={billingAddress.street} onChange={handleBillingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="billingCity">Ciudad</Label>
                    <Input id="billingCity" name="city" value={billingAddress.city} onChange={handleBillingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="billingState">Estado/Provincia</Label>
                    <Input id="billingState" name="state" value={billingAddress.state} onChange={handleBillingChange} />
                  </div>
                  <div>
                    <Label htmlFor="billingZip">Código Postal</Label>
                    <Input id="billingZip" name="zip" value={billingAddress.zip} onChange={handleBillingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="billingCountry">País</Label>
                    <Input id="billingCountry" name="country" value={billingAddress.country} onChange={handleBillingChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="billingPhone">Teléfono (Facturación)</Label>
                    <Input id="billingPhone" name="phone" type="tel" value={billingAddress.phone} onChange={handleBillingChange} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Notas del Pedido (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Instrucciones especiales para tu pedido..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Comunicaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acceptsMarketing" 
                  checked={acceptsMarketing} 
                  onCheckedChange={setAcceptsMarketing}
                />
                <Label htmlFor="acceptsMarketing" className="cursor-pointer text-sm text-muted-foreground">
                  Quiero recibir noticias, ofertas especiales y otra información de marketing.
                </Label>
              </div>
            </CardContent>
          </Card>

        </div>
      );
    };

    export default CheckoutForm;
  