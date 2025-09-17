import { Component, HostListener, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService, SiteContent, Project } from './core/content.service';
import { ContactComponent } from './sections/contact/contact.component';

interface ContactData {
  username: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'ng-portfolio';
  profile: SiteContent;
  scrolled = false;

  constructor(public router: Router, private contentService: ContentService) {
    // Load content from ContentService
    this.profile = this.contentService.load();
    
    // Listen for storage changes (when admin updates content)
    window.addEventListener('storage', (e) => {
      if (e.key === 'siteContent') {
        console.log('🔄 Content updated from admin panel, refreshing...');
        this.refreshContent();
      }
    });
  }

  refreshContent() {
    // Reload content from ContentService to reflect any admin changes
    this.profile = this.contentService.load();
    
    // Fix problematic image URLs if they exist
    if (this.profile.profileImage) {
      let needsUpdate = false;
      
      // Fix local file paths
      if (this.profile.profileImage.startsWith('file://')) {
        console.warn('Detected and fixing local file path in main app');
        this.profile.profileImage = '/placeholder.svg';
        needsUpdate = true;
      }
      // Fix known hardcoded URLs
      else if (this.profile.profileImage.includes('i.postimg.cc/SxvzV5DW') || 
               this.profile.profileImage.includes('postimg.cc/w3Sv9RTV') ||
               this.profile.profileImage.includes('i.postimg.cc/W1YZxTpJ')) {
        console.warn('Detected and fixing hardcoded profile image URL in main app:', this.profile.profileImage);
        this.profile.profileImage = '/placeholder.svg';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        this.contentService.save(this.profile); // Save the fix
      }
    }
    
    console.log('Content refreshed, profile image:', this.profile.profileImage);
  }

  // Navigation and UI state
  sidebarOpen = false;
  activeSection = 'home';
  activeSkillTab = 'frontend';
  activeWorkFilter = 'all';
  activeServiceModal: number | null = null;
  portfolioPopupOpen = false;
  selectedProject: Project | null = null;

  // Contact form data
  contactData: ContactData = {
    username: '',
    email: '',
    phone: '',
    message: ''
  };

  // Portfolio projects - now using data from ContentService
  get projects(): Project[] {
    return this.profile.projects || [];
  }

  get filteredProjects(): Project[] {
    if (this.activeWorkFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(project => project.category === this.activeWorkFilter);
  }

  @ViewChild('testimonialsSwiper') testimonialsSwiper!: ElementRef;
  @ViewChild('workContainer') workContainer!: ElementRef;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 8;
    this.updateActiveSection();
  }

  ngAfterViewInit() {
    this.initializeSwiper();
    this.initializeScrollListeners();
    this.initializeScrollAnimations();
    this.initCounterAnimations();
  }

  initCounterAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number');
          counters.forEach((counter: any) => {
            const target = parseInt(counter.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              counter.textContent = Math.floor(current).toString();
            }, 30);
          });
          observer.unobserve(entry.target);
        }
      });
    });

    const aboutSection = document.querySelector('.about.section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }
  }

  ngOnDestroy() {
    // Clean up any subscriptions or listeners
  }

  // Navigation methods
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.closeSidebar();
  }

  // Skills tab methods
  setActiveSkillTab(tab: string) {
    this.activeSkillTab = tab;
  }

  // Work filter methods
  setWorkFilter(filter: string) {
    this.activeWorkFilter = filter;
    // filteredProjects is now a getter that automatically updates based on activeWorkFilter
  }

  // Portfolio popup methods
  openPortfolioPopup(project: Project) {
    this.selectedProject = project;
    this.portfolioPopupOpen = true;
  }

  closePortfolioPopup() {
    this.portfolioPopupOpen = false;
    this.selectedProject = null;
  }

  // Service modal methods
  openServiceModal(index: number) {
    this.activeServiceModal = index;
  }

  closeServiceModal() {
    this.activeServiceModal = null;
  }

  // Contact form methods
  onInputFocus(event: Event) {
    const target = event.target as HTMLInputElement;
    const parent = target.parentNode as HTMLElement;
    parent.classList.add('focus');
  }

  onInputBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    const parent = target.parentNode as HTMLElement;
    if (target.value === '') {
      parent.classList.remove('focus');
    }
  }

  onSubmitContactForm() {
    console.log('Contact form submitted:', this.contactData);
    // Handle form submission here
    // Reset form
    this.contactData = {
      username: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  private initializeSwiper() {
    // Swiper will be initialized via CDN script in index.html
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Swiper) {
        new (window as any).Swiper('.testimonials-container', {
          spaceBetween: 24,
          loop: true,
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 48,
            },
          },
        });
      }
    }, 1000);
  }

  private initializeScrollListeners() {
    // Initialize scroll-based section highlighting
    this.updateActiveSection();
  }

  private updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.clientHeight;
      const sectionTop = (current as HTMLElement).offsetTop - 50;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        this.activeSection = sectionId || 'home';
      }
    });
  }

  private initializeScrollAnimations() {
    // Enhanced Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          
          // Add staggered animation for children
          const children = entry.target.querySelectorAll('.stagger-animation');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Enhanced section observer for larger elements
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Observe all sections and elements for animation
    setTimeout(() => {
      const elementsToAnimate = document.querySelectorAll('.about-box, .work-card, .services-content, .testimonial-card, .timeline-item, .skills-data');
      elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });

      // Observe main sections
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        section.classList.add('section-reveal');
        sectionObserver.observe(section);
      });
    }, 100);

    // Add enhanced animations
    this.addFloatingAnimation();
    this.addParallaxEffect();
    this.addScrollIndicator();
    this.addCustomCursor();
  }

  private addFloatingAnimation() {
    const icons = document.querySelectorAll('.info-icon, .about-icon, .services-icon');
    icons.forEach((icon, index) => {
      (icon as HTMLElement).style.animation = `float 3s ease-in-out infinite`;
      (icon as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });
  }

  private addParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1); // Different speeds for different elements
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });

      // Update scroll indicator
      const scrollIndicator = document.querySelector('.scroll-indicator') as HTMLElement;
      if (scrollIndicator) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height);
        scrollIndicator.style.transform = `scaleX(${scrolled})`;
      }
    });
  }

  private addScrollIndicator() {
    // Create scroll progress indicator
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
  }

  private addCustomCursor() {
    // Only add on desktop
    if (window.innerWidth > 768) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      
      const outline = document.createElement('div');
      outline.className = 'cursor-outline';
      
      cursor.appendChild(dot);
      cursor.appendChild(outline);
      document.body.appendChild(cursor);

      // Mouse movement handler
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      // Interactive elements hover
      const interactiveElements = document.querySelectorAll('a, button, .interactive-element');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hover');
          outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover');
          outline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
      });
    }
  }

  // Helper methods for skills
  getFrontendSkills() {
    const frontendTab = this.profile.skillsTabs?.find(tab => tab.id === 'frontend');
    return frontendTab?.items || [];
  }

  getDesignSkills() {
    const designTab = this.profile.skillsTabs?.find(tab => tab.id === 'design');
    return designTab?.items || [];
  }

  getBackendSkills() {
    const backendTab = this.profile.skillsTabs?.find(tab => tab.id === 'backend');
    return backendTab?.items || [];
  }

  // Check if user has uploaded a custom image (not default/uploaded ones)
  hasCustomImage(): boolean {
    // Return true to show profile images
    return true;
  }

  getProfileImageWithFallback(): string {
    if (this.profile.profileImage && this.profile.profileImage.trim() !== '' && this.profile.profileImage !== '/placeholder.svg') {
      return this.profile.profileImage;
    }
    return '/placeholder.svg';
  }

  // Dynamic background system
  getBackgroundStyle(): any {
    if (this.profile.backgroundImage && this.profile.backgroundImage.trim() !== '') {
      return {
        'background-image': `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${this.profile.backgroundImage}')`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-attachment': 'fixed'
      };
    }
    return {
      'background': '#000000'
    };
  }

}