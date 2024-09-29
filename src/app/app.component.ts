import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileLoaderService } from './services/file-loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type Category = 'actions' | 'caracteres' | 'lieux' | 'professions' | 'repliques';
const allCategories: Category[] = ['actions', 'caracteres', 'lieux', 'professions', 'repliques'];

const labels: { [key in Category]: string } = {
  actions: 'ACTION',
  caracteres: 'CARACTÈRE',
  lieux: 'LIEU',
  professions: 'PROFESSION',
  repliques: 'RÉPLIQUE'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  data: {
    actions: string[],
    caracteres: string[],
    lieux: string[],
    professions: string[],
    repliques: string[]
  } = {
    actions: [],
    caracteres: [],
    lieux: [],
    professions: [],
    repliques: []
  };
  selection: {
    actions: string,
    caracteres: string,
    lieux: string,
    professions: string,
    repliques: string
  } = {
    actions: '',
    caracteres: '',
    lieux: '',
    professions: '',
    repliques: ''
  };
  categories = allCategories;
  private destroy$ = new Subject<void>();
  isLoading = true;
  error: string | null = null;
  selectedCategories: Category[] = [];
  isEmpty: boolean = true;
  cssShake: string = '';

  constructor(private fileLoaderService: FileLoaderService) { }

  ngOnInit(): void {
    this.fileLoaderService.loadFiles().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([actionsArray, caracteresArray, lieuxArray, professionsArray, repliquesArray]) => {
        this.data = {
          actions: actionsArray,
          caracteres: caracteresArray,
          lieux: lieuxArray,
          professions: professionsArray,
          repliques: repliquesArray
        };
        this.isLoading = false;
        
      },
      error: (err) => {
        this.error = 'Error loading files. Please try again later.';
        this.isLoading = false;
        console.error('Error loading files:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reset(): void{
    this.selectedCategories = [];
    this.clearCategories();
  }

  selectCategory(category: Category): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(item => item !== category);
      // this.selection[category] = '';
    } else {
      this.selectedCategories.push(category);
    }
    this.selectedCategories.sort();
  }

  isCategorySelected(category: Category): string {
    if (this.selectedCategories.includes(category)) {
      return 'selected';
    }
    return '';
  }

  clearCategories(): void {
    allCategories.forEach((category) => {
      this.selection[category] = '';
    });
  }

  shake() {
    this.cssShake = 'shake';
    setTimeout(() => {
      this.cssShake = '';
    }, 400);
  }

  draw(): void {
    if (this.selectedCategories.length == 0) {
      this.isEmpty = true;
      this.shake();
      return;
    }
    this.isEmpty = false;
    this.clearCategories();    
    
    this.selectedCategories.forEach((category) => {
      let items = [...this.data[category]];      
      items = this.shuffleArray(items);
      this.selection[category] = items[0];
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  getCategoryLabel(category: Category): string {
    return labels[category];
  }
}
