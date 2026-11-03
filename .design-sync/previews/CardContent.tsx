import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'piuba-pescado-erp';

export const Completo = () => (
  <Card style={{ width: 340 }}>
    <CardHeader>
      <CardTitle>Tanque 03</CardTitle>
      <CardDescription>Tilápia · Lote L-2024-11</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm">Densidade de 12 peixes/m³ e oxigênio dissolvido em 6,2 mg/L.</p>
    </CardContent>
    <CardFooter className="gap-2">
      <Button>Ver detalhes</Button>
      <Button variant="outline">Registrar manejo</Button>
    </CardFooter>
  </Card>
);
