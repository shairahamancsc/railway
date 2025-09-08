
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, HardHat, Phone, ShieldCheck, Award, Users, Search } from "lucide-react";
import { PublicLayout } from "@/components/landing/public-layout";
import { useThemeCustomizer } from "@/context/ThemeCustomizerProvider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Electrical Contracting Services",
    description: "We provide expert high-voltage and low-voltage electrical installations, comprehensive maintenance schedules, and emergency repair services for a wide range of commercial and industrial projects, including complete substation construction and grid integration.",
  },
  {
    icon: <HardHat className="w-8 h-8 text-primary" />,
    title: "Industrial Civil Engineering",
    description: "Our civil engineering services include comprehensive site development, reinforced concrete foundations, structural steel erection, and underground utility installation. We deliver robust solutions with an unwavering focus on safety, durability, and project timelines.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Transformer Installation & Services",
    description: "We offer complete turnkey solutions for the installation, testing, and commissioning of electrical transformers. Our services cover all sizes and specifications, ensuring your power distribution systems are efficient, reliable, and maintained for peak performance.",
  },
];

const products = [
  {
    name: "Distribution Transformer",
    description: "Highly efficient and reliable distribution transformers for power networks. Available in various ratings and configurations to meet your project's specific voltage and load requirements. Built for longevity and performance.",
    image: "https://picsum.photos/600/400?random=4",
    price: "Inquire for Price",
    hint: "electrical transformer"
  },
  {
    name: "Steel Utility Pole",
    description: "Durable, weather-resistant galvanized steel utility poles for power lines and telecommunications infrastructure. A superior, low-maintenance alternative to traditional materials, engineered for high-load capacity.",
    image: "https://picsum.photos/600/400?random=5",
    price: "Inquire for Price",
    hint: "steel utility pole"
  },
  {
    name: "High-Voltage Cables",
    description: "Suppliers of a wide range of armored and unarmored high-voltage cables designed for safe and efficient power transmission. Our cables meet stringent industry standards for safety, reliability, and durability in any environment.",
    image: "https://picsum.photos/600/400?random=6",
    price: "Inquire for Price",
    hint: "high voltage electrical cable"
  },
];

const whyChooseUsItems = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Unmatched Expertise",
    description: "Our team consists of highly skilled, certified engineers and technicians with decades of collective experience in both the electrical and civil sectors. We have a proven track record of successfully completing complex, high-stakes projects on time and within budget. This deep expertise allows us to anticipate challenges and innovate solutions that others might miss, ensuring the highest quality outcome for your project."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Commitment to Safety",
    description: "Safety is not just a policy; it's the core of our culture. We enforce rigorous safety protocols that exceed industry standards, conduct continuous training, and empower every team member to prioritize safety above all else. Our impeccable safety record protects our workers, your assets, and the community, providing you with peace of mind."
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Client-Centric Approach",
    description: "We believe that successful projects are built on strong partnerships. We work collaboratively with our clients, maintaining open and transparent communication from the initial consultation to final handover. Your goals are our goals, and we are dedicated to understanding your unique needs to deliver a truly customized and satisfactory service."
  },
];

const faqItems = [
  {
    question: "What types of projects do you specialize in?",
    answer: "We specialize in a wide range of industrial and commercial projects, with a core focus on high-voltage electrical installations, substation construction, comprehensive site development, and transformer services. Our integrated expertise in both electrical and civil engineering makes us an ideal partner for complex infrastructure projects."
  },
  {
    question: "How do you ensure safety on your worksites?",
    answer: "Safety is our top priority. We implement a comprehensive safety program that includes daily toolbox talks, regular site safety audits, rigorous training for all personnel, and strict adherence to all OSHA and local regulations. All team members are empowered to stop work if they identify a safety hazard, ensuring a culture of collective responsibility."
  },
  {
    question: "Can you handle both the electrical and civil aspects of a project?",
    answer: "Absolutely. Our key advantage is our ability to provide a seamless, turnkey solution by managing both the electrical and civil engineering components of a project. This integrated approach eliminates coordination issues, streamlines timelines, and ensures that all aspects of the work are executed to the same high standard."
  },
    {
    question: "How do I get a quote for my project?",
    answer: "Getting a quote is simple. Click on the 'Get a Free Consultation' or 'Contact Us' button on our website and fill out the contact form with your project details. You can also call us directly. One of our project managers will get in touch with you to discuss your requirements, conduct a site visit if necessary, and provide a detailed, transparent proposal."
  },
];


export function HomePageContent() {
  const { theme } = useThemeCustomizer();

  return (
    <PublicLayout>
      {/* Hero Section with Parallax */}
      <section 
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${theme.images.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight leading-tight mb-4 text-shadow-lg">
            Leading Electrical & Civil Engineering Contractors
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            As leading electrical and civil engineering contractors, we specialize in powering progress with state-of-the-art infrastructure solutions. From high-voltage transformer installations to robust site development projects, our commitment is to deliver quality and safety on every project, ensuring reliable outcomes for our clients.
          </p>
          <Button asChild size="lg">
            <Link href="#contact">
              Get a Free Consultation <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Core Contracting Services</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We deliver comprehensive and reliable solutions tailored to meet the demands of modern industrial and commercial projects. Our integrated approach ensures that both electrical and civil engineering components are seamlessly executed to the highest standard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
       {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Partner with JRKE Contracting?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Choosing the right contractor is the most critical decision for the success of your project. We deliver not just on specifications, but on promises of quality, safety, and partnership.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUsItems.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    {item.icon}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* E-commerce/Product Section */}
      <section id="products" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Industrial Products & Equipment</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              As leading suppliers, we provide and install industry-leading electrical equipment for all your project needs. We source only from trusted manufacturers to guarantee quality and compliance with all safety standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={product.hint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{product.price}</p>
                    <Button variant="outline">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
       {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Have questions? We have answers. Here are some of the most common inquiries we receive from our clients.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* CTA Section */}
      <section id="contact" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">Ready to Start Your Next Project?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Let's discuss how our expertise in electrical and civil contracting can bring your vision to life. Contact our team today for a comprehensive quote and discover why we are the trusted partner for complex industrial projects.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="mailto:contact@jrkelabour.com">
              <Phone className="mr-2" /> Contact Us Now
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
