import { Globe, Laptop, Smartphone, Tablet } from 'lucide-react';

export const getDeviceType = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

export const getDeviceName = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  if (ua.includes('chrome')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
  } else if (ua.includes('opera')) {
    browser = 'Opera';
  }

  if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  } else if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac')) {
    os = 'MacOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  return `${browser} on ${os}`;
};

export const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    case 'desktop':
      return <Laptop className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};
