import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-data-jurnal') {
      httpBody.respondCode = 'GET-DATA-REPORT-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-jurnal-2') {
      httpBody.respondCode = 'GET-DATA-REPORT-JURNAL-2'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-buku-besar') {
      httpBody.respondCode = 'GET-DATA-REPORT-BUKU-BESAR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-buku-besar-2') {
      httpBody.respondCode = 'GET-DATA-REPORT-BUKU-BESAR-2'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-neraca-saldo') {
      httpBody.respondCode = 'GET-DATA-REPORT-NERACA-SALDO'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-laba-rugi') {
      httpBody.respondCode = 'GET-DATA-REPORT-LABA-RUGI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-neraca') {
      httpBody.respondCode = 'GET-DATA-REPORT-NERACA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-arus-kas') {
      httpBody.respondCode = 'GET-DATA-REPORT-ARUS-KAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-arus-kas-langsung') {
      httpBody.respondCode = 'GET-DATA-REPORT-ARUS-KAS-LANGSUNG'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-rekapitulasi-kas') {
      httpBody.respondCode = 'GET-DATA-REPORT-REKAPITULASI-KAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-rekapitulasi-giro') {
      httpBody.respondCode = 'GET-DATA-REPORT-REKAPITULASI-GIRO'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-rekapitulasi-bank') {
      httpBody.respondCode = 'GET-DATA-REPORT-REKAPITULASI-BANK'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-rekapitulasi-petty-cash') {
      httpBody.respondCode = 'GET-DATA-REPORT-REKAPITULASI-PETTY-CASH'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-rekapitulasi') {
      httpBody.respondCode = 'GET-DATA-REPORT-REKAPITULASI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-rpt-coa') {
      httpBody.respondCode = 'GET-DATA-REPORT-COA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-report') {
      httpBody.respondCode = 'GET-REPORT'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
