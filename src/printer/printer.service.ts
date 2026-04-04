import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as fs from 'fs';
import * as path from 'path';

// Importación usando require para evitar problemas con módulos CommonJS
const PdfPrinter = require('pdfmake');

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }

  /**
   * Guarda un PDF en el directorio public/pdfs y retorna la URL relativa
   * @param docDefinition - Definición del documento PDF
   * @param fileName - Nombre del archivo sin extensión (se agregará .pdf automáticamente)
   * @returns Promise con la URL relativa del PDF guardado
   */
  async savePdf(
    docDefinition: TDocumentDefinitions,
    fileName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Directorio donde se guardará el PDF siempre en la raiz del proyecto
        const pdfDir = path.join(process.cwd(), 'public', 'pdfs');

        // Crear el directorio si no existe
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }

        // Nombre completo del archivo con timestamp para evitar duplicados
        const timestamp = Date.now();
        const pdfFileName = `${fileName}-${timestamp}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);

        // Crear el documento PDF
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const writeStream = fs.createWriteStream(pdfPath);

        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        writeStream.on('finish', () => {
          // Retornar la URL relativa del PDF
          const pdfUrl = `/pdfs/${pdfFileName}`;
          resolve(pdfUrl);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
