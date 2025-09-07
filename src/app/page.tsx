
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
    description: "Expert high-voltage and low-voltage electrical installations, maintenance, and repair for commercial and industrial projects, including substation construction.",
  },
  {
    icon: <HardHat className="w-8 h-8 text-primary" />,
    title: "Industrial Civil Engineering",
    description: "Comprehensive site development, foundation work, structural construction, and robust solutions with a focus on safety and durability.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Transformer Installation & Services",
    description: "Turnkey solutions for installation, testing, commissioning, and maintenance of electrical transformers of all sizes and specifications.",
  },
];

const products = [
  {
    name: "Distribution Transformer",
    description: "Highly efficient and reliable distribution transformers for power networks. Available in various ratings to meet your project's needs.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical transformer"
  },
  {
    name: "Steel Utility Pole",
    description: "Durable, weather-resistant steel utility poles for power lines and telecommunications. A superior alternative to traditional materials.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical pole"
  },
  {
    name: "High-Voltage Cables",
    description: "Suppliers of a range of armored and unarmored cables designed for safe and efficient high-voltage power transmission.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical cable"
  },
];

export default function HomePage() {
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
            Powering progress with state-of-the-art infrastructure solutions, from high-voltage transformer installations to robust site development projects.
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
              We deliver comprehensive and reliable solutions tailored to meet the demands of modern industrial and commercial projects.
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
              As leading suppliers, we provide and install industry-leading electrical equipment for all your project needs.
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
            Let's discuss how our expertise in electrical and civil contracting can bring your vision to life. Contact our team today for a comprehensive quote.
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
