import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  bookForm!: FormGroup;

  bookList: any[] = [];
  bookListTemp: any[] = [];

  isSpinning = false;
  sortingBook!: string;
  deleteBookDetails: any;
  visible = false;
  isSpinningSub = false;
  bookDetails: any;
  bookId: any;
  visible2 = false;
  updateBookDetails: any;

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      favorite: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.getBooks();
  }

  close(): void{
    this.visible = false;
  }
  close2(): void{
    this.visible2 = false;
  }

  searchBook(): void{
    if (this.sortingBook !== ''){
      this.bookListTemp = this.bookList.filter(res => {
        return res.name.toLocaleLowerCase().match(this.sortingBook.toLocaleLowerCase()) ||
        res.description.toLocaleLowerCase().match(this.sortingBook.toLocaleLowerCase())
      });
    } else {
      this.bookListTemp = this.bookList;
    }
  }

  async getBooks(): Promise<void>{
    try{
      this.isSpinning = true;
      await this.mainService.getBooks().toPromise().then((result : any) => {
        this.bookList = result;
        this.bookListTemp = this.bookList;
        this.isSpinning = false;
      })
    } catch (error: any){
      this.notification.error('Book', error.error.msg);
      this.isSpinning = false;
    }
  }

  selectBookType(e: any): void{
    if (e.target.value === 'all') {
      this.getBooks();
    } else {
      this.isSpinning = true;
      this.mainService.getBooks().subscribe((result : any) => {
        this.bookList = result.filter((data: { favorite: boolean; }) => data.favorite === true);
        this.bookListTemp = this.bookList;
        this.isSpinning = false;
      }, error => {
        this.notification.error('Book', error.error.msg);
        this.isSpinning = false;
      })
    }
  }

  async deleteBook(id: any): Promise<void>{
    try{
      this.isSpinning = true;
      await this.mainService.deleteBook(id).toPromise().then((result : any) => {
        this.deleteBookDetails = result;
        this.notification.success('Book', 'Books Deleted Successfully !!')
        this.isSpinning = false;
        this.getBooks();
      })
    } catch (error: any){
      this.notification.error('Book', error.error.msg);
      this.isSpinning = false;
    }
  }

  addBook(): void{
    this.visible = true;
  }
  submitBook(): void{
    this.isSpinningSub = true;
    delete this.bookForm.value.id;
    this.bookForm.value.favorite = JSON.parse(this.bookForm.value.favorite);
    this.mainService.addBook(this.bookForm.value).subscribe((result : any) => {
      this.bookDetails = result;
      this.notification.success('Book', 'Book Created Successfully !!')
      this.isSpinningSub = false;
      this.getBooks();
      this.visible = false;
      this.bookForm.reset();
    }, error => {
      this.notification.error('Book', error.error.msg)
      this.isSpinningSub = false;
    })
  }

  editBook(id: any): void{
    this.visible2 = true;
    this.isSpinningSub = true;
    this.bookId = id;
    this.mainService.getBookById(id).subscribe((result: any) => {
      this.bookForm.patchValue({...result});
      this.isSpinningSub = false;
    }, error => {
      this.notification.error('Book Details', error.error.msg)
      this.isSpinningSub = false;
    })
  }
  submitBookEdit(): void{
    this.isSpinningSub = true;
    this.bookForm.value.id = Number(this.bookId);
    this.bookForm.value.favorite = JSON.parse(this.bookForm.value.favorite);
    this.mainService.updateCategory(this.bookForm.value).subscribe((result: any) => {
      this.updateBookDetails = result;
      this.notification.success('Book', 'Book Updated Successfully !!')
      this.isSpinningSub = false;
      this.getBooks();
      this.visible2 = false;
      this.bookForm.reset()
    }, error => {
      this.notification.error('Book', error.error.msg)
      this.isSpinningSub = false;
    })
  }

}
