import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchFilters, HotelSearchResponse } from '../models/hotel.model';

@Injectable({
    providedIn: 'root'
})
export class HotelService {
    // Target our search endpoint defined in the backend
    private apiUrl = `${environment.apiUrl}/search`;

    constructor(private http: HttpClient) { }

    searchHotels(filters: SearchFilters): Observable<HotelSearchResponse> {
        let params = new HttpParams();

        // Dynamically iterate over the filters object
        Object.keys(filters).forEach(key => {
            const value = (filters as any)[key];

            // Only append if the value is defined and not null
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    // Use comma-separated values for backend validation compatibility
                    params = params.set(key, value.join(','));
                } else {
                    params = params.set(key, String(value));
                }
            }
        });

        console.log('📡 Fetching hotels with params:', params.toString());
        // Make the GET request with the built HttpParams
        return this.http.get<HotelSearchResponse>(this.apiUrl, { params });
    }


    getFilterOptions(city?: string): Observable<any> {
        let params = new HttpParams();
        if (city) {
            params = params.set('city', city);
        }
        return this.http.get<any>(`${this.apiUrl}/filters`, { params });
    }

    getHotelById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
}

