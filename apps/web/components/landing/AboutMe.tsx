import Link from 'next/link';

import { Github, Linkedin, Mail } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/kadirmetin',
    icon: Github,
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/kadirmetin',
    icon: Linkedin,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Email',
    url: 'mailto:hello@kadirmetin.dev',
    icon: Mail,
    color: 'hover:text-green-600',
  },
];

const AboutMe = () => {
  return (
    <section
      id="about-me"
      className="min-h-screen w-full px-4 py-8 md:px-6 md:py-12 lg:min-h-[75vh] lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-neutral-800 md:mb-12 md:text-3xl lg:mb-16 lg:text-5xl dark:text-neutral-200">
          About Me
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Profile Card */}
          <Card className="overflow-hidden h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <Avatar className="relative h-32 w-32">
                    <AvatarImage
                      src="https://github.com/kadirmetin.png"
                      alt="Kadir Metin"
                      className="object-cover"
                    />
                    <AvatarFallback>KM</AvatarFallback>
                  </Avatar>
                </div>

                <h3 className="text-xl font-bold">Kadir Metin</h3>
                <p className="text-sm text-muted-foreground mb-4">Full Stack Developer</p>

                <Separator className="my-4" />

                <div className="flex space-x-2">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <Button
                        key={social.name}
                        variant="ghost"
                        size="sm"
                        className={`h-9 w-9 p-0 ${social.color}`}
                        asChild
                      >
                        <Link
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                        >
                          <IconComponent className="h-4 w-4" />
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Introduction */}
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Hello there! 👋</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      I am a passionate full-stack developer with a deep interest in technology and
                      a commitment to continuous learning, specializing in React and React Native. I
                      aim to specialize in modern web technologies; I believe that creating
                      user-centric, empowering software is more valuable than exposing users to data
                      exploitation.
                    </p>
                    <p>
                      With my <span className="font-semibold">Locatr</span> project, I aim to
                      provide a transparent and user-friendly alternative to branded, data-driven
                      watches and apps, ensuring your privacy and the safety of your loved
                      ones&apos; information.
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button size={'lg'}>
                    <Link
                      href={'https://github.com/kadirmetin'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Projects
                    </Link>
                  </Button>
                  <Button size={'lg'} variant="outline">
                    <Link href={'https://kadirmetin.dev'} target="_blank" rel="noopener noreferrer">
                      Get in Touch
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
