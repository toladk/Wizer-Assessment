import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryForm!: FormGroup;

  CategoryList: any[] = [];
  CategoryListTemp: any[] = [];

  isSpinning = false;
  sortingCategory!: string;
  deleteCategoryDetails: any;
  visible = false;
  isSpinningSub = false;
  categoryDetails: any;
  visible2 = false;
  updateCategoryDetails: any;
  categoryId: any;

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      isFavorite: ['', Validators.required],
    });

    this.getCategory();
  }

  close(): void{
    this.visible = false;
  }
  close2(): void{
    this.visible2 = false;
  }

  searchCategory(): void{
    if (this.sortingCategory !== ''){
      this.CategoryListTemp = this.CategoryList.filter(res => {
        return res.name.toLocaleLowerCase().match(this.sortingCategory.toLocaleLowerCase())
      });
    } else {
      this.CategoryListTemp = this.CategoryList;
    }
  }

  async getCategory(): Promise<void>{
    try{
      this.isSpinning = true;
      await this.mainService.getCategory().toPromise().then((result : any) => {
        this.CategoryList = result;
        this.CategoryListTemp = this.CategoryList;
        this.isSpinning = false;
      })
    } catch (error: any){
      this.notification.error('Category', error.error.msg);
      this.isSpinning = false;
    }
  }

  async deleteCategory(id: any): Promise<void>{
    try{
      this.isSpinning = true;
      await this.mainService.deleteCategory(id).toPromise().then((result : any) => {
        this.deleteCategoryDetails = result;
        this.notification.success('Category', 'Category Deleted Successfully !!')
        this.isSpinning = false;
        this.getCategory();
      })
    } catch (error: any){
      this.notification.error('Category', error.error.msg);
      this.isSpinning = false;
    }
  }

  addCategory(): void{
    this.visible = true;
  }
  submitCategory(): void{
    delete this.categoryForm.value.id;
    this.categoryForm.value.isFavorite = JSON.parse(this.categoryForm.value.isFavorite);
    this.isSpinningSub = true;
    this.mainService.addCategory(this.categoryForm.value).subscribe((result : any) => {
      this.categoryDetails = result;
      this.notification.success('Category', 'Category Created Successfully !!')
      this.isSpinningSub = false;
      this.getCategory();
      this.visible = false;
      this.categoryForm.reset()
    }, error => {
      this.notification.error('Category', error.error.msg)
      this.isSpinningSub = false;
    })
  }

  editCategory(id: any): void{
    this.visible2 = true;
    this.isSpinningSub = true;
    this.categoryId = id;
    this.mainService.getCategoryById(id).subscribe((result: any) => {
      this.categoryForm.patchValue({...result});
      this.isSpinningSub = false;
    }, error => {
      this.notification.error('Category Details', error.error.msg)
      this.isSpinningSub = false;
    })
  }
  submitCategoryEdit(): void{
    this.isSpinningSub = true;
    this.categoryForm.value.id = Number(this.categoryId);
    this.categoryForm.value.isFavorite = JSON.parse(this.categoryForm.value.isFavorite);
    this.mainService.updateCategory(this.categoryForm.value).subscribe((result: any) => {
      this.updateCategoryDetails = result;
      this.notification.success('Category', 'Category Updated Successfully !!')
      this.isSpinningSub = false;
      this.getCategory();
      this.visible2 = false;
      this.categoryForm.reset()
    }, error => {
      this.notification.error('Category', error.error.msg)
      this.isSpinningSub = false;
    })
  }

}
