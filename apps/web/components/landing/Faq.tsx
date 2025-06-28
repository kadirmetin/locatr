import Link from 'next/link';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Card, CardContent, CardHeader } from '../ui/card';

const faqData = [
  {
    question: 'Is my location data safe and private?',
    answer:
      'Absolutely. Locatr uses end-to-end encryption to protect your location data. Your data is never sold or shared with third parties. Since we are open source, you can audit our code to verify our privacy commitments.',
  },
  {
    question: 'How does Locatr differ from other location tracking apps?',
    answer:
      "Locatr is completely open source, privacy-focused, and doesn't monetize your data. Unlike other apps, we don't track you for advertising purposes or sell your information. Our code is transparent, auditable, and built with user privacy as the top priority.",
  },
  {
    question: 'Does Locatr work offline?',
    answer: 'Unfortunately, no. Locatr cannot work when you are offline.',
  },
  {
    question: 'Which devices and platforms does Locatr support?',
    answer:
      'Locatr works seamlessly across iOS, Android, and Web platforms. You can share locations between different device types without any compatibility issues. All features are available on every platform with consistent user experience.',
  },
  {
    question: 'How much battery does Locatr consume?',
    answer:
      'Locatr is optimized for minimal battery usage. Our intelligent location algorithms only activate GPS when necessary and use low-power location services when possible. Most users report negligible battery impact during normal daily usage.',
  },
  {
    question: 'Is Locatr free to use?',
    answer: 'Locatr is completely free.',
  },
  {
    question: 'How do I start track my location?',
    answer:
      'Download Locatr to your mobile device. Once you have completed the installation steps, you can track your device via the Dashboard.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq">
      <div className="h-full w-full px-4 py-10 sm:px-6 md:py-16 lg:h-[75vh] lg:px-0">
        <h2 className="mx-auto mb-16 max-w-7xl pl-4 text-xl font-bold text-neutral-800 md:text-5xl dark:text-neutral-200">
          Frequently asked
        </h2>

        <div className="mx-auto flex w-full justify-center">
          <div className="w-full max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <Card className="p-4">
                  <CardHeader className="font-semibold">Have another question?</CardHeader>
                  <CardContent>
                    Feel free to contact me on{' '}
                    <Link
                      className="hover:underline"
                      href="https://www.linkedin.com/in/kadirmetin/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Linkedin
                    </Link>{' '}
                    or{' '}
                    <Link className="hover:underline" href="mailto:hello@kadirmetin.dev">
                      email
                    </Link>
                    .
                  </CardContent>
                </Card>
              </div>
              <div className="w-full lg:w-2/3">
                <Card className="p-4">
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqData.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
