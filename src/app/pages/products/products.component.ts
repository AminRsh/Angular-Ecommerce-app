import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartModel, Category, Customer, ProductList } from '../../model/Product';
import { map, Observable, pipe, Subscription } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe,NgIf],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy{

  // productList: ProductList [] = []
  productList = signal<ProductList []>([])

  categeoryList$: Observable<Category[]> = new Observable<Category[]>();
  subscriptionList: Subscription[] = [];

  masterService = inject(MasterService);
  toastr = inject(ToastrService); 

  placeholderImage: string = 'assets/images/placeholder.png';

  ngOnInit(): void {
    this.loadAllProducts() 
    this.categeoryList$ = this.masterService.getAllCategory().pipe(
      map(item => item.data)
    )
  }

  getProductsByCategory(id:number) {
    this.masterService.getAllProductsByCategoryId(id).subscribe((res:APIResponseModel) => {
      this.productList.set(res.data)
    })
  }

  loadAllProducts() {
    this.subscriptionList.push(this.masterService.getAllProducts().subscribe((res:APIResponseModel) => {
      // this.productList = res.data;
        this.productList.set(res.data)
    }))
  }

  onAddtoCart(id:number) {
    // debugger;
    const newObj : CartModel = new CartModel()
    newObj.ProductId = id;
    newObj.CustId = this.masterService.loggedUserData.custId;

    this.masterService.addToCart(newObj).subscribe((res:APIResponseModel) => {
      if (res.result) {
        alert("Product Added to Cart");
        this.masterService.onCartAdded.next(true)
      } else {
        alert(res.message)
      }
    })
  }

  ngOnDestroy(): void {
      this.subscriptionList.forEach(element => {
        element.unsubscribe();
      });
  }

}
