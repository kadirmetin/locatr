import {
  Accessibility,
  Briefcase,
  Diamond,
  Flower2,
  Gamepad2,
  Globe,
  Heart,
  Home,
  PawPrint,
  Smartphone,
  Smile,
  Umbrella,
  User,
  Zap,
} from 'lucide-react';

const getDeviceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'phone-portrait-outline':
      return <Smartphone className="w-4 h-4" />;
    case 'home-outline':
      return <Home className="w-4 h-4" />;
    case 'heart-outline':
      return <Heart className="w-4 h-4" />;
    case 'accessibility-outline':
      return <Accessibility className="w-4 h-4" />;
    case 'game-controller-outline':
      return <Gamepad2 className="w-4 h-4" />;
    case 'umbrella-outline':
      return <Umbrella className="w-4 h-4" />;
    case 'earth-outline':
      return <Globe className="w-4 h-4" />;
    case 'paw-outline':
      return <PawPrint className="w-4 h-4" />;
    case 'person-outline':
      return <User className="w-4 h-4" />;
    case 'diamond-outline':
      return <Diamond className="w-4 h-4" />;
    case 'briefcase-outline':
      return <Briefcase className="w-4 h-4" />;
    case 'flash-outline':
      return <Zap className="w-4 h-4" />;
    case 'flower-outline':
      return <Flower2 className="w-4 h-4" />;
    case 'happy-outline':
      return <Smile className="w-4 h-4" />;
    default:
      return <Smartphone className="w-4 h-4" />;
  }
};

export { getDeviceIcon };
