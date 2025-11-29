import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Globe,
  Hotel,
  FileText,
  MapPin,
  Calendar,
  Users,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Ticket,
  GraduationCap,
  UserCheck,
  Building,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

const Services = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const services = [
    {
      icon: FileText,
      title: "Services Visa",
      description: "Assistance complète pour l'obtention de vos visas touristiques, d'affaires ou de transit. Traitement rapide et suivi personnalisé.",
      features: ["Visa Touristique", "Visa d'Affaires", "Visa de Transit", "Documentation Complète"],
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"
    },
    {
      icon: Globe,
      title: "Voyages Organisés",
      description: "Des circuits tout compris avec guides experts, hébergements de qualité et expériences authentiques dans le monde entier.",
      features: ["Circuits Guidés", "Transport Inclus", "Hébergement Premium", "Activités Exclusives"],
      color: "green",
      gradient: "from-green-500 to-green-600",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
    },
    {
      icon: MapPin,
      title: "Destinations Diverses",
      description: "Plus de 50 destinations à travers le monde. Europe, Asie, Amérique, Afrique - nous connaissons chaque recoin du globe.",
      features: ["Europe", "Asie", "Amérique", "Afrique & Océanie"],
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop"
    },
    {
      icon: GraduationCap,
      title: "Visa d'Étude",
      description: "Accompagnement complet pour vos études à l'étranger : inscription universitaire, visa étudiant et logement.",
      features: ["Inscription Universitaire", "Visa Étudiant", "Logement Étudiant", "Support Continu"],
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop"
    },
    {
      icon: UserCheck,
      title: "Visa Visiteur",
      description: "Facilitez vos visites familiales et touristiques avec notre service d'assistance visa visiteur rapide et efficace.",
      features: ["Visite Familiale", "Tourisme", "Documentation Rapide", "Suivi Personnel"],
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
    },
    {
      icon: Building,
      title: "Omra & Hajj",
      description: "Organisez votre pèlerinage en toute sérénité. Packages tout compris avec guides spirituels et services premium.",
      features: ["Packages Omra", "Hajj Organisé", "Hôtels près Haram", "Guide Spirituel"],
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop"
    },
    {
      icon: Hotel,
      title: "Réservation d'Hôtels",
      description: "Accès à plus de 500,000 hôtels dans le monde entier. Des auberges économiques aux resorts 5 étoiles.",
      features: ["500K+ Hôtels", "Meilleurs Prix", "Confirmation Instantanée", "Annulation Flexible"],
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
    },
    {
      icon: Ticket,
      title: "Billetterie Avions",
      description: "Réservez vos vols aux meilleurs tarifs. Vols directs, avec escale, classe économique ou affaires.",
      features: ["Meilleurs Tarifs", "Vols Directs", "Multi-destinations", "Business Class"],
      color: "cyan",
      gradient: "from-cyan-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Tous nos services sont assurés et conformes aux normes internationales"
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Support client disponible jour et nuit pour toutes vos urgences"
    },
    {
      icon: Star,
      title: "Expertise 15+ ans",
      description: "Plus de 15 ans d'expérience dans l'industrie du voyage"
    },
    {
      icon: Users,
      title: "5000+ Clients",
      description: "Des milliers de voyageurs satisfaits nous font confiance"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop"
            alt="Travel Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F8FC6]/90 via-[#0F8FC6]/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Nos Services
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal mt-4 text-white/90">
                Des Solutions Complètes pour Tous Vos Besoins de Voyage
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              De la planification de voyage à l'obtention de visas, nous vous accompagnons à chaque étape
              pour faire de votre voyage une expérience inoubliable.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 xl:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <benefit.icon className="w-12 h-12 text-[#0F8FC6] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Services Grid Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-16 xl:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12 xl:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Découvrez Nos Services
            </h2>
            <div className="w-24 h-1 bg-[#0F8FC6] mx-auto mb-6"></div>
            <p className="text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins de voyage,
              du visa à la réservation d'hôtels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`}></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <service.icon className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 text-${service.color}-600 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow`}
                  >
                    En Savoir Plus
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-16 xl:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F8FC6] to-[#0A4F6C]"
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
                Pourquoi Choisir Nos Services ?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Avec plus de 15 ans d'expérience dans l'industrie du voyage, nous sommes votre partenaire
                de confiance pour tous vos besoins de voyage. Notre équipe d'experts travaille sans relâche
                pour vous offrir les meilleurs services au meilleur prix.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Prix Compétitifs</h4>
                    <p className="text-white/80">Les meilleurs tarifs du marché garantis</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Service Personnalisé</h4>
                    <p className="text-white/80">Chaque voyage est adapté à vos besoins</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Support 24/7</h4>
                    <p className="text-white/80">Assistance disponible à tout moment</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop"
                  alt="Travel Service"
                  className="w-full h-48 object-cover rounded-xl shadow-xl"
                />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                  alt="Destination"
                  className="w-full h-48 object-cover rounded-xl shadow-xl mt-8"
                />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop"
                  alt="Beach"
                  className="w-full h-48 object-cover rounded-xl shadow-xl -mt-8"
                />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
                  alt="Adventure"
                  className="w-full h-48 object-cover rounded-xl shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 xl:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#0F8FC6] to-[#0A4F6C] rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
              Prêt à Commencer Votre Aventure ?
            </h2>
            <p className="text-lg xl:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Contactez-nous dès aujourd'hui et laissez nos experts créer le voyage parfait pour vous.
              Que ce soit pour un visa, un circuit organisé ou une simple réservation, nous sommes là pour vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0F8FC6] px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
              >
                <Phone className="w-5 h-5" />
                Appelez-nous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-[#0F8FC6] transition-all"
              >
                <Mail className="w-5 h-5" />
                Envoyez un Email
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;
