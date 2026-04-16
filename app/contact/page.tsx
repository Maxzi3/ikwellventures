"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "+2348033056790";
    const message = encodeURIComponent(
      "Hello! I'm interested in your Volvo spare parts.",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Get in touch with our team for inquiries and support
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Get in Touch
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Have questions about our Volvo spare parts? Our team is here
                  to help you find the right components for your vehicle.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">
                        ikwell2000@yahoo.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">08033056790</p>
                      <p className="text-muted-foreground">07086368131</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground">
                        23, Olakunle Street,
                        <br />
                        Papa Ajao Mushin, Lagos State
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <div className="mt-10">
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20BA5C] sm:w-auto"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Quick response via WhatsApp
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground">
                  Send us a Message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and we will get back to you shortly.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-lg bg-primary/10 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                      <Send className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thank you for contacting us. We will respond to your
                      inquiry soon.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
