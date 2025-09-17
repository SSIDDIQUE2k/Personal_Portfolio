export type SkillCategory = { title: string; icon: string; skills: string[] };
export type Project = { title: string; description: string; image: string; tags: string[]; liveUrl?: string; githubUrl?: string };

export const profile = {
  name: 'Your Name',
  role: 'Software Engineer / AWS Practitioner',
  description: 'I have high level experience in web design, development knowledge and producing quality work',
  
  contact: {
    email: 'user@gmail.com',
    phone: '999-888-777',
    messenger: 'user.fb123'
  },

  about: {
    heading: 'Hi, I\'m Mariam Wallas, based in Canada',
    description: 'I\'m a web developer, with extensive knowledge and years of experience, working with quality work in web technologies, UI and UX design',
    stats: [
      { icon: 'uil-award', title: 'Experience', value: '10 + Years' },
      { icon: 'uil-suitcase-alt', title: 'Completed', value: '60 + Projects' },
      { icon: 'uil-headphones-alt', title: 'Support', value: 'Online 24/7' }
    ]
  },

  education: [
    {
      institution: 'XYZ University (Sometown, NJ)',
      degree: 'BFA in Graphic Design',
      period: '2011 - 2013'
    },
    {
      institution: 'ABC University (Sometown. NJ)',
      degree: 'Diploma in Web Design',
      period: '2013 - 2015'
    },
    {
      institution: 'KLM University (Sometown, NJ)',
      degree: 'BS in Web Development',
      period: '2015 - 2017'
    }
  ],

  experience: [
    {
      company: 'Copalopa Inc. (Sometown, NJ)',
      position: 'Lead / Senior UX Designer',
      period: '2018 - Present'
    },
    {
      company: 'Gabogle Inc. (Somwtown, NJ)',
      position: 'Web site / UX Designer',
      period: '2015 - 2018'
    },
    {
      company: 'Copalopa Inc. (Sometown, NJ)',
      position: 'Junior UX Designer',
      period: '2013 - 2015'
    }
  ],

  skills: {
    frontend: [
      { name: 'HTML', percentage: 90 },
      { name: 'CSS', percentage: 80 },
      { name: 'Javascript', percentage: 60 },
      { name: 'React', percentage: 85 }
    ],
    design: [
      { name: 'Figma', percentage: 90 },
      { name: 'Sketch', percentage: 80 },
      { name: 'PhotoShop', percentage: 70 }
    ],
    backend: [
      { name: 'PHP', percentage: 80 },
      { name: 'Python', percentage: 80 },
      { name: 'MySQL', percentage: 70 },
      { name: 'Firebase', percentage: 75 }
    ]
  },

  services: [
    {
      icon: 'uil-web-grid',
      title: 'Web <br> Designer',
      description: 'I offer services with more than 3 years of experience with quality work to clients and companies',
      items: [
        'User Interface Development',
        'Web Page Development',
        'Interactive UX/UI Creations',
        'Company Brand Positioning',
        'Design and Mockup of products for companies'
      ]
    },
    {
      icon: 'uil-arrow',
      title: 'UI/UX <br> Designer',
      description: 'I offer services with more than 5 years of experience with quality work to clients and companies',
      items: [
        'Usability Testing',
        'User Research',
        'Interaction Design',
        'Responsive Design',
        'Branding & Style Guides',
        'Accessibility',
        'A/B Testing'
      ]
    },
    {
      icon: 'uil-edit',
      title: 'Branding <br> Designer',
      description: 'I offer services with more than 2 years of experience with quality work to clients and companies',
      items: [
        'Competitive Analysis',
        'Accessibility Design',
        'Project Management',
        'Iteration and Refinement',
        'Presenting Designs',
        'User Research',
        'Surveys & Questionnaires'
      ]
    }
  ],

  testimonials: [
    {
      text: 'Working with Miriam was an absolute pleasure from start to finish. They took the time to truly understand our business needs and translated them into a stunning and highly functional website',
      date: 'March 30, 2025',
      name: 'Chen Xiuying',
      position: 'Marketing Director',
      image: 'https://i.postimg.cc/MTr9j4Yn/client1.jpg'
    },
    {
      text: 'Miriam truly understood our business needs through her modern and sleek design, making a site incredibly user-friendly. With her help, we had a significant increase in engagement and customer sales',
      date: 'January 18, 2025',
      name: 'Joshua Middletown',
      position: 'Sales Director',
      image: 'https://i.postimg.cc/wvV7f8rB/client2.jpg'
    },
    {
      text: 'I was blown away by the website Miriam created for my business! Miriam crafted a incredibly user-friendly, that allows our customers to access information on any device. Since the launch, I\'ve seen a significant increase in inquiries and bookings',
      date: 'November 29, 2024',
      name: 'Melanie Stone',
      position: 'Business Owner',
      image: 'https://i.postimg.cc/pdP9DL0S/client3.jpg'
    }
  ],

  // Legacy properties for backward compatibility
  links: {
    github: '#',
    linkedin: '#',
    resume: '/resume.pdf',
    email: 'user@gmail.com'
  },
  tagline: 'Building beautiful and functional web experiences',
  skillsCategories: [
    { title: 'Frontend Development', icon: 'bi-code-slash', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
    { title: 'UI/UX Design', icon: 'bi-palette', skills: ['Figma', 'Sketch', 'PhotoShop'] },
    { title: 'Backend Development', icon: 'bi-hdd-network', skills: ['PHP', 'Python', 'MySQL', 'Firebase'] }
  ] as SkillCategory[],
  projects: [
    { title: 'E-Commerce Platform', description: 'Full-stack e-commerce solution with payment integration, inventory, and admin dashboard.', image: '/modern-ecommerce-interface.png', tags: ['Angular', 'TypeScript', 'Stripe', 'PostgreSQL'] },
    { title: 'Task Management App', description: 'Collaborative project management tool with real-time updates, team workflow, and analytics.', image: '/task-management-dashboard.png', tags: ['Angular', 'Node.js', 'Socket.io', 'MongoDB'] },
    { title: 'AI Content Generator', description: 'AI-powered content creation platform with multiple templates and export options.', image: '/ai-content-generator-interface.png', tags: ['Angular', 'OpenAI API', 'SCSS', 'Supabase'] },
  ] as Project[]
};