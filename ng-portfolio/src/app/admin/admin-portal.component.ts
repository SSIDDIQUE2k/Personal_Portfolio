import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, SiteContent } from '../core/content.service';
import { UploadService, UploadProgress } from '../core/upload.service';

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-portal.component.html',
  styleUrl: './admin-portal.component.scss'
})
export class AdminPortalComponent {
  step: 'login' | 'set-secret' | 'edit' = 'login';
  secret = '';
  confirm = '';
  content: SiteContent;
  saved = false;
  activeSection = 'overview';
  showDebugInfo = false;
  uploadProgress: UploadProgress = { progress: 0, uploading: false, completed: false };
  
  constructor(private contentSvc: ContentService, private uploadService: UploadService) {
    this.content = this.contentSvc.load();
    
    console.log('🔍 ADMIN: Loaded content with profile image:', this.content.profileImage);
    
    // Fix problematic image URLs if they exist
    if (this.content.profileImage?.includes('i.postimg.cc/SxvzV5DW') || 
        this.content.profileImage?.includes('postimg.cc/w3Sv9RTV') ||
        this.content.profileImage?.includes('i.postimg.cc/W1YZxTpJ')) {
      console.warn('Detected and fixing hardcoded profile image URL:', this.content.profileImage);
      this.content.profileImage = '/placeholder.svg';
      this.contentSvc.save(this.content); // Save the fix
      console.log('🔧 ADMIN: Fixed profile image URL to placeholder:', this.content.profileImage);
    }
    
    // Subscribe to upload progress
    this.uploadService.uploadProgress$.subscribe(progress => {
      this.uploadProgress = progress;
    });
    
    if (!this.contentSvc.hasSecret()) {
      this.step = 'set-secret';
    }
  }

  setSecret(): void {
    if (!this.secret || this.secret !== this.confirm) return;
    this.contentSvc.setSecret(this.secret);
    this.step = 'login';
    this.secret = this.confirm = '';
  }

  login(): void {
    if (this.contentSvc.validate(this.secret)) {
      this.step = 'edit';
      this.saved = false;
      this.secret = '';
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getProjectsCount(): number {
    return this.content.projects?.length || 0;
  }

  getSkillsCount(): number {
    return this.content.skillsTabs?.reduce((total, tab) => total + (tab.items?.length || 0), 0) || 0;
  }

  getLastUpdated(): string {
    const lastUpdate = localStorage.getItem('portfolio_last_update');
    if (lastUpdate) {
      const days = Math.floor((Date.now() - parseInt(lastUpdate)) / (1000 * 60 * 60 * 24));
      return days.toString();
    }
    return '0';
  }

  getPageTitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Dashboard';
      case 'personal': return 'Personal Information';
      case 'skills': return 'Skills & Technologies';
      case 'projects': return 'Portfolio Projects';
      case 'experience': return 'Work Experience';
      case 'education': return 'Education History';
      case 'services': return 'Services Offered';
      default: return 'Portfolio CMS';
    }
  }

  getPageSubtitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Content management overview and quick actions';
      case 'personal': return 'Update your personal details and contact information';
      case 'skills': return 'Manage your technical skills and proficiency levels';
      case 'projects': return 'Showcase your best work with descriptions and technologies';
      case 'experience': return 'Detail your professional work history and achievements';
      case 'education': return 'Add your educational background and certifications';
      case 'services': return 'List the professional services you provide to clients';
      default: return 'Manage your portfolio content';
    }
  }

  getPersonalCompleteness(): number {
    if (!this.content) return 0;
    let completed = 0;
    let total = 7;
    
    if (this.content.name) completed++;
    if (this.content.role) completed++;
    if (this.content.email) completed++;
    if (this.content.phone) completed++;
    if (this.content.bio) completed++;
    if (this.content.location) completed++;
    if (this.content.profileImage) completed++;
    
    return Math.round((completed / total) * 100);
  }

  getProjectsCompleteness(): number {
    if (!this.content.projects || this.content.projects.length === 0) return 0;
    
    let totalFields = 0;
    let completedFields = 0;
    
    this.content.projects.forEach(project => {
      totalFields += 6; // title, category, image, description, technologies, role
      if (project.title) completedFields++;
      if (project.category) completedFields++;
      if (project.image) completedFields++;
      if (project.detailsDescription) completedFields++;
      if (project.technologies) completedFields++;
      if (project.role) completedFields++;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }

  getSkillsCompleteness(): number {
    if (!this.content.skillsTabs || this.content.skillsTabs.length === 0) return 0;
    
    let totalFields = 0;
    let completedFields = 0;
    
    this.content.skillsTabs.forEach(category => {
      totalFields += 3; // title, subtitle, icon
      if (category.title) completedFields++;
      if (category.subtitle) completedFields++;
      if (category.icon) completedFields++;
      
      if (category.items) {
        category.items.forEach(skill => {
          totalFields += 2; // name, percent
          if (skill.name) completedFields++;
          if (skill.percent) completedFields++;
        });
      }
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }

  save(): void {
    console.log('💾 ADMIN: Saving content with profile image:', this.content.profileImage);
    this.contentSvc.save(this.content);
    localStorage.setItem('portfolio_last_update', Date.now().toString());
    
    // Update cache timestamp to force image refresh
    this.updateCacheTimestamp();
    
    // Verify save worked
    const savedContent = this.contentSvc.load();
    console.log('✅ ADMIN: Verified saved profile image:', savedContent.profileImage);
    
    // Force a storage event to notify other components
    setTimeout(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'siteContent',
        newValue: JSON.stringify(this.content),
        oldValue: null,
        storageArea: localStorage
      }));
      console.log('📡 ADMIN: Dispatched storage event to notify portfolio component');
    }, 100);
    
    this.saved = true;
    setTimeout(() => (this.saved = false), 3000);
  }

  private cacheTimestamp = Date.now();

  getProfileImageWithCache(): string {
    if (!this.content.profileImage) {
      return '/placeholder.svg'; // Use placeholder as default
    }
    
    // Check if the URL is valid before adding cache parameters
    const imageUrl = this.content.profileImage;
    
    // Only add cache-busting for external URLs that are working
    if (this.isValidImageUrl(imageUrl)) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}t=${this.cacheTimestamp}`;
    }
    
    // Return the URL without cache-busting if it might be problematic
    return imageUrl;
  }

  private isValidImageUrl(url: string): boolean {
    // Don't add cache-busting to URLs that might be problematic
    const problematicDomains = ['i.postimg.cc/SxvzV5DW', 'postimg.cc/w3Sv9RTV']; // Known broken URLs
    const isProblematicDomain = problematicDomains.some(domain => url.includes(domain));
    const isLocalFile = url.startsWith('file://');
    const isInvalidUrl = !this.isValidUrl(url);
    
    return !isProblematicDomain && !isLocalFile && !isInvalidUrl;
  }

  updateCacheTimestamp(): void {
    this.cacheTimestamp = Date.now();
  }

  onImageUrlChange(): void {
    this.showDebugInfo = true;
    console.log('Profile image URL changed to:', this.content.profileImage);
    
    // Check for local file paths which browsers don't allow
    if (this.content.profileImage && this.content.profileImage.startsWith('file://')) {
      console.error('❌ LOCAL FILE PATH detected! Browsers cannot load local files for security reasons.');
      alert('❌ Error: Local file paths (file://) cannot be used in web browsers for security reasons.\n\nPlease upload your image to an image hosting service like:\n• Imgur (imgur.com)\n• PostImage (postimg.cc)\n• Cloudinary\n• Or use a direct web URL (https://...)');
      
      // Reset to placeholder default
      this.content.profileImage = '/placeholder.svg';
      return;
    }
    
    // Update cache timestamp when image URL changes
    this.updateCacheTimestamp();
    
    // Check for unsupported image formats
    if (this.content.profileImage) {
      const url = this.content.profileImage.toLowerCase();
      const unsupportedFormats = ['.heic', '.heif'];
      const hasUnsupportedFormat = unsupportedFormats.some(format => url.includes(format));
      
      if (hasUnsupportedFormat) {
        console.warn('⚠️ UNSUPPORTED IMAGE FORMAT detected! Browsers may not display .heic, .heif files. Please use .jpg, .png, .gif, or .webp instead.');
        alert('⚠️ Warning: The image format you\'ve selected (.heic/.heif) may not be supported by all browsers. Please convert to .jpg, .png, .gif, or .webp for best compatibility.');
      }
      
      // Check for invalid URLs
      if (!this.isValidUrl(this.content.profileImage)) {
        console.warn('⚠️ Invalid URL format detected');
        alert('⚠️ Warning: Please enter a valid web URL starting with http:// or https://');
      }
    }
    
    setTimeout(() => {
      this.showDebugInfo = false;
    }, 5000);
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  testSave(): void {
    console.log('🧪 TEST SAVE - Starting test save process');
    console.log('🧪 Current profileImage value:', this.content.profileImage);
    
    // Ensure we have a valid image URL or use placeholder
    if (!this.content.profileImage || 
        this.content.profileImage.includes('i.postimg.cc/SxvzV5DW') ||
        this.content.profileImage.includes('postimg.cc/w3Sv9RTV') ||
        this.content.profileImage.includes('i.postimg.cc/W1YZxTpJ')) {
      this.content.profileImage = '/placeholder.svg';
      console.log('🧪 Using placeholder image URL:', this.content.profileImage);
    }
    
    // Save it
    this.save();
  }

  previewPortfolio(): void {
    window.open('/', '_blank');
  }

  exportData(): void {
    const dataStr = JSON.stringify(this.content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  backupContent(): void {
    const backup = {
      content: this.content,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };
    const backupStr = JSON.stringify(backup, null, 2);
    const backupBlob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(backupBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all content to defaults? This will erase all your current data.')) {
      localStorage.removeItem('siteContent');
      console.log('🔄 RESET: Cleared localStorage, reloading defaults...');
      this.content = this.contentSvc.load(); // This will load defaults
      console.log('🔄 RESET: New profile image URL:', this.content.profileImage);
      alert('Content has been reset to defaults.');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }

    console.log('📤 Uploading image:', file.name);
    this.uploadService.resetProgress();

    this.uploadService.uploadImage(file).subscribe({
      next: (response) => {
        console.log('✅ Upload successful:', response);
        this.content.profileImage = response.data.url;
        this.updateCacheTimestamp();
        this.save(); // Auto-save after successful upload
        alert('Image uploaded successfully!');
      },
      error: (error) => {
        console.error('❌ Upload failed:', error);
        alert('Upload failed: ' + (error.error?.message || 'Unknown error'));
        this.uploadService.resetProgress();
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImageFile') as HTMLInputElement;
    fileInput?.click();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Quick navigation shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 's':
          event.preventDefault();
          this.save();
          break;
        case 'p':
          event.preventDefault();
          this.previewPortfolio();
          break;
        case '1':
          event.preventDefault();
          this.setActiveSection('overview');
          break;
        case '2':
          event.preventDefault();
          this.setActiveSection('personal');
          break;
        case '3':
          event.preventDefault();
          this.setActiveSection('skills');
          break;
      }
    }
  }

  // Skills Management Methods
  addSkillCategory(): void {
    if (!this.content.skillsTabs) {
      this.content.skillsTabs = [];
    }
    this.content.skillsTabs.push({
      id: `category_${Date.now()}`,
      icon: 'uil uil-brackets-curly',
      title: 'New Category',
      subtitle: 'Experience level',
      items: []
    });
  }

  removeSkillCategory(index: number): void {
    if (this.content.skillsTabs && index >= 0 && index < this.content.skillsTabs.length) {
      this.content.skillsTabs.splice(index, 1);
    }
  }

  addSkill(categoryIndex: number): void {
    if (this.content.skillsTabs && this.content.skillsTabs[categoryIndex]) {
      if (!this.content.skillsTabs[categoryIndex].items) {
        this.content.skillsTabs[categoryIndex].items = [];
      }
      this.content.skillsTabs[categoryIndex].items.push({
        name: 'New Skill',
        percent: 50
      });
    }
  }

  removeSkill(categoryIndex: number, skillIndex: number): void {
    if (this.content.skillsTabs && 
        this.content.skillsTabs[categoryIndex] && 
        this.content.skillsTabs[categoryIndex].items &&
        skillIndex >= 0 && skillIndex < this.content.skillsTabs[categoryIndex].items.length) {
      this.content.skillsTabs[categoryIndex].items.splice(skillIndex, 1);
    }
  }

  // Projects Management Methods
  addProject(): void {
    if (!this.content.projects) {
      this.content.projects = [];
    }
    this.content.projects.push({
      title: 'New Project',
      category: 'web',
      image: '/placeholder.svg',
      detailsTitle: 'Project Details',
      detailsDescription: 'Description of the project...',
      created: new Date().toLocaleDateString(),
      technologies: 'html css javascript',
      role: 'developer',
      demoUrl: ''
    });
  }

  removeProject(index: number): void {
    if (this.content.projects && index >= 0 && index < this.content.projects.length) {
      this.content.projects.splice(index, 1);
    }
  }

  // Experience Management Methods
  addExperience(): void {
    if (!this.content.experience) {
      this.content.experience = [];
    }
    this.content.experience.push({
      title: 'Company Name',
      text: 'Job Title',
      date: 'Start - End'
    });
  }

  removeExperience(index: number): void {
    if (this.content.experience && index >= 0 && index < this.content.experience.length) {
      this.content.experience.splice(index, 1);
    }
  }

  // Education Management Methods
  addEducation(): void {
    if (!this.content.education) {
      this.content.education = [];
    }
    this.content.education.push({
      title: 'Institution Name',
      text: 'Degree/Certificate',
      date: 'Start - End'
    });
  }

  removeEducation(index: number): void {
    if (this.content.education && index >= 0 && index < this.content.education.length) {
      this.content.education.splice(index, 1);
    }
  }

  // Services Management Methods
  addService(): void {
    if (!this.content.services) {
      this.content.services = [];
    }
    this.content.services.push({
      icon: 'uil uil-web-grid',
      title: 'New Service',
      bullets: ['Service point 1', 'Service point 2']
    });
  }

  removeService(index: number): void {
    if (this.content.services && index >= 0 && index < this.content.services.length) {
      this.content.services.splice(index, 1);
    }
  }

  addBullet(serviceIndex: number): void {
    if (this.content.services && this.content.services[serviceIndex]) {
      if (!this.content.services[serviceIndex].bullets) {
        this.content.services[serviceIndex].bullets = [];
      }
      this.content.services[serviceIndex].bullets.push('New service point');
    }
  }

  removeBullet(serviceIndex: number, bulletIndex: number): void {
    if (this.content.services && 
        this.content.services[serviceIndex] && 
        this.content.services[serviceIndex].bullets &&
        bulletIndex >= 0 && bulletIndex < this.content.services[serviceIndex].bullets.length) {
      this.content.services[serviceIndex].bullets.splice(bulletIndex, 1);
    }
  }
}