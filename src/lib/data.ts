import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';

import corpcommentImg from '/public/corpcomment.png';
import rmtdevImg from '/public/rmtdev.png';
import wordanalyticsImg from '/public/wordanalytics.png';

export const links = [
  {
    name: 'Home',
    hash: '#home',
  },
  {
    name: 'Features',
    hash: '#features',
  },
  {
    name: 'About',
    hash: '#about',
  },
  {
    name: 'Languages',
    hash: '#languages',
  },
  {
    name: 'Roadmap',
    hash: '#roadmap',
  },
  {
    name: 'Contact',
    hash: '#contact',
  },
] as const;

export const experiencesData = [
  {
    title: 'Graduated bootcamp',
    location: 'Miami, FL',
    description:
      'I graduated after 6 months of studying. I immediately found a job as a front-end developer.',
    icon: React.createElement(LuGraduationCap),
    date: '2019',
  },
  {
    title: 'Front-End Developer',
    location: 'Orlando, FL',
    description:
      'I worked as a front-end developer for 2 years in 1 job and 1 year in another job. I also upskilled to the full stack.',
    icon: React.createElement(CgWorkAlt),
    date: '2019 - 2021',
  },
  {
    title: 'Full-Stack Developer',
    location: 'Houston, TX',
    description:
      'I\'m now a full-stack developer working as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I\'m open to full-time opportunities.',
    icon: React.createElement(FaReact),
    date: '2021 - present',
  },
] as const;

export const featuresData = [
  {
    title: 'Engineering Velocity Dashboard',
    description: 'A real-time dashboard that visualizes key engineering metrics such as sprint velocity, code commit frequency, and time to deployment. This feature helps leaders quickly assess team productivity and identify bottlenecks in the development process.',
    tags: ['Productivity', 'Metrics', 'Visualization', 'Real-time'],
    imageUrl: corpcommentImg,
  },
  {
    title: 'Tech Stack Health Analyzer',
    description: 'An intelligent tool that analyzes your organization\'s tech stack, highlighting areas of technical debt, outdated technologies, and potential security vulnerabilities. It provides actionable recommendations for modernization and risk mitigation, enabling leaders to make informed decisions about technology investments.',
    tags: ['Tech Stack', 'Security', 'Modernization', 'Risk Management'],
    imageUrl: rmtdevImg,
  },
  {
    title: 'Cross-Team Collaboration Insights',
    description: 'A feature that maps and analyzes collaboration patterns across engineering teams, identifying silos, communication bottlenecks, and opportunities for knowledge sharing. It helps leaders foster a more collaborative engineering culture and optimize team structures for better project outcomes.',
    tags: ['Collaboration', 'Team Dynamics', 'Communication', 'Organizational Structure'],
    imageUrl: wordanalyticsImg,
  },
] as const;

export const languagesData = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',

  // Web Technologies
  'HTML',
  'CSS',
  'React',
  'Angular',
  'Vue.js',
  'Node.js',

  // Database Technologies
  'SQL',

  // DevOps and Infrastructure
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitLab CI',
  'GitHub Actions',
  'Terraform',
  'Ansible',

  // Cloud Platforms
  'AWS',
  'Azure',
  'Google Cloud',

  // API Technologies
  'REST',
  'GraphQL',
  'gRPC',

  // Architecture Patterns
  'Microservices',
  'Serverless',
  'Event-Driven Architecture',

] as const;
