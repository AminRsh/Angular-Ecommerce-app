import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { APIResponseModel, CartModel, Customer, LoginModel, OrderModel } from '../model/Product';
import { Constant } from '../constant/constants';

@Injectable({
  providedIn: 'root'
})

export class MasterService {

  apiUrl: string = "https://freeapi.miniprojectideas.com/api/BigBasket/";
    
  onCartAdded: Subject<boolean> = new Subject<boolean>();


  loggedUserData: Customer = new Customer();

  constructor(private http: HttpClient) {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY)
    if (isUser != null ) {
      const parseObj = JSON.parse(isUser)
      this.loggedUserData = parseObj
    }
  }

  getAllProducts(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllProducts")
  }

  getAllCategory(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllCategory")
  }

  getAllProductsByCategoryId(categoryId: number): Observable<APIResponseModel> {
    const url = `${this.apiUrl}GetAllProductsByCategoryId?id=${categoryId}`
    return this.http.get<APIResponseModel>(url)
  }

  registerNewCustomer(obj: Customer): Observable<APIResponseModel> {
    const url = `${this.apiUrl}RegisterCustomer`
    return this.http.post<APIResponseModel>(url, obj)
  }

  addToCart(obj: CartModel): Observable<APIResponseModel> {
    const url = `${this.apiUrl}AddToCart`
    return this.http.post<APIResponseModel>(url, obj)
  }

  loginCustomer(obj: LoginModel): Observable<APIResponseModel> {
    const url = `${this.apiUrl}Login`
    return this.http.post<APIResponseModel>(url, obj)
  }

  getCartProductsByCustomerId(loggedUserId: number): Observable<APIResponseModel> {
    const url = `${this.apiUrl}GetCartProductsByCustomerId?id=${loggedUserId}`
    return this.http.get<APIResponseModel>(url)
  }
  
  deleteProductFromCartById(cartId: number): Observable<APIResponseModel> {
    const url = `${this.apiUrl}DeleteProductFromCartById?id=${cartId}`
    return this.http.get<APIResponseModel>(url)
  }

  onPlaceOrder(obj: OrderModel): Observable<APIResponseModel> {
    const url = `${this.apiUrl}PlaceOrder`
    return this.http.post<APIResponseModel>(url, obj)
  }
}

