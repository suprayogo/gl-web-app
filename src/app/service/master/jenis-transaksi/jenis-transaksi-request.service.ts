import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class JenisTransaksiRequestService {
	url: string;

	constructor(private http: HttpClient) {}

	validate(data, httpBody, options, formData?: Object) {
		if (data === "g-jenis-transaksi") {
			httpBody.respondCode = "GET-DATA-JENIS-TRANSAKSI";
			httpBody.requestParam = JSON.stringify(formData);
			return this.get(httpBody, options);
		} else if (data === "i-jenis-transaksi") {
			httpBody.respondCode = "SET-DATA-JENIS-TRANSAKSI";
			httpBody.requestParam = JSON.stringify(formData);
			return this.get(httpBody, options);
		} else if (data === "u-jenis-transaksi") {
			httpBody.respondCode = "UPT-DATA-JENIS-TRANSAKSI";
			httpBody.requestParam = JSON.stringify(formData);
			return this.get(httpBody, options);
		} else if (data === "d-jenis-transaksi") {
			httpBody.respondCode = "DEL-DATA-JENIS-TRANSAKSI";
			httpBody.requestParam = JSON.stringify(formData);
			return this.get(httpBody, options);
		} else if (data === "g-monitoring-kas") {
			httpBody.respondCode = "GET-DATA-MONITORING-KAS-BANK";
			httpBody.requestParam = JSON.stringify(formData);
			return this.get(httpBody, options);
		}
	}

	get(httpBody, options) {
		return this.http.post(this.url, httpBody, options);
	}
}
