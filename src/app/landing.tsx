'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  FileText,
  ListTodo,
  Menu,
  X,
  Trophy,
  Clock,
  Layout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import YouTube from 'react-youtube';

interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  mainClassName?: string;
}

function TextRotate({
  texts,
  rotationInterval = 3000,
  mainClassName,
}: TextRotateProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === texts.length - 1 ? 0 : prevIndex + 1
      );
    }, rotationInterval);

    return () => clearInterval(intervalId);
  }, [texts, rotationInterval]);

  return (
    <span className={cn('overflow-hidden inline-block', mainClassName)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTextIndex}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="inline-block"
        >
          {texts[currentTextIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-md group flex flex-col justify-between h-full bg-background/80 backdrop-blur-sm">
      <div>
        <div className="mb-4 p-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
      </div>
    </Card>
  );
}

const menuItems = [
  { name: 'Features', href: '#features-section' },
  { name: 'Pricing', href: '#pricing-section' },
  { name: 'Docs', href: '/docs' },
  { name: 'Preview', href: '#preview-section' },
];

function HeroHeader() {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMenuState(false);
      }
    }
  };

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed z-50 w-full px-2 group"
      >
        <motion.div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'bg-background/80 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5 shadow-md'
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <motion.div
              className="flex w-full justify-between lg:w-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 group"
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                >
                  <Trophy className="h-6 w-6 text-primary mr-2 group-hover:scale-110 transition-transform" />
                </motion.div>
                <span className="text-xl font-bold">
                  GTDXP-<span className="text-primary">OS</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    'm-auto size-6 duration-200',
                    menuState && 'rotate-180 scale-0 opacity-0'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200',
                    menuState && 'rotate-0 scale-100 opacity-100'
                  )}
                />
              </button>
            </motion.div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <motion.ul
                className="flex gap-8 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {menuItems.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2 + menuItems.indexOf(item) * 0.1,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary block duration-150 relative"
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      <span>{item.name}</span>
                      <span
                        data-underline
                        className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary/50 transition-all duration-300 group-hover:w-full"
                      />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              className={cn(
                'bg-background/90 mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-2xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent backdrop-blur-md',
                menuState && 'block'
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary block duration-150 relative"
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        <span>{item.name}</span>
                        <span
                          data-underline
                          className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary/50 transition-all duration-300 group-hover:w-full"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeToggle />
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    Sign Up
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-60 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(var(--primary)/0.15)_0,hsla(var(--primary)/0.10)_50%,hsla(var(--primary)/0)_80%)]" />
          <div className="h-[80rem] absolute right-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary)/0.10)_0,hsla(var(--primary)/0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[60rem] w-[60rem] absolute -right-10 top-[20%] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--secondary)/0.08)_0,hsla(var(--secondary)/0.03)_50%,transparent_100%)]" />

          <motion.div
            className="absolute top-[30%] left-[20%] w-16 h-16 rounded-full bg-primary/10 backdrop-blur-xl"
            animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 5, 0] }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-[45%] right-[25%] w-24 h-24 rounded-xl bg-secondary/10 backdrop-blur-xl"
            animate={{ y: [0, 40, 0], x: [0, -20, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-[25%] right-[15%] w-12 h-12 rounded-full border border-primary/20 backdrop-blur-xl"
            animate={{ y: [0, -20, 0], x: [0, -15, 0], rotate: [0, 15, 0] }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_145%_at_50%_10%,transparent_0%,hsl(var(--primary)/0.08)_30%,var(--background)_75%)]"
        />

        <section className="relative">
          <div className="relative pt-20 sm:pt-28 md:pt-44">
            <motion.div
              className="absolute inset-0 -z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <div
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"
                style={{ height: '70vh' }}
              />
            </motion.div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <motion.h1
                  className="mt-6 sm:mt-10 max-w-4xl mx-auto text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Level Up Your Productivity with{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    GTDXP-
                  </span>
                  <TextRotate
                    texts={['OS', 'Quests', 'Badges', 'Focus']}
                    mainClassName="bg-clip-text text-transparent bg-gradient-to-r from-primary/70 to-primary ml-2"
                  />
                </motion.h1>

                <motion.p
                  className="mx-auto mt-10 max-w-2xl text-balance text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  A gamified productivity system based on Getting Things Done
                  (GTD). Capture tasks, earn XP, and conquer your goals for a
                  one-time payment of $19 or try free for 14 days.
                </motion.p>

                <motion.div
                  className="mt-14 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                    <Button
                      size="lg"
                      className="relative rounded-xl px-8 py-6 text-base font-medium bg-background text-foreground hover:text-background hover:bg-primary border border-primary/20 transition-all duration-300 flex items-center gap-2"
                      asChild
                    >
                      <Link href="/auth/signup">
                        <span>Start Free Trial</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-8 py-6 text-base font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300"
                    asChild
                  >
                    <Link href="#pricing-section">Buy Now ($19)</Link>
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="relative mx-auto lg:mx-auto xl:mx-auto mt-20 sm:mt-32 md:mt-40 overflow-hidden px-2 sm:px-4 md:px-6"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                type: 'spring',
                bounce: 0.2,
              }}
            >
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="bg-background relative mx-auto max-w-[90vw] sm:max-w-[95%] md:max-w-6xl overflow-hidden rounded-2xl border p-2 sm:p-5 shadow-lg shadow-black/15 ring-1 ring-white/10">
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden rounded-lg relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10" />
                  <Image
                    src="/images/gtdxp-os-preview.png"
                    alt="GTDXP-OS App Preview"
                    width={1200}
                    height={675}
                    className="w-full h-auto object-contain rounded-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px"
                    priority
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 mt-24 md:mt-40 bg-background/80 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <span className="text-muted-foreground">Why GTDXP-OS?</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Path to Productivity Mastery
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                GTDXP-OS combines the proven GTD methodology with gamification
                to make productivity fun and effective.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">5</h3>
                <p className="text-muted-foreground">GTD Steps</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">100+</h3>
                <p className="text-muted-foreground">Achievements</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
                <p className="text-muted-foreground">Access</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">0</h3>
                <p className="text-muted-foreground">Subscriptions</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function GTDXPLanding() {
  const features = [
    {
      icon: <ListTodo className="h-6 w-6 text-primary" />,
      title: 'Capture',
      description:
        'Quickly jot down tasks, ideas, or anything on your mind with an intuitive inbox.',
    },
    {
      icon: <Check className="h-6 w-6 text-primary" />,
      title: 'Clarify',
      description:
        'Define actionable steps for each task to make decisions and move forward.',
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: 'Organize',
      description:
        'Sort tasks into projects and categories for a clear, structured workflow.',
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: 'Reflect',
      description:
        'Review your system weekly to stay on track and update your priorities.',
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Engage',
      description:
        'Tackle tasks with focus using Pomodoro timers and earn XP for completions.',
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      title: 'Gamification',
      description:
        'Earn badges, level up, and unlock rewards as you conquer your tasks.',
    },
  ];

  return (
    <>
      <NextSeo
        title="GTDXP-OS - Gamified GTD Productivity System"
        description="Master your tasks with GTDXP-OS, a gamified productivity system based on Getting Things Done (GTD). One-time payment of $19 or try free for 14 days."
        canonical="https://gtdxp.os"
        openGraph={{
          url: 'https://gtdxp.os',
          title: 'GTDXP-OS - Gamified GTD Productivity System',
          description:
            'Master your tasks with GTDXP-OS, a gamified productivity system based on Getting Things Done (GTD). One-time payment of $19 or try free for 14 days.',
          images: [
            {
              url: '/images/gtdxp-os-preview.png',
              width: 1200,
              height: 675,
              alt: 'GTDXP-OS Preview',
            },
          ],
          siteName: 'GTDXP-OS',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'GTD, productivity, task management, gamified, Getting Things Done, to-do app',
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground">
        <HeroSection />

        <section
          id="features-section"
          className="py-20 md:py-28 bg-background/50 relative z-10 mt-10"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <span className="text-muted-foreground">Features</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Master Your Tasks with GTDXP-OS
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built on the GTD methodology, GTDXP-OS adds gamification to make
                productivity engaging and rewarding.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: features.indexOf(feature) * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing-section"
          className="py-24 bg-background relative z-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <span className="text-muted-foreground">Pricing</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, One-Time Payment
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get lifetime access to GTDXP-OS for a single payment of $19, or
                try it free for 14 days.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg bg-background/80 backdrop-blur-sm p-8"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Lifetime Access</h3>
                    <p className="text-4xl font-bold text-primary mb-4">
                      $19
                      <span className="text-lg text-muted-foreground">
                        {' '}
                        / one-time
                      </span>
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Full GTD
                        workflow
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Gamification
                        with XP and badges
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Pomodoro
                        timers
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Lifetime
                        updates
                      </li>
                    </ul>
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/80"
                      asChild
                    >
                      <Link href="/auth/signup">Buy Now</Link>
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Free Trial</h3>
                    <p className="text-4xl font-bold text-primary mb-4">
                      $0
                      <span className="text-lg text-muted-foreground">
                        {' '}
                        / 14 days
                      </span>
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Full access
                        to all features
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> No credit
                        card required
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" /> Cancel
                        anytime
                      </li>
                    </ul>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      asChild
                    >
                      <Link href="/auth/signup">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="preview-section"
          className="py-24 bg-background relative z-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <span className="text-muted-foreground">App Preview</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See GTDXP-OS in Action
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Watch how GTDXP-OS transforms task management into a fun,
                gamified experience with GTD methodology.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 z-10 pointer-events-none" />
                <div className="aspect-video bg-muted">
                  <YouTube
                    videoId="YOUR_YOUTUBE_VIDEO_ID"
                    className="w-full h-full"
                    opts={{
                      height: '100%',
                      width: '100%',
                      playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                      },
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Conquer Your Tasks?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Join GTDXP-OS today and start mastering your productivity with a
                gamified GTD system. Try free for 14 days or buy now for $19.
              </p>
              <div className="inline-block relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300" />
                <Button
                  size="lg"
                  className="relative rounded-xl flex items-center gap-2 bg-primary hover:bg-primary/80 transition-all duration-300"
                  asChild
                >
                  <Link href="/auth/signup">
                    <span>Get Started Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold">
                  GTDXP-<span className="text-primary">OS</span>
                </h3>
                <p className="text-muted-foreground">
                  Level up your productivity
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
                <Link
                  href="#features-section"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('features-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Features
                </Link>
                <Link
                  href="#pricing-section"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('pricing-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
              <p>
                © {new Date().getFullYear()} GTDXP-OS. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
