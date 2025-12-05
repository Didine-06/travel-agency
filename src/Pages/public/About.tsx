import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Plane,
  Users,
  Globe,
  Heart,
  Award,
  ArrowRight,
  Shield,
  Compass,
  Map,
  MessageCircle,
  Calendar,
  Star
} from 'lucide-react';

const About = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const agencyAddress = "123 Avenue des Voyages, Alger, Algérie";

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative min-h-screen flex items-center"
      >
        {/* Background Images */}
        <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4 opacity-5">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=600&fit=crop"
            alt="Travel Destination"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop"
            alt="Travel Adventure"
            className="w-full h-64 object-cover rounded-2xl mt-32"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop"
            alt="Beach Paradise"
            className="w-full h-64 object-cover rounded-2xl"
          />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 xl:py-12">
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
              <motion.div variants={fadeInUp}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6 leading-tight">
                  Travel Agency
                  <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#0F8FC6] font-normal">
                    Votre Partenaire Voyage
                  </span>
                </h1>
                <p className="text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 xl:mb-8 leading-relaxed">
                  Depuis plus de 15 ans, nous créons des voyages inoubliables à travers le monde.
                  Expertise locale, destinations premium, service d'excellence 24/7.
                </p>

                <div className="flex flex-wrap gap-4 xl:gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/destinations'}
                    className="bg-[#0F8FC6] hover:bg-[#0A4F6C] text-white px-6 xl:px-8 py-3 xl:py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 xl:gap-3 text-base xl:text-lg"
                  >
                    <Plane className="w-5 h-5 xl:w-6 xl:h-6" />
                    Nos Destinations
                    <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/services'}
                    className="border-2 border-[#0F8FC6] text-[#0F8FC6] hover:bg-[#0F8FC6] hover:text-white px-6 xl:px-8 py-3 xl:py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 xl:gap-3 text-base xl:text-lg"
                  >
                    <Globe className="w-5 h-5 xl:w-6 xl:h-6" />
                    Nos Services
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4 xl:gap-6">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
                    alt="Travel Agency"
                    className="w-full h-48 xl:h-64 object-cover rounded-xl shadow-2xl"
                  />
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=300&fit=crop"
                    alt="Adventure"
                    className="w-full h-48 xl:h-64 object-cover rounded-xl shadow-2xl mt-8 xl:mt-12"
                  />
                </div>

                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-4 -left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 xl:p-6 shadow-xl"
                >
                  <div className="flex items-center gap-3 xl:gap-4">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 xl:w-6 xl:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm xl:text-base">5000+ Voyageurs</p>
                      <p className="text-xs xl:text-sm text-gray-600 dark:text-gray-400">Satisfaits depuis 2010</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        <div className="w-full">
          <motion.div variants={fadeInUp} className="text-center mb-8 xl:mb-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
              Pourquoi Nous Choisir ?
            </h2>
            <div className="w-16 xl:w-24 h-1 bg-[#0F8FC6] mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 xl:w-20 xl:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 xl:mb-6">
                <Compass className="w-8 h-8 xl:w-10 xl:h-10 text-[#0F8FC6] dark:text-blue-400" />
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 xl:mb-4">Expertise Locale</h3>
              <p className="text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Nos guides experts connaissent chaque destination sur le bout des doigts pour vous offrir une expérience authentique.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 xl:w-20 xl:h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 xl:mb-6">
                <Shield className="w-8 h-8 xl:w-10 xl:h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 xl:mb-4">Voyages Sécurisés</h3>
              <p className="text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Assurance voyage complète, hébergements vérifiés et assistance 24/7 pour votre tranquillité d'esprit.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 xl:w-20 xl:h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 xl:mb-6">
                <Heart className="w-8 h-8 xl:w-10 xl:h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 xl:mb-4">Service Personnalisé</h3>
              <p className="text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Chaque voyage est unique et adapté à vos envies, votre budget et vos rêves d'aventure.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

      {/* Contact Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        <div className="w-full">
          <motion.div variants={fadeInUp} className="text-center mb-8 xl:mb-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 xl:mb-6">
              Contactez-Nous
            </h2>
            <div className="w-16 xl:w-24 h-1 bg-[#0F8FC6] mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            <motion.div variants={fadeInUp} className="text-center">
              <Phone className="w-10 h-10 xl:w-12 xl:h-12 text-[#0F8FC6] mx-auto mb-4 xl:mb-6" />
              <h3 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-3 xl:mb-4">Téléphone</h3>
              <div className="space-y-2">
                <a href="tel:+213666123456" className="block text-lg xl:text-xl text-gray-600 hover:text-[#0F8FC6] transition-colors">
                  +213 666 123 456
                </a>
                <a href="tel:+213555123456" className="block text-lg xl:text-xl text-gray-600 hover:text-[#0F8FC6] transition-colors">
                  +213 555 123 456
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <Mail className="w-10 h-10 xl:w-12 xl:h-12 text-[#0F8FC6] mx-auto mb-4 xl:mb-6" />
              <h3 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-3 xl:mb-4">Email</h3>
              <a href="mailto:contact@travel-agency.dz" className="text-lg xl:text-xl text-gray-600 hover:text-[#0F8FC6] transition-colors">
                contact@travel-agency.dz
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <MessageCircle className="w-10 h-10 xl:w-12 xl:h-12 text-[#0F8FC6] mx-auto mb-4 xl:mb-6" />
              <h3 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-3 xl:mb-4">WhatsApp</h3>
              <a href="https://wa.me/213540181618" className="text-lg xl:text-xl text-gray-600 hover:text-[#0F8FC6] transition-colors">
                Chat Direct
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Office Hours Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50"
      >
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 xl:mb-8 flex items-center gap-3 xl:gap-4">
                <MapPin className="w-10 h-10 xl:w-12 xl:h-12 text-[#0F8FC6]" />
                Nos Horaires
              </h2>

              <div className="space-y-6 xl:space-y-8">
                <div>
                  <h3 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-3 xl:mb-4 flex items-center gap-2 xl:gap-3">
                    <Clock className="w-5 h-5 xl:w-6 xl:h-6 text-[#0F8FC6]" />
                    Horaires d'Ouverture
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 xl:py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-base xl:text-lg">Samedi - Jeudi</span>
                      <span className="font-semibold text-gray-900 text-base xl:text-lg">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 xl:py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-base xl:text-lg">Vendredi</span>
                      <span className="font-semibold text-gray-900 text-base xl:text-lg">14:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 xl:py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-base xl:text-lg">Support 24/7</span>
                      <span className="font-semibold text-green-600 text-base xl:text-lg">Disponible</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <motion.img
                whileHover={{ scale: 1.02 }}
                src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop"
                alt="Travel Agency Office"
                className="w-full h-64 xl:h-80 object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
              <div className="absolute bottom-4 xl:bottom-6 left-4 xl:left-6 text-white">
                <p className="text-base xl:text-lg font-semibold">Notre Agence</p>
                <p className="text-sm xl:text-base opacity-90">Visitez-nous pour planifier votre voyage</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative"
      >
        <div className="text-center py-8 xl:py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 xl:mb-6">
            Venez Nous Rencontrer
          </h2>
          <p className="text-lg xl:text-xl text-gray-600 max-w-4xl xl:max-w-5xl mx-auto mb-6 xl:mb-8">
            Notre agence vous accueille dans un espace chaleureux et moderne. Consultez nos catalogues de voyages,
            rencontrez nos experts et laissez-nous créer le voyage parfait pour vous.
          </p>
        </div>

        <div className="w-full h-80 xl:h-96 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.1579872863896!2d3.0421999999999996!3d36.753889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad6f07b8e48f%3A0x266b06c6b1e8b5c7!2sAlger!5e0!3m2!1sfr!2sdz!4v1638000000000!5m2!1sfr!2sdz"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#0F8FC6]"
      >
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={fadeInUp} className="text-center text-white">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">5000+</p>
              <p className="text-lg opacity-90">Voyageurs Heureux</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center text-white">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-lg opacity-90">Destinations</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center text-white">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">15+</p>
              <p className="text-lg opacity-90">Années d'Expérience</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center text-white">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">4.9/5</p>
              <p className="text-lg opacity-90">Satisfaction Client</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
