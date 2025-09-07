
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, HardHat, Phone } from "lucide-react";
import { PublicLayout } from "@/components/landing/public-layout";
import { useThemeCustomizer } from "@/context/ThemeCustomizerProvider";

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
            Powering progress with state-of-the-art infrastructure solutions, from high-voltage transformer installations to robust site development projects. Our commitment is to deliver quality and safety on every project, ensuring reliable outcomes for our clients.
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

      {/* E-commerce/Product Section */}
      <section id="products" className="py-16 md:py-24 bg-secondary/40">
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
