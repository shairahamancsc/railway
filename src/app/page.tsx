
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, HardHat, Phone } from "lucide-react";
import { PublicLayout } from "@/components/landing/public-layout";

const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Electrical Contracting",
    description: "High-voltage and low-voltage electrical installations, maintenance, and repair for commercial and industrial projects.",
  },
  {
    icon: <HardHat className="w-8 h-8 text-primary" />,
    title: "Civil Engineering",
    description: "Foundation work, structural construction, and site development with a focus on safety and durability.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Transformer Services",
    description: "Installation, testing, and commissioning of electrical transformers of all sizes and specifications.",
  },
];

const products = [
  {
    name: "Distribution Transformer",
    description: "Highly efficient and reliable transformers for power distribution networks. Available in various ratings.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical transformer"
  },
  {
    name: "Steel Utility Pole",
    description: "Durable and weather-resistant steel poles for power lines and telecommunications infrastructure.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical pole"
  },
  {
    name: "High-Voltage Cables",
    description: "A range of armored and unarmored cables designed for safe and efficient high-voltage power transmission.",
    image: "https://picsum.photos/600/400?grayscale",
    price: "Inquire for Price",
    hint: "electrical cable"
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section with Parallax */}
      <section 
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight leading-tight mb-4 text-shadow-lg">
            Excellence in Electrical & Civil Contracting
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Powering progress with state-of-the-art infrastructure solutions, from high-voltage installations to robust civil engineering projects.
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
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Core Services</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Delivering comprehensive solutions tailored to meet the demands of modern industry.
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
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Products & Equipment</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We supply and install industry-leading equipment for all your project needs.
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
            Let's discuss how our expertise can bring your vision to life. Contact us today for a comprehensive quote and project analysis.
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
