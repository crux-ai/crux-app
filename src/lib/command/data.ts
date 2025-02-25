import { DashboardIcon, GitHubLogoIcon, RocketIcon, SliderIcon } from '@radix-ui/react-icons';

export const demoCards = [
  {
    icon: RocketIcon,
    text: 'Load pandas github repository for analysis',
  },
  {
    icon: DashboardIcon,
    text: 'Load demo project',
  },
];

export const commands = [
  { icon: RocketIcon, text: 'Load', page: 'load', command: '@L', description: 'Loads the given repository from github for analysis',
  },
  { icon: DashboardIcon, text: 'Open', page: 'open', command: '@O', description: 'Opens the given project dashboard from a previously loaded repository' },
  { icon: SliderIcon, text: 'Show', page: 'show', command: '@S', description: 'Show the code and commits of a previously loaded repository' },

];

export const loadItems = [
  {
    icon: GitHubLogoIcon,
    title: 'Claude',
    url: 'https://github.com/Anthropic/Claude',
    active: true,
  },
  {
    icon: GitHubLogoIcon,
    title: 'whisper',
    url: 'https://github.com/openai/whisper',
    active: true,
  },
  {
    icon: GitHubLogoIcon,
    title: 'transformers',
    url: 'https://github.com/huggingface/transformers',
    active: false,
  },
];

export const OpenItems = [
  {
    icon: DashboardIcon,
    title: 'TaskFlow',
    description: 'A Kanban-style project management tool built with React and Firebase. Features include drag-and-drop task management, real-time updates, and team collaboration.',
    status: true,
  },
  {
    icon: DashboardIcon,
    title: 'WeatherNow',
    description: 'A weather forecasting application using OpenWeather API. Built with Next.js and TailwindCSS, featuring location-based weather updates, 7-day forecasts, and weather alerts.',
    status: false,
  },
  {
    icon: DashboardIcon,
    title: 'CodeSnippet',
    description: 'A developer tool for organizing and sharing code snippets. Built with TypeScript and Express, includes syntax highlighting, tags, and search functionality.',
    status: true,
  },
];

export const showItems = [
  {
    icon: GitHubLogoIcon,
    title: 'whisper',
    url: 'https://github.com/openai/whisper',
    active: true,
  },
  {
    icon: GitHubLogoIcon,
    title: 'transformers',
    url: 'https://github.com/huggingface/transformers',
    active: true,
  },
  {
    icon: GitHubLogoIcon,
    title: 'langchain',
    url: 'https://github.com/langchain-ai/langchain',
    active: true,
  },
  {
    icon: GitHubLogoIcon,
    title: 'stable-diffusion',
    url: 'https://github.com/CompVis/stable-diffusion',
    active: false,
  },
  {
    icon: GitHubLogoIcon,
    title: 'llama',
    url: 'https://github.com/facebookresearch/llama',
    active: true,
  },
];
