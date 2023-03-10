import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyMessageType, AlertifyPosition, AlertifyService, } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void { }

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Drag or select the files...",
    isAdminPage: true,
    accept: ".png,.jpg,.jpeg,.json"
  }

  create(
    name: HTMLInputElement,
    stock: HTMLInputElement,
    price: HTMLInputElement
  ) {
    this.showSpinner(SpinnerType.BallAtom);
    const create_product: Create_Product = new Create_Product();
    create_product.name = name.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);

    if (!name.value) {
      this.alertify.message("Please enter the product name!", {
        dismissOthers: true,
        messageType: AlertifyMessageType.Warning,
        position: AlertifyPosition.TopRight
      });
      return;
    }

    if (parseInt(stock.value) < 0) {
      this.alertify.message("Please enter the stock amount!", {
        dismissOthers: true,
        messageType: AlertifyMessageType.Warning,
        position: AlertifyPosition.TopRight
      });
      return;
    }

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("The product has been successfully added.", {
        dismissOthers: true,
        messageType: AlertifyMessageType.Success,
        position: AlertifyPosition.TopRight
      });
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: AlertifyMessageType.Error,
        position: AlertifyPosition.TopRight
      })
    })
  }
}
