import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Plane,
  Globe,
  MessageCircle,
  FileText,
  Building,
  GraduationCap,
  Home as HomeIcon,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const Services = () => {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const services = [
    {
      icon: Plane,
      title: t('services.items.ticketing.title'),
      description: t('services.items.ticketing.description'),
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Globe,
      title: t('services.items.organized.title'),
      description: t('services.items.organized.description'),
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageCircle,
      title: t('services.items.consultation.title'),
      description: t('services.items.consultation.description'),
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: t('services.items.visaTourist.title'),
      description: t('services.items.visaTourist.description'),
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Building,
      title: t('services.items.omraHajj.title'),
      description: t('services.items.omraHajj.description'),
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=500&fit=crop",
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      icon: GraduationCap,
      title: t('services.items.visaStudy.title'),
      description: t('services.items.visaStudy.description'),
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: HomeIcon,
      title: t('services.items.visaResidence.title'),
      description: t('services.items.visaResidence.description'),
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
      gradient: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop"
            alt="Travel Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-cyan-900/80 to-blue-800/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
              {t('services.hero.title')}
            </h1>

            <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mb-6"></div>

            <p className="text-lg lg:text-xl text-gray-100 mb-8 leading-relaxed">
              {t('services.list.subtitle')}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              {t('services.cta.button')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
      >

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`} />
                
                {/* Icon */}
                <div className="absolute top-4 right-4 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                >
                  <span>{t('services.cta.button')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>

              {/* Decorative element */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-800 dark:via-cyan-800 dark:to-blue-900"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
              {t('services.intro.title')}
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              {t('services.cta.description')}
            </p>

            <div className="space-y-4">
              {[
                'Accompagnement personnalisé',
                'Expertise professionnelle',
                'Service disponible 24/7',
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop"
              alt="Service 1"
              className="w-full h-48 object-cover rounded-2xl shadow-2xl"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
              alt="Service 2"
              className="w-full h-48 object-cover rounded-2xl shadow-2xl mt-8"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop"
              alt="Service 3"
              className="w-full h-48 object-cover rounded-2xl shadow-2xl -mt-8"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
              alt="Service 4"
              className="w-full h-48 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center shadow-2xl">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
            {t('services.cta.title')}
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-10">
            {t('services.cta.description')}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
          >
            <Sparkles className="w-6 h-6" />
            {t('services.cta.button')}
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;
