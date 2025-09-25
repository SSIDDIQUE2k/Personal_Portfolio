import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import mixitup from 'mixitup';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import { ContentService, SiteContent } from '../core/content.service';

@Component({
  selector: 'app-modern-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-portfolio.component.html',
  styleUrl: './modern-portfolio.component.scss'
})
export class ModernPortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private mixer?: any;
  private swiper?: Swiper;
  c: SiteContent;
  private lastUpdated: number = Date.now();

  constructor(private content: ContentService, private cdr: ChangeDetectorRef) {
    this.c = this.content.load();
  }

  ngOnInit(): void {
    // Reload content data whenever the component initializes
    this.loadContent();
    
    // Listen for storage changes to update content in real-time
    window.addEventListener('storage', this.handleStorageChange);
    
    // Check for changes less frequently (for same-tab updates)
    setInterval(() => {
      this.loadContent();
    }, 10000); // Reduced from 2s to 10s
  }

  private loadContent(): void {
    const newContent = this.content.load();
    // Only update if content has actually changed (optimized comparison)
    if (this.hasContentChanged(this.c, newContent)) {
      console.log('Portfolio content updated, old image:', this.c.profileImage);
      console.log('Portfolio content updated, new image:', newContent.profileImage);
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.c = newContent;
        this.lastUpdated = Date.now();
        this.cdr.detectChanges();
        // Re-wire interactive elements that depend on DOM
        this.initServicesModals();
      }, 0);
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'siteContent') {
      this.loadContent();
    }
  };

  ngAfterViewInit(): void {
    // Replace logo initial if needed
    const initial = this.c.name?.charAt(0)?.toUpperCase() || 'M';
    const logo = document.querySelector<HTMLElement>('[data-content="logo-initial"]');
    if (logo) logo.innerText = initial;
    // Sidebar toggle
    const navMenu = document.getElementById('sidebar');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    navToggle?.addEventListener('click', () => navMenu?.classList.add('show-sidebar'));
    navClose?.addEventListener('click', () => navMenu?.classList.remove('show-sidebar'));

    // Skills tabs
    document.querySelectorAll<HTMLElement>('[data-target]').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetSel = tab.dataset['target']!;
        const target = document.querySelector<HTMLElement>(targetSel);
        document.querySelectorAll<HTMLElement>('[data-content]').forEach(el => el.classList.remove('skills-active'));
        target?.classList.add('skills-active');
        document.querySelectorAll<HTMLElement>('.skills-header').forEach(el => el.classList.remove('skills-active'));
        tab.classList.add('skills-active');
      });
    });

    // MixItUp filter
    const container = document.querySelector('.work-container') as HTMLElement | null;
    if (container) {
      this.mixer = mixitup(container, {
        selectors: { target: '.work-card' },
        animation: { duration: 300 }
      });
    }

    // Active filter link
    document.querySelectorAll<HTMLElement>('.work-item').forEach(el => {
      el.addEventListener('click', function() {
        document.querySelectorAll('.work-item').forEach(l => l.classList.remove('active-work'));
        this.classList.add('active-work');
      });
    });

    // Portfolio popup
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('work-button')) {
        this.togglePortfolioPopup();
        const parent = target.closest('.work-card') as HTMLElement | null;
        if (parent) this.portfolioItemDetails(parent);
      }
    });
    document.querySelector('.portfolio-popup-close')?.addEventListener('click', () => this.togglePortfolioPopup());

    // Swiper testimonials
    const swiperEl = document.querySelector('.testimonials-container');
    if (swiperEl) {
      this.swiper = new Swiper(swiperEl as HTMLElement, {
        modules: [Pagination],
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 2, spaceBetween: 48 } },
      });
    }

    // Input label animation
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.input').forEach(input => {
      const parent = input.parentElement;
      input.addEventListener('focus', () => parent?.classList.add('focus'));
      input.addEventListener('blur', () => { if (!input.value) parent?.classList.remove('focus'); });
    });

    // Services modals (open/close)
    this.initServicesModals();

    // Active nav link on scroll
    window.addEventListener('scroll', this.navHighlighter);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.navHighlighter);
    window.removeEventListener('storage', this.handleStorageChange);
    this.mixer?.destroy();
    this.swiper?.destroy(true, true);
  }

  private togglePortfolioPopup() {
    document.querySelector('.portfolio-popup')?.classList.toggle('open');
  }

  private initServicesModals() {
    // Close any open modal first
    document.querySelectorAll<HTMLElement>('.services-modal').forEach(modal => modal.classList.remove('active-modal'));

    // Wire up each service card's button and modal
    document.querySelectorAll<HTMLElement>('.services-content').forEach(card => {
      const btn = card.querySelector<HTMLElement>('.services-button');
      const modal = card.querySelector<HTMLElement>('.services-modal');
      const close = card.querySelector<HTMLElement>('.services-modal-close');

      btn?.addEventListener('click', () => modal?.classList.add('active-modal'));
      close?.addEventListener('click', () => modal?.classList.remove('active-modal'));
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active-modal');
      });
    });
  }

  private portfolioItemDetails(portfolioItem: HTMLElement) {
    const thumb = document.querySelector<HTMLImageElement>('.pp-thumbnail img');
    const img = portfolioItem.querySelector<HTMLImageElement>('.work-img');
    if (thumb && img) thumb.src = img.src;
    const title = portfolioItem.querySelector<HTMLElement>('.work-title')?.innerHTML || '';
    const body = portfolioItem.querySelector<HTMLElement>('.portfolio-item-details')?.innerHTML || '';
    const subtitleSpan = document.querySelector<HTMLElement>('.portfolio-popup-subtitle span');
    const bodyContainer = document.querySelector<HTMLElement>('.portfolio-popup-body');
    if (subtitleSpan) subtitleSpan.innerHTML = title;
    if (bodyContainer) bodyContainer.innerHTML = body;
  }

  private navHighlighter = () => {
    const scrollY = window.pageYOffset;
    document.querySelectorAll<HTMLElement>('section[id]').forEach(section => {
      const height = section.offsetHeight;
      const top = section.offsetTop - 50;
      const id = section.getAttribute('id');
      const link = document.querySelector<HTMLElement>(`.nav-menu a[href*=${id}]`);
      if (!link) return;
      if (scrollY > top && scrollY <= top + height) link.classList.add('active-link');
      else link.classList.remove('active-link');
    });
  };

  getProfileImageUrl(): string {
    if (!this.c.profileImage || this.c.profileImage.trim() === '' || this.c.profileImage === '/placeholder.svg') {
      return '/placeholder.svg';
    }
    
    // Check for any problematic URLs and reset them
    if (this.c.profileImage.includes('i.postimg.cc/SxvzV5DW') || 
        this.c.profileImage.includes('postimg.cc/w3Sv9RTV') ||
        this.c.profileImage.includes('i.postimg.cc/W1YZxTpJ') ||
        this.c.profileImage.startsWith('file://')) {
      console.warn('Detected and fixing problematic image URL:', this.c.profileImage);
      return '/placeholder.svg';
    }
    
    // Add timestamp to bust cache when image changes (using lastUpdated for stability)
    const separator = this.c.profileImage.includes('?') ? '&' : '?';
    return `${this.c.profileImage}${separator}t=${this.lastUpdated}`;
  }

  forceReload(): void {
    console.log('Manual reload triggered');
    this.loadContent();
    console.log('Current content after manual reload:', this.c);
  }

  private hasContentChanged(oldContent: SiteContent, newContent: SiteContent): boolean {
    // Fast comparison of key fields instead of full JSON stringify
    return oldContent.name !== newContent.name ||
           oldContent.title !== newContent.title ||
           oldContent.profileImage !== newContent.profileImage ||
           oldContent.about !== newContent.about ||
           oldContent.skills?.length !== newContent.skills?.length ||
           oldContent.projects?.length !== newContent.projects?.length;
  }
}
