import { Injectable } from '@angular/core';

export type SkillItem = { name: string; percent: number };
export type SkillTab = { id: string; icon: string; title: string; subtitle: string; items: SkillItem[] };
export type TimelineItem = { title: string; text: string; date: string };
export type Project = { title: string; category: 'web'|'app'|'design'; image: string; detailsTitle: string; detailsDescription: string; created: string; technologies: string; role: string; demoUrl?: string };
export type Service = { icon: string; title: string; bullets: string[] };
export type Testimonial = { quote: string; date: string; image: string; name: string; role: string };

export type SiteContent = {
  name: string;
  role: string;
  location: string;
  bio: string;
  profileImage: string;
  backgroundImage: string;
  email: string;
  phone: string;
  messenger: string;
  socials: { facebook?: string; instagram?: string; twitter?: string; github?: string; linkedin?: string; youtube?: string };
  about: {
    title: string;
    description: string;
    experienceYears: string;
    projectsCompleted: string;
    supportAvailability: string;
  };
  skillsTabs: SkillTab[];
  education: TimelineItem[];
  experience: TimelineItem[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
};

const DEFAULTS: SiteContent = {
  name: 'Your Name',
  role: 'Software Engineer / AWS Practitioner',
  location: 'City, Country',
  bio: 'I build modern, scalable applications with a focus on performance and delightful user experiences.',
  profileImage: '',
  backgroundImage: '',
  email: 'user@gmail.com',
  phone: '999-888-777',
  messenger: 'user.fb123',
  about: {
    title: 'Hi, I\'m Your Name',
    description: 'I build modern, scalable applications with a focus on performance and delightful user experiences. I specialize in full-stack development and cloud technologies.',
    experienceYears: '5+',
    projectsCompleted: '50+',
    supportAvailability: 'Online 24/7'
  },
  socials: {
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    twitter: 'https://www.x.com',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/'
  },
  skillsTabs: [
    { id: 'frontend', icon: 'uil uil-brackets-curly', title: 'Frontend Developer', subtitle: 'More than 4 years', items: [
      { name: 'HTML', percent: 90 }, { name: 'CSS', percent: 80 }, { name: 'Javascript', percent: 60 }, { name: 'Angular', percent: 85 }
    ]},
    { id: 'design', icon: 'uil uil-swatchbook', title: 'UI / UX Design', subtitle: 'More than 5 years', items: [
      { name: 'Figma', percent: 90 }, { name: 'Sketch', percent: 80 }, { name: 'Photoshop', percent: 70 }
    ]},
    { id: 'backend', icon: 'uil uil-server-network', title: 'Backend Developer', subtitle: 'More than 2 years', items: [
      { name: 'Node.js', percent: 80 }, { name: 'Python', percent: 80 }, { name: 'PostgreSQL', percent: 70 }, { name: 'AWS Lambda', percent: 75 }
    ]},
  ],
  education: [
    { title: 'University Name (Location)', text: 'Degree/Certificate', date: 'Start - End' },
  ],
  experience: [
    { title: 'Company Name (Location)', text: 'Job Title', date: 'Start - End' },
  ],
  projects: [
    { title: 'Project Name', category: 'web', image: '/placeholder.svg', detailsTitle: 'Project Details', detailsDescription: 'Add your project description here...', created: new Date().toLocaleDateString(), technologies: 'html css javascript', role: 'developer', demoUrl: '' },
  ],
  services: [
    { icon: 'uil uil-web-grid', title: 'Service Name', bullets: ['Service point 1', 'Service point 2', 'Service point 3'] },
  ],
  testimonials: [
    { quote: 'Add a testimonial from your client...', date: new Date().toLocaleDateString(), image: '/placeholder.svg', name: 'Client Name', role: 'Client Role' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly KEY = 'siteContent';
  private readonly ADMIN_KEY = 'adminSecret';

  load(): SiteContent {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  }

  save(content: SiteContent): void {
    localStorage.setItem(this.KEY, JSON.stringify(content));
  }

  // very lightweight gate — for obfuscation only
  hasSecret(): boolean { return !!localStorage.getItem(this.ADMIN_KEY); }
  setSecret(secret: string): void { localStorage.setItem(this.ADMIN_KEY, secret); }
  validate(secret: string): boolean { return localStorage.getItem(this.ADMIN_KEY) === secret; }
}
