import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Customer, APIResponseModel, LoginModel, CartData } from './model/Product';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit{
  title = 'my-angular-app';

  registerObj: Customer = new Customer();
  loginObj: LoginModel = new LoginModel();

  loggedUserData: Customer = new Customer();
  masterService = inject(MasterService);

  @ViewChild('registerModal') registerModal: ElementRef | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;
  isCartPopuoOpen: boolean = false;
  cartData: CartData [] = []

  ngOnInit(): void {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY)
    if (isUser != null ) {
      const parseObj = JSON.parse(isUser)
      this.loggedUserData = parseObj
      this.getCartItems();
    }
    this.masterService.onCartAdded.subscribe((res:boolean) => {
      if (res) this.getCartItems();
    })
  }

  getCartItems() {
    this.masterService.getCartProductsByCustomerId(this.loggedUserData.custId).subscribe((res:APIResponseModel) => {
      this.cartData = res.data;
    })
  }

  showCartPopup() {
    this.isCartPopuoOpen = !this.isCartPopuoOpen
  }

  logoff() {
    localStorage.removeItem(Constant.LOCAL_KEY);  
    this.loggedUserData = new Customer()
  }

  openRegisterModal() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = "block"
    }
  }

  closeRegisterModal() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = "none"
    }
  }

  openLoginModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = "block"
    }
  }

  closeLoginModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = "none"
    }
  }

  onRegister() {
    this.masterService.registerNewCustomer(this.registerObj).subscribe((res:APIResponseModel)=>{
      if (res.result) {
          alert("Registration Success");
          this.closeRegisterModal();
      } else {
        alert(res.message);
      }
    })
  }

  onLogin() {
    this.masterService.loginCustomer(this.loginObj).subscribe((res:APIResponseModel)=>{
      if (res.result) {
        this.loggedUserData = res.data;
        alert("success");
          localStorage.setItem(Constant.LOCAL_KEY,JSON.stringify(res.data))
          this.closeLoginModal();
      } else {
        console.log(res.message)
        alert(res.message);
      }
    })
  }

  onRemoveProduct(cartId:number) {
    this.masterService.deleteProductFromCartById(cartId).subscribe((res:APIResponseModel) => {
      if (res.result) {
        alert("Product Removed");
        this.getCartItems();
      } else {
        alert(res.message);
      }
    })
  }
}


