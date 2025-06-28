export const scrollToSection = (section: string) => {
  document.querySelector(`#${section}`)?.scrollIntoView({ behavior: 'smooth' });
};
