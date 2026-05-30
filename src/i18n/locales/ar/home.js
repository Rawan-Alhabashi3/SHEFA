const home = {
  page: {
    loadError: 'تعذر تحميل بيانات الصفحة الرئيسية المباشرة.',
  },

  hero: {
    eyebrow: 'منصة الرعاية الصحية الموثوقة',
    title: 'كل ما تحتاجه من الصيدليات في مكان واحد',
    body: 'ابحث واطلب الأدوية ومنتجات العناية بسهولة من صيدليات موثوقة.',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن دواء أو صيدلية...',
    browseMedicines: 'تصفح الأدوية',
    viewPharmacies: 'عرض الصيدليات',
    exploreMarketplace: 'استكشف السوق',
    donationResale: 'التبرع وإعادة البيع',
    successfulDeliveries: 'عمليات التوصيل الناجحة',
    verifiedPharmacies: 'الصيدليات الموثوقة',
  },

  search: {
    placeholder: 'ابحث عن أدوية أو صيدليات...',
    submit: 'بحث',
    allCities: 'كل المدن',
    unavailable: 'البحث غير متاح مؤقتا.',
    empty: 'لا توجد نتائج.',
    medicineFallback: 'دواء',
    groups: {
      medicines: 'الأدوية',
      pharmacies: 'الصيدليات',
      categories: 'التصنيفات',
    },
    governorates: {
      damascus: 'دمشق',
      rifDimashq: 'ريف دمشق',
      aleppo: 'حلب',
      homs: 'حمص',
      hama: 'حماة',
      lattakia: 'اللاذقية',
      tartous: 'طرطوس',
      daraa: 'درعا',
      deirEzZor: 'دير الزور',
      hasakah: 'الحسكة',
      raqqa: 'الرقة',
      suwayda: 'السويداء',
      quneitra: 'القنيطرة',
    },
  },

  categories: {
    title: 'تصفح حسب التصنيف',
    itemCount: '{{count}} عنصر',
    empty: 'ستظهر التصنيفات بمجرد توفر الأدوية.',
  },

  featuredMedicines: {
    eyebrow: 'الأكثر مبيعا',
    title: 'الأدوية المميزة',
    browseAll: 'تصفح جميع الأدوية',
    emptyTitle: 'لا توجد أدوية مميزة حاليا',
    emptyDescription:
      'ستظهر الأدوية المتاحة هنا بعد أن تضيف الصيدليات مخزونها.',
  },

  nearbyPharmacies: {
    title: 'ابحث عن صيدليات قريبة منك',
    viewAll: 'عرض جميع الصيدليات',
    emptyTitle: 'لا توجد صيدليات متاحة',
    emptyDescription: 'يرجى المحاولة لاحقا.',
  },

  services: {
    title: 'كل ما تحتاجه في منصة واحدة',
    items: {
      medicineOrdering: {
        title: 'طلب الأدوية',
        description: 'تصفح الأدوية واطلبها بسرعة.',
      },
      fastDelivery: {
        title: 'توصيل سريع',
        description: 'احصل على الأدوية خلال دقائق.',
      },
      onlineConsultation: {
        title: 'استشارة عبر الإنترنت',
        description: 'تواصل مع خبراء رعاية صحية معتمدين.',
      },
      prescriptionUpload: {
        title: 'رفع الوصفة الطبية',
        description: 'ارفع وصفتك الطبية بأمان.',
      },
      securePayments: {
        title: 'مدفوعات آمنة',
        description: 'خيارات دفع موثوقة ومشفرة.',
      },
      trustedPharmacies: {
        title: 'صيدليات موثوقة',
        description: 'شبكة شركاء من الصيدليات الأعلى تقييما.',
      },
    },
  },

  campaigns: {
    eyebrow: 'مكافآت الولاء',
    title: 'حملات كوبونات الصيدليات',
    browseMarketplace: 'تصفح السوق',
    loading: 'جار تحميل حملات المكافآت...',
    emptyTitle: 'لا توجد حملات عامة حاليا',
    emptyDescription:
      'يمكن للصيدليات نشر قواعد مكافآت منتجات التجميل والعناية من لوحة التحكم.',
    cosmeticsOnly: 'لمنتجات التجميل والعناية فقط',
    validationDescription:
      'لا تنطبق كوبونات المكافآت على الأدوية أو المنتجات التي تتطلب وصفة طبية. يتحقق الدفع من أهلية الصيدلية والعميل والمنتجات.',
    card: {
      percentCare: '% مكافأة عناية',
      defaultDescription: 'اكسب مكافآت على مشتريات التجميل والعناية المؤهلة.',
      rule: 'القاعدة: ',
      eligible: 'المؤهل: ',
      couponValid: 'صلاحية الكوبون',
      daysCareOnly: 'يوما - لمنتجات التجميل والعناية فقط',
      ordersOver: 'طلبات من هذه الصيدلية بقيمة تتجاوز',
      usdOrderTotal: 'دولار أمريكي إجمالي الطلب',
      viewPharmacy: 'عرض الصيدلية',
    },
    community: {
      eyebrow: 'التبرع وإعادة البيع',
      title: 'أحدث عروض التبرع وإعادة البيع',
      openHub: 'فتح مركز التبرعات',
      emptyDescription:
        'ستظهر عروض التبرع وإعادة البيع المعتمدة هنا بعد استلام الصيدلية.',
      locationSeparator: ' - ',
      free: 'مجاني',
      badges: {
        donation: 'تبرع',
        resale: 'إعادة بيع',
        verified: 'موثق',
      },
    },
    marketplaceCta: {
      title: 'اكتشف الصيدليات والمكافآت',
      description: 'تصفح الحملات وكتالوجات التجميل والبائعين الموثوقين.',
    },
    donationCta: {
      title: 'تبرع أو أعد البيع بأمان',
      description: 'أرسل الأدوية غير المستخدمة لمراجعتها من صيدلية في نفس المنطقة.',
    },
  },

  testimonials: {
    title: 'ماذا يقول المرضى',
    empty: 'لا توجد آراء عامة حتى الآن. كن أول من يشارك تجربته.',
  },

  statistics: {
    verifiedPharmacies: 'الصيدليات الموثوقة',
    medicinesAvailable: 'الأدوية المتوفرة',
    activeUsers: 'المستخدمون النشطون',
    successfulDeliveries: 'عمليات التوصيل الناجحة',
  },
}

export default home
