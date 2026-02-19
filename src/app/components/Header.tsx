  const navItems = [
    { name: 'ACCUEIL', href: '/', active: true },
    {
      name: 'QUI SOMMES-NOUS',
      href: '#',
      dropdown: [
        { name: 'Présentation du Centre', href: '/apropos' },
        { name: 'Notre équipe', href: '/equipe' },
      ],
    },
    {
      name: 'NOS SERVICES',
      href: '#',
      dropdown: [
        { name: 'Seniors', href: '/seniors' },
        { name: 'REEAP', href: '/reeap' },
        { name: 'Ti-Ludo (LAEP)', href: '/tiludo' },
        { name: 'Jeunesse', href: '/jeunesse' },
      ],
    },
    { name: 'ÉVÉNEMENTS', href: '/evenements' },
    { name: 'PARTENAIRES', href: '/partenaires' },
    { name: 'CONTACT', href: '/contact' },
  ];