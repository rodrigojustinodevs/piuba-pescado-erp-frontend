import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from 'piuba-pescado-erp';

export const Lista = () => (
  <div style={{ width: 520 }}>
    <Table>
      <TableCaption>Tanques ativos em novembro de 2026</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tanque</TableHead>
          <TableHead>Espécie</TableHead>
          <TableHead>Peixes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Tanque 01</TableCell>
          <TableCell>Tilápia</TableCell>
          <TableCell>4.200</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tanque 02</TableCell>
          <TableCell>Tambaqui</TableCell>
          <TableCell>2.850</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tanque 03</TableCell>
          <TableCell>Tilápia</TableCell>
          <TableCell>5.430</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
