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

interface DetalleCompra {
  productoId: number;
  producto: {
    codigo: string;
    nombre: string;
  };
  cantidadSolicitada: number;
  costoUnitario: number;
  subtotal: number;
}

interface CompraData {
  compraId: number;
  fechaOrden: Date;
  fechaLlegadaEstimada?: Date;
  proveedor: {
    nombreEmpresa: string;
    numeroIdentificacionFiscal: string;
    contactoNombre: string;
    telefono: string;
    email: string;
    direccion: string;
    pais: string;
  };
  detalles: DetalleCompra[];
  totalCompra: number;
}

export const ordenCompraReport = (compra: CompraData): TDocumentDefinitions => {
  const {
    compraId,
    fechaOrden,
    fechaLlegadaEstimada,
    proveedor,
    detalles,
    totalCompra,
  } = compra;

  // Función para formatear precios
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `S/. ${numPrice.toFixed(2)}`;
  };

  // Formatear fechas
  const fechaOrdenStr = new Date(fechaOrden).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaLlegadaStr = fechaLlegadaEstimada
    ? new Date(fechaLlegadaEstimada).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Por definir';

  // Construir filas de productos
  const productosRows = detalles.map((detalle) => [
    { text: detalle.producto.codigo || 'N/A', style: 'tableCell' },
    {
      text: detalle.producto.nombre,
      style: 'tableCell',
      alignment: 'left' as Alignment,
    },
    { text: detalle.cantidadSolicitada.toString(), style: 'tableCell' },
    {
      text: formatPrice(detalle.costoUnitario),
      style: 'tableCell',
      alignment: 'right' as Alignment,
    },
    {
      text: formatPrice(detalle.subtotal),
      style: 'tableCell',
      alignment: 'right' as Alignment,
      bold: true,
    },
  ]);

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      margin: [40, 20, 40, 0],
      columns: [
        logo,
        {
          width: '*',
          text: '',
        },
        {
          width: 'auto',
          stack: [
            {
              text: 'ORDEN DE COMPRA',
              style: 'header',
              alignment: 'right' as Alignment,
            },
            {
              text: `N° ${compraId.toString().padStart(6, '0')}`,
              fontSize: 12,
              bold: true,
              alignment: 'right' as Alignment,
              margin: [0, 5, 0, 0],
            },
          ],
        },
      ],
    },
    content: [
      // Información de la empresa
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'DATOS DE LA EMPRESA', style: 'subheader' },
              {
                text: [
                  { text: 'Razón Social: ', style: 'infoLabel' },
                  { text: 'Tucán Code S.A.C.', style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'RUC: ', style: 'infoLabel' },
                  { text: '20601234567', style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'Dirección: ', style: 'infoLabel' },
                  {
                    text: 'Av. Los Conquistadores 123, San Isidro, Lima',
                    style: 'infoValue',
                  },
                ],
              },
              {
                text: [
                  { text: 'Teléfono: ', style: 'infoLabel' },
                  { text: '(01) 123-4567', style: 'infoValue' },
                ],
              },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'DATOS DEL PROVEEDOR', style: 'subheader' },
              {
                text: [
                  { text: 'Empresa: ', style: 'infoLabel' },
                  { text: proveedor.nombreEmpresa, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'RUC/NIF: ', style: 'infoLabel' },
                  {
                    text: proveedor.numeroIdentificacionFiscal,
                    style: 'infoValue',
                  },
                ],
              },
              {
                text: [
                  { text: 'Contacto: ', style: 'infoLabel' },
                  { text: proveedor.contactoNombre, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'Teléfono: ', style: 'infoLabel' },
                  { text: proveedor.telefono, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'Email: ', style: 'infoLabel' },
                  { text: proveedor.email, style: 'infoValue' },
                ],
              },
              {
                text: [
                  { text: 'País: ', style: 'infoLabel' },
                  { text: proveedor.pais, style: 'infoValue' },
                ],
              },
            ],
          },
        ],
        margin: [0, 20, 0, 20],
      },

      // Información de fechas
      {
        columns: [
          {
            width: '50%',
            text: [
              { text: 'Fecha de Orden: ', style: 'infoLabel' },
              { text: fechaOrdenStr, style: 'infoValue' },
            ],
          },
          {
            width: '50%',
            text: [
              { text: 'Fecha Estimada de Llegada: ', style: 'infoLabel' },
              { text: fechaLlegadaStr, style: 'infoValue' },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Tabla de productos
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Código', style: 'tableHeader' },
              { text: 'Producto', style: 'tableHeader' },
              { text: 'Cantidad', style: 'tableHeader' },
              { text: 'Costo Unit.', style: 'tableHeader' },
              { text: 'Subtotal', style: 'tableHeader' },
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
                text: 'TOTAL DE LA ORDEN:',
                style: 'infoLabel',
                alignment: 'right' as Alignment,
                border: [false, true, false, false],
              },
              {
                text: formatPrice(totalCompra),
                fontSize: 14,
                bold: true,
                alignment: 'right' as Alignment,
                color: '#4f46e5',
                border: [false, true, false, false],
              },
            ],
          ],
        },
      },
    ],
    footer: function (currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount} - Orden de Compra N° ${compraId.toString().padStart(6, '0')}`,
        style: 'footer',
      };
    },
    styles,
  };

  return docDefinition;
};
