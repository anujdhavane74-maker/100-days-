export interface WallpaperItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export const verstappenWallpapers: WallpaperItem[] = [
  {
    id: 'verstappen-portrait',
    title: 'Max Verstappen — Champion Focus',
    subtitle: 'World Champion Portrait',
    url: '/wallpapers/verstappen-portrait.jpg',
  },
  {
    id: 'verstappen-podium',
    title: 'Podium Victory Celebration',
    subtitle: 'Trophy & P1 Celebrations',
    url: '/wallpapers/verstappen-podium.jpg',
  },
  {
    id: 'verstappen-helmet',
    title: 'Race Suit & Visor',
    subtitle: 'Pre-Race Mental Focus',
    url: '/wallpapers/verstappen-helmet.jpg',
  },
  {
    id: 'verstappen-car',
    title: 'Red Bull Racing Car #1',
    subtitle: 'Full Throttle on Circuit',
    url: '/wallpapers/verstappen-car.jpg',
  },
  {
    id: 'verstappen-apex',
    title: 'Apex Turn In Motion',
    subtitle: 'Precision Telemetry in Corner',
    url: '/wallpapers/verstappen-apex.jpg',
  },
  {
    id: 'wallpaper-night-circuit',
    title: 'Night Grand Prix Circuit',
    subtitle: 'Under Floodlights',
    url: '/wallpapers/wallpaper-1.jpg',
  },
  {
    id: 'wallpaper-high-speed',
    title: 'Speed & Aerodynamics',
    subtitle: 'Clean Air Downforce',
    url: '/wallpapers/wallpaper-2.jpg',
  },
  {
    id: 'wallpaper-grid',
    title: 'Starting Grid',
    subtitle: 'Lights Out Preparation',
    url: '/wallpapers/wallpaper-3.jpg',
  },
  {
    id: 'wallpaper-cockpit',
    title: 'Carbon Fiber Cockpit',
    subtitle: 'Steering Wheel Controls',
    url: '/wallpapers/wallpaper-4.jpg',
  },
  {
    id: 'wallpaper-pitlane',
    title: 'Pitlane Telemetry & Strategy',
    subtitle: 'Rapid Pitstop Execution',
    url: '/wallpapers/wallpaper-5.jpg',
  },
  {
    id: 'wallpaper-marina',
    title: 'Marina Circuit Twilight',
    subtitle: 'Championship Decider',
    url: '/wallpapers/wallpaper-6.jpg',
  },
  {
    id: 'wallpaper-finish',
    title: 'Victory Flare & Atmosphere',
    subtitle: 'Day 100 Goal Realization',
    url: '/wallpapers/wallpaper-7.jpg',
  },
];

/**
 * Returns dynamic wallpaper based on challenge day number (1 - 100)
 */
export function getWallpaperForDay(dayNumber: number): WallpaperItem {
  const index = (dayNumber - 1) % verstappenWallpapers.length;
  return verstappenWallpapers[index];
}
