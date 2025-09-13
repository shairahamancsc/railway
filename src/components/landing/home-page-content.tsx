
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, HardHat, Phone, ShieldCheck, Award, Users, Search, Package } from "lucide-react";
import { PublicLayout } from "@/components/landing/public-layout";
import { useThemeCustomizer } from "@/context/ThemeCustomizerProvider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useData } from "@/hooks/useData";

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
  const { products, loading: productsLoading } = useData();

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
            Expert electrical & civil engineering contractors. We specialize in high-voltage transformer installations and robust site development. Quality and safety on every project.
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
              <Card key={index} className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
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
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Partner with JRKE Contracting?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Choosing the right contractor is the most critical decision for the success of your project. We deliver not just on specifications, but on promises of quality, safety, and partnership.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUsItems.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
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
            {productsLoading ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
              products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <Link href={`/products/${product.id}`} className="block">
                    <div className="relative">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={product.hint}
                    />
                    </div>
                </Link>
                <CardHeader>
                    <CardTitle>
                        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                           {product.name}
                        </Link>
                    </CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                     <div className="flex items-baseline gap-2">
                        <p className={`text-lg font-bold ${product.discounted_price ? 'text-primary' : 'text-foreground'}`}>
                            {product.discounted_price || product.selling_price}
                        </p>
                        {product.discounted_price && (
                            <p className="text-sm text-muted-foreground line-through">
                                {product.selling_price}
                            </p>
                        )}
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/products/${product.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
                <Card className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Products Coming Soon!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">We are updating our product catalog. Please check back later for high-quality industrial equipment.</p>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>
      </section>
      
       {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary">
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
                <AccordionContent className="text-muted-foreground text-base">
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
