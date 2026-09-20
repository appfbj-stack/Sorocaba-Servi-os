import React from 'react';
import {
  Sparkles,
  Zap,
  Droplets,
  Wrench,
  Scissors,
  Wind,
  Hammer,
  Car,
  HeartHandshake,
  Smartphone,
  Trees,
  Truck,
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  HelpCircle,
  AppWindow,
  Layers,
  Boxes,
  Users,
  HardHat,
  PackageCheck
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'HardHat':
      return <HardHat className={className} />;
    case 'Boxes':
    case 'PackageCheck':
      return <Boxes className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'AppWindow':
    case 'Layers':
      return <AppWindow className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
