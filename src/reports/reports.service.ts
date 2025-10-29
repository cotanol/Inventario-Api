import { Injectable } from '@nestjs/common';
import { billReport } from './documents/bill.report';
import { notaPedidoReport } from './documents/nota-pedido.report';
import { PrinterService } from 'src/printer/printer.service';

@Injectable()
export class ReportsService {
  constructor(private readonly printer: PrinterService) {}

  async getBillReport(): Promise<PDFKit.PDFDocument> {
    const docDefinition = billReport();
    return this.printer.createPdf(docDefinition);
  }

  /**
   * Genera y guarda el PDF de factura en el servidor
   * @returns Promise con la URL del PDF guardado
   */
  async saveBillReport(): Promise<string> {
    const docDefinition = billReport();
    return this.printer.savePdf(docDefinition, 'factura');
  }

  /**
   * Genera y guarda el PDF de nota de pedido en el servidor
   * @param pedidoData Datos del pedido para generar el PDF
   * @returns Promise con la URL del PDF guardado
   */
  async saveNotaPedidoReport(pedidoData: any): Promise<string> {
    const docDefinition = notaPedidoReport(pedidoData);
    const fileName = `nota-pedido-${pedidoData.pedidoId}`;
    return this.printer.savePdf(docDefinition, fileName);
  }
}
