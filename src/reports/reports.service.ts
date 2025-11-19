import { Injectable } from '@nestjs/common';
import { billReport } from './documents/bill.report';
import { notaPedidoReport } from './documents/nota-pedido.report';
import { ordenCompraReport } from './documents/orden-compra.report';
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

  /**
   * Genera y guarda el PDF de orden de compra en el servidor
   * @param compraData Datos de la compra para generar el PDF
   * @returns Promise con la URL del PDF guardado
   */
  async saveOrdenCompraReport(compraData: any): Promise<string> {
    const docDefinition = ordenCompraReport(compraData);
    const fileName = `orden-compra-${compraData.compraId}`;
    return this.printer.savePdf(docDefinition, fileName);
  }
}
