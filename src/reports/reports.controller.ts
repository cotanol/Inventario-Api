import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('bill')
  async getBillReport(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getBillReport();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('bill/save')
  async saveBillReport() {
    const pdfUrl = await this.reportsService.saveBillReport();

    return {
      ok: true,
      message: 'PDF generado exitosamente',
      url: pdfUrl,
      fullUrl: `${process.env.HOST_API || 'http://localhost:6040'}${pdfUrl}`,
    };
  }
}
