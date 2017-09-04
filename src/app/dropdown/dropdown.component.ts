import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MultiSelectSearchFilter } from './search-filter.pipe';
import { MultiSelectOption, MultiSelectTexts } from './types';


/**
 *
 *
 * @export
 * @class MultiselectDropdown
 * @implements {OnInit}
 * @implements {OnChanges}
 * @implements {DoCheck}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [MultiSelectSearchFilter]
})
export class MultiselectDropdownComponent implements OnInit, OnChanges, DoCheck, OnDestroy {

  filteredCount = { count: 0 };
  filterControl: '';

  /**
   *
   *
   * @type {Array<MultiSelectOption>}
   * @memberof MultiselectDropdown
   */
  @Input() options: Array<MultiSelectOption>;
  @Input() model: any[];
  @Input() texts: MultiSelectTexts;
  @Input() disabledSelection: Boolean = false;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownOpened = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();

  destroyed$ = new Subject<any>(); 
  parents: any[];
  title: string[];
  differ: any;
  numSelected: Number = 0;
      renderItems = true;
      defaultTexts: MultiSelectTexts = {
      checked: 'checked',
      checkedPlural: 'checked',
      searchPlaceholder: 'Search...',
      searchEmptyResult: 'Nothing found...',
      defaultTitle: 'Select',
      allSelected: 'All selected',
    };
    private _isVisible = false;
    private _hideMe = true;
  /**
   *
   *
   * @param {HTMLElement} target
   * @returns
   * @memberof MultiselectDropdown
   */
  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.isVisible) {
      return;
    }
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.dropdownClosed.emit();
    }
  }


  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  set isVisible(val: boolean) {
    this._isVisible = val;
  }

  /**
   *
   *
   * @readonly
   * @memberof MultiselectDropdown
   */
  get isVisible() {
    return this._isVisible;
  }
  /**
   * Creates an instance of MultiselectDropdown.
   * @param {ElementRef} element
   * @param {MultiSelectSearchFilter} searchFilter
   * @param {IterableDiffers} differs
   * @memberof MultiselectDropdown
   */
  constructor(private element: ElementRef,
    private searchFilter: MultiSelectSearchFilter,
    differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
    this.texts = this.defaultTexts;
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  ngOnInit() {
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = [this.texts.defaultTitle] || [''];
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof MultiselectDropdown
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.options = this.options || [];
      if (this.texts) {
        this.updateTitle();
      }
    }
    if (changes['texts'] && !changes['texts'].isFirstChange()) {
      this.updateTitle();
    }
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  ngOnDestroy() {
    this.destroyed$.next();
  }

  /**
   *
   *
   * @param {any} text
   * @returns
   * @memberof MultiselectDropdown
   */
  showRemoveButton(text) {
    return this.options.filter((option: MultiSelectOption) => {
      return option.label === text;
    }).length > 0;
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  /**
   *
   *
   * @param {Event} event
   * @memberof MultiselectDropdown
   */
  clearSearch(event: Event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.filterControl = '';
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  toggleDropdown() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
  }

  /**
   *
   *
   * @param {MultiSelectOption} option
   * @returns {boolean}
   * @memberof MultiselectDropdown
   */
  isSelected(option: MultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.id) > -1;
  }

  /**
   *
   * @param {Event} _event
   * @param {MultiSelectOption} option
   * @memberof MultiselectDropdown
   */
  setSelected(_event: Event, option: MultiSelectOption) {
    if (!this.disabledSelection) {
      if (_event.stopPropagation) {
        _event.stopPropagation();
      }
      const index = this.model.indexOf(option.id);
      if (index > -1) {
        this.model.splice(index, 1);
        this.onRemoved.emit(option.id);

      } else {
        this.model.push(option.id);
        this.onAdded.emit(option.id);

      }
      this.model = this.model.slice();
    }
    this.toggleDropdown();
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  updateNumSelected() {
    this.numSelected = this.model.length || 0;
  }

  /**
   *
   *
   * @memberof MultiselectDropdown
   */
  updateTitle() {
    this.title = [];
    if (this.numSelected === 0) {
      this.title = (this.texts) ? [this.texts.defaultTitle] : [''];
    } else if (this.model.length === this.options.length) {
      this.title = (this.texts) ? [this.texts.allSelected] : [''];
    } else if (3 >= this.numSelected) {
      this.options.filter((option: MultiSelectOption) => this.model.indexOf(option.id) > -1)
        .map((option: MultiSelectOption) => this.title.push(option.label));
    } else {
      this.title = [this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural)];
    }
  }

  /**
   *
   *
   * @param {Event} event
   * @param {MultiSelectOption} option
   * @memberof MultiselectDropdown
   */
  preventCheckboxCheck(event: Event, option: MultiSelectOption) {
    if (this.model.indexOf(option.id) === -1 &&
      event.preventDefault
    ) {
      event.preventDefault();
    }
  }
}
