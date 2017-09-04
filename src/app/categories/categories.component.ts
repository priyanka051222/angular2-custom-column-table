import { Column } from './types';
import { Category } from './category';
import { CategoriesService } from './categories.service';
import { Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  /**
   * Creates an instance of CategoriesComponent.
   * @param {CategoriesService} categoriesService
   * @memberof CategoriesComponent
   */
  constructor(private categoriesService: CategoriesService) { }
  @Input() noOfColumnsShow: number;
  lastColumn: number;
  firstColumn: number;
  model: any[] = [];
  columns: Column[] = [];
  columnsSelected: Column[] = [];
  columnsToShow: Column[] = [] ;
  private categories: Category[];
  /**
   *
   *
   * @memberof CategoriesComponent
   */
  ngOnInit() {
    this.categoriesService.getCategories().then((resp) => {
      this.categories = resp;
      for (let i = 0; i < Object.keys(resp[0]).length; i++) {
        const column = {
          id: i,
          label : Object.keys(resp[0])[i]
        };
        this.columns.push(column);
      }
      this.columnsToShow =  this.columns.slice(0, this.noOfColumnsShow);
      for (let i = 0; i < this.columnsToShow.length; i++) {
        this.model.push(this.columnsToShow[i].id);
      }
      this.columnsSelected = [...this.columnsSelected, ...this.columnsToShow];
      this.lastColumn = this.noOfColumnsShow - 1;
      this.firstColumn = 0;
     });
  }


  /**
   *
   *
   * @memberof CategoriesComponent
   */
  loadMore() {
    this.categoriesService.getCategories().then((resp) => {
      this.categories = [...this.categories, ...resp];
    });
  }

  /**
   *
   *
   * @memberof CategoriesComponent
   */
  shiftColumnLeft() {
    if (this.firstColumn !== 0) {
      this.firstColumn--;
      this.columnsToShow.unshift(this.columnsSelected[this.firstColumn]);
      this.columnsToShow.splice(this.noOfColumnsShow, 1);
      this.lastColumn--;
    }
  }

  /**
   *
   *
   * @memberof CategoriesComponent
   */
  shiftColumnRight() {
    if (this.lastColumn !== this.columnsSelected.length - 1) {
      this.lastColumn++;
     this.columnsToShow.push(this.columnsSelected[this.lastColumn]);
      this.columnsToShow.splice(0, 1);
      this.firstColumn++;
    }
  }

 /**
  *
  *
  * @param {any} idToRemove
  * @memberof CategoriesComponent
  */
 removeColumn(idToRemove) {
  this.columnsSelected.filter((item , index) => {
      if (item.id === idToRemove) {
        this.columnsSelected.splice(index, 1);
      }
  });
  this.updateColumnToShow();
 }

 /**
  *
  *
  * @memberof CategoriesComponent
  */
 updateColumnToShow() {
    this.columnsToShow = [];
    for (let i = 0; i < this.noOfColumnsShow; i++) {
      if (i < this.columnsSelected.length) {
        this.columnsToShow.push(this.columnsSelected[i]);
      }
   }
  this.lastColumn = this.noOfColumnsShow - 1;
  this.firstColumn = 0;
 }

 /**
  *
  *
  * @param {any} idToAdd
  * @memberof CategoriesComponent
  */
 addColumn(idToAdd) {
  this.columns.filter((item , index) => {
    if (item.id === idToAdd) {
      this.columnsSelected.push(item);
      if (this.columnsToShow.length !== Number(this.noOfColumnsShow)) {
        this.columnsToShow.push(item);
      }
    }
});
 }

}
