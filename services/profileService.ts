
import { UserProfile } from '../types';

const firstNames = ["Alex", "Jamie", "Chris", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Skyler", "Dakota"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Garcia", "Rodriguez"];
const bios = [
  "Loves hiking and exploring new cafes. Looking for someone with a good sense of humor.",
  "Passionate about art, music, and travel. Always up for an adventure.",
  "Tech enthusiast and avid reader. Enjoys deep conversations and quiet evenings.",
  "Fitness lover and foodie. Believes in living life to the fullest.",
  "Creative soul who enjoys painting, writing, and photography. Seeking a kind and genuine connection.",
  "Animal lover, currently fostering two kittens. Enjoys board games and movie nights.",
  "Musician at heart, plays guitar and piano. Looking for someone to share creative projects with.",
  "Entrepreneur working on a new startup. Ambitious, driven, and loves intellectual challenges.",
  "Volunteer at a local shelter. Enjoys cooking, gardening, and spending time outdoors.",
  "Globetrotter who has visited 20+ countries. Looking for a travel buddy and meaningful conversations."
];
const interestsPool = ["Travel", "Photography", "Cooking", "Reading", "Music", "Hiking", "Movies", "Art", "Gaming", "Yoga", "Coding", "Dancing", "Writing", "Sports", "Volunteering", "Gardening", "History", "Science"];
const locations = ["New York, USA", "London, UK", "Paris, FR", "Tokyo, JP", "Berlin, DE", "Sydney, AU", "Toronto, CA", "Rome, IT", "Madrid, ES", "Amsterdam, NL"];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getMockProfiles = (count: number): UserProfile[] => {
  const profiles: UserProfile[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)[0]}.`;
    while(usedNames.has(name)){ // ensure unique names for keys
        name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)[0]}.`;
    }
    usedNames.add(name);

    const numPhotos = Math.floor(Math.random() * 3) + 1; // 1 to 3 photos
    const photos: string[] = [];
    for(let p=0; p<numPhotos; p++){
        photos.push(`https://picsum.photos/seed/${name.replace(' ','_')}_${p}/400/300`);
    }

    profiles.push({
      id: `profile_${Date.now()}_${i}`,
      name: name,
      age: Math.floor(Math.random() * 20) + 20, // Age between 20 and 39
      bio: getRandomElement(bios),
      photos: photos,
      interests: getRandomSubset(interestsPool, Math.floor(Math.random() * 4) + 3), // 3 to 6 interests
      contactInfo: {
        whatsapp: `+1555${String(Math.floor(Math.random() * 9000000) + 1000000)}`, // Random 7 digits
        telegram: `@${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random()*100)}`
      },
      location: getRandomElement(locations),
    });
  }
  return profiles;
};
