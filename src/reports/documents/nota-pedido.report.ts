import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
  Alignment,
} from 'pdfmake/interfaces';

const logo: Content = {
  image: 'src/assets/tucan-banner.png',
  width: 120,
};

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    alignment: 'center',
    margin: [0, 20, 0, 10],
  },
  subheader: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5],
  },
  tableHeader: {
    bold: true,
    fontSize: 11,
    color: 'white',
    fillColor: '#4f46e5',
    alignment: 'center',
  },
  tableCell: {
    fontSize: 10,
    alignment: 'center',
  },
  infoLabel: {
    bold: true,
    fontSize: 10,
  },
  infoValue: {
    fontSize: 10,
    margin: [0, 0, 0, 5],
  },
  footer: {
    fontSize: 9,
    italics: true,
    alignment: 'center',
    margin: [0, 10, 0, 0],
  },
};

interface DetallePedido {
  productoId: number;
  producto: {
    codigo: string;
    nombre: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotalLinea: number;
}

interface PedidoData {
  pedidoId: number;
  fechaCreacion: Date;
  cliente: {
    nombre: string;
    ruc: string;
    direccion: string;
  };
  vendedor: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  tipoPago: string;
  detalles: DetallePedido[];
  totalNeto: number;
  totalFinal: number;
}

export const notaPedidoReport = (pedido: PedidoData): TDocumentDefinitions => {
  const {
    pedidoId,
    fechaCreacion,
    cliente,
    vendedor,
    tipoPago,
    detalles,
    totalNeto,
    totalFinal,
  } = pedido;

  // Función simple para formatear precios en soles
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `S/. ${numPrice.toFixed(2)}`;
  };

  // Formatear fecha
  const fecha = new Date(fechaCreacion).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Construir filas de la tabla de productos
  const productosRows = detalles.map((detalle) => [
    { text: detalle.producto.codigo || 'N/A', style: 'tableCell' },
    {
      text: detalle.producto.nombre,
      style: 'tableCell',
      alignment: 'left' as Alignment,
    },
    { text: detalle.cantidad.toString(), style: 'tableCell' },
    {
      text: formatPrice(detalle.precioUnitario),
      style: 'tableCell',
      alignment: 'right' as Alignment,
    },
    {
      text: formatPrice(detalle.subtotalLinea),
      style: 'tableCell',
      alignment: 'right' as Alignment,
    },
  ]);

  return {
    pageOrientation: 'portrait',
    pageMargins: [40, 60, 40, 60],
    header: {
      margin: [40, 20, 40, 0],
      columns: [
        logo,
        {
          stack: [
            { text: 'NOTA DE PEDIDO', style: 'header' },
            {
              text: `N° ${pedidoId.toString().padStart(4, '0')}`,
              style: { fontSize: 12, alignment: 'center' },
            },
          ],
          width: '*',
        },
        {
          stack: [{ text: fecha, style: { fontSize: 10, alignment: 'right' } }],
          width: 'auto',
        },
      ],
    },
    content: [
      // Información del Cliente
      {
        style: 'subheader',
        text: 'INFORMACIÓN DEL CLIENTE',
        margin: [0, 20, 0, 10],
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                text: [
                  { text: 'Cliente: ', style: 'infoLabel' },
                  { text: cliente.nombre, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'RUC: ', style: 'infoLabel' },
                  { text: cliente.ruc, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'Dirección: ', style: 'infoLabel' },
                  { text: cliente.direccion, style: 'infoValue' },
                ],
              },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                text: [
                  { text: 'Vendedor: ', style: 'infoLabel' },
                  {
                    text: `${vendedor.nombres} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`,
                    style: 'infoValue',
                  },
                ],
              },
              {
                text: [
                  { text: 'Tipo de Pago: ', style: 'infoLabel' },
                  { text: tipoPago, style: 'infoValue' },
                ],
              },
            ],
          },
        ],
      },

      // Separador
      { text: '', margin: [0, 10, 0, 10] },

      // Tabla de Productos
      {
        style: 'subheader',
        text: 'DETALLE DEL PEDIDO',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'CÓDIGO', style: 'tableHeader' },
              { text: 'PRODUCTO', style: 'tableHeader' },
              { text: 'CANT.', style: 'tableHeader' },
              { text: 'P. UNIT.', style: 'tableHeader' },
              { text: 'SUBTOTAL', style: 'tableHeader' },
            ],
            ...productosRows,
          ],
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex === 0
              ? '#4f46e5'
              : rowIndex % 2 === 0
                ? '#f3f4f6'
                : null;
          },
          hLineWidth: function (i: number, node: any) {
            return i === 0 || i === node.table.body.length ? 1 : 0.5;
          },
          vLineWidth: function () {
            return 0.5;
          },
          hLineColor: function () {
            return '#e5e7eb';
          },
          vLineColor: function () {
            return '#e5e7eb';
          },
        },
      },

      // Totales
      {
        margin: [0, 20, 0, 0],
        table: {
          widths: ['*', 100],
          body: [
            [
              {
                text: 'Subtotal:',
                alignment: 'right' as Alignment,
                bold: true,
                border: [false, false, false, false],
              },
              {
                text: formatPrice(totalNeto),
                alignment: 'right' as Alignment,
                border: [false, false, false, false],
              },
            ],
            [
              {
                text: 'TOTAL:',
                alignment: 'right' as Alignment,
                bold: true,
                fontSize: 12,
                border: [false, true, false, false],
              },
              {
                text: formatPrice(totalFinal),
                alignment: 'right' as Alignment,
                bold: true,
                fontSize: 12,
                border: [false, true, false, false],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i: number) {
            return i === 1 ? 1 : 0;
          },
          hLineColor: function () {
            return '#000000';
          },
        },
      },
    ],
    footer: function (currentPage: number, pageCount: number) {
      return {
        columns: [
          {
            text: 'Gracias por su preferencia',
            style: 'footer',
            alignment: 'left',
            margin: [40, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            style: 'footer',
            alignment: 'right',
            margin: [0, 0, 40, 0],
          },
        ],
      };
    },
    styles: styles,
  };
};
