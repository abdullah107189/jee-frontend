export const productsData = [
  // =====================================================
  // AIR CONDITIONER
  // =====================================================
  {
    id: "prod_walton_ac_15",
    name: "Walton 1.5 Ton Inverter AC",
    slug: "walton-1-5-ton-inverter-ac",
    description:
      "Walton 1.5 Ton inverter air conditioner with energy efficient cooling technology.",
    specifications: {
      capacity: "1.5 Ton",
      type: "Inverter",
      refrigerant: "R32",
      voltage: "220-240V",
      coolingArea: "120-180 sq ft"
    },
    warrantyMonths: 60,
    warrantyTerms:
      "Compressor warranty up to 5 years. Other parts warranty according to manufacturer policy.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_ac",
    brandId: "brand_walton",

    variants: [
      {
        id: "var_walton_ac_15_white",
        sku: "WAL-AC-15INV-WHT",
        attributes: {
          capacity: "1.5 Ton",
          type: "Inverter",
          color: "White"
        },
        price: 62500,
        comparePrice: 68000,
        images: [
          "/products/ac/walton-1.5-ton-white-1.jpg",
          "/products/ac/walton-1.5-ton-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 2,
        isActive: true
      }
    ]
  },

  {
    id: "prod_gree_ac_15",
    name: "Gree 1.5 Ton Inverter AC",
    slug: "gree-1-5-ton-inverter-ac",
    description:
      "Gree 1.5 Ton inverter AC designed for fast and efficient cooling.",
    specifications: {
      capacity: "1.5 Ton",
      type: "Inverter",
      refrigerant: "R32",
      voltage: "220-240V",
      coolingArea: "120-180 sq ft"
    },
    warrantyMonths: 60,
    warrantyTerms:
      "Compressor and parts warranty according to Gree official warranty policy.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_ac",
    brandId: "brand_gree",

    variants: [
      {
        id: "var_gree_ac_15_white",
        sku: "GRE-AC-15INV-WHT",
        attributes: {
          capacity: "1.5 Ton",
          type: "Inverter",
          color: "White"
        },
        price: 66500,
        comparePrice: 72000,
        images: [
          "/products/ac/gree-1.5-ton-white-1.jpg",
          "/products/ac/gree-1.5-ton-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 2,
        isActive: true
      }
    ]
  },

  {
    id: "prod_singer_ac_12",
    name: "Singer 1 Ton Inverter AC",
    slug: "singer-1-ton-inverter-ac",
    description:
      "Singer 1 Ton inverter AC suitable for small and medium sized rooms.",
    specifications: {
      capacity: "1 Ton",
      type: "Inverter",
      refrigerant: "R32",
      voltage: "220-240V",
      coolingArea: "80-120 sq ft"
    },
    warrantyMonths: 60,
    warrantyTerms:
      "Warranty coverage according to Singer Bangladesh warranty policy.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_ac",
    brandId: "brand_singer",

    variants: [
      {
        id: "var_singer_ac_12_white",
        sku: "SNG-AC-10INV-WHT",
        attributes: {
          capacity: "1 Ton",
          type: "Inverter",
          color: "White"
        },
        price: 48500,
        comparePrice: 53000,
        images: [
          "/products/ac/singer-1-ton-white-1.jpg",
          "/products/ac/singer-1-ton-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 2,
        isActive: true
      }
    ]
  },

  // =====================================================
  // FAN
  // =====================================================
  {
    id: "prod_walton_fan_56",
    name: "Walton 56 Inch Ceiling Fan",
    slug: "walton-56-inch-ceiling-fan",
    description:
      "High speed and energy efficient ceiling fan for home and office.",
    specifications: {
      size: "56 Inch",
      type: "Ceiling Fan",
      speed: "High Speed",
      voltage: "220-240V",
      power: "75W"
    },
    warrantyMonths: 24,
    warrantyTerms:
      "2 years warranty according to manufacturer policy.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_fan",
    brandId: "brand_walton",

    variants: [
      {
        id: "var_walton_fan_56_black",
        sku: "WAL-FAN-56-BLK",
        attributes: {
          size: "56 Inch",
          color: "Black",
          speed: "High Speed"
        },
        price: 3850,
        comparePrice: 4200,
        images: [
          "/products/fans/walton-56-black-1.jpg",
          "/products/fans/walton-56-black-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: "var_walton_fan_56_white",
        sku: "WAL-FAN-56-WHT",
        attributes: {
          size: "56 Inch",
          color: "White",
          speed: "High Speed"
        },
        price: 3950,
        comparePrice: 4300,
        images: [
          "/products/fans/walton-56-white-1.jpg",
          "/products/fans/walton-56-white-2.jpg"
        ],
        isDefault: false,
        lowStockThreshold: 5,
        isActive: true
      }
    ]
  },

  {
    id: "prod_singer_fan_56",
    name: "Singer 56 Inch Ceiling Fan",
    slug: "singer-56-inch-ceiling-fan",
    description:
      "Durable ceiling fan with powerful airflow and low power consumption.",
    specifications: {
      size: "56 Inch",
      type: "Ceiling Fan",
      speed: "High Speed",
      voltage: "220-240V",
      power: "75W"
    },
    warrantyMonths: 24,
    warrantyTerms: "2 years service warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_fan",
    brandId: "brand_singer",

    variants: [
      {
        id: "var_singer_fan_56_white",
        sku: "SNG-FAN-56-WHT",
        attributes: {
          size: "56 Inch",
          color: "White",
          speed: "High Speed"
        },
        price: 3650,
        comparePrice: 4000,
        images: [
          "/products/fans/singer-56-white-1.jpg",
          "/products/fans/singer-56-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 5,
        isActive: true
      }
    ]
  },

  {
    id: "prod_vision_rechargeable_fan",
    name: "Vision Rechargeable Fan",
    slug: "vision-rechargeable-fan",
    description:
      "Rechargeable emergency fan with long battery backup.",
    specifications: {
      type: "Rechargeable Fan",
      battery: "12V",
      chargingTime: "6-8 Hours",
      backup: "Up to 8 Hours"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_fan",
    brandId: "brand_vision",

    variants: [
      {
        id: "var_vision_rechargeable_fan",
        sku: "VIS-FAN-RCH-12",
        attributes: {
          type: "Rechargeable",
          battery: "12V",
          color: "White"
        },
        price: 2850,
        comparePrice: 3200,
        images: [
          "/products/fans/vision-rechargeable-1.jpg",
          "/products/fans/vision-rechargeable-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 5,
        isActive: true
      }
    ]
  },

  // =====================================================
  // LIGHT
  // =====================================================
  {
    id: "prod_superstar_led_9w",
    name: "Super Star 9W LED Bulb",
    slug: "super-star-9w-led-bulb",
    description:
      "Energy saving LED bulb for home, office and commercial use.",
    specifications: {
      wattage: "9W",
      colorTemperature: "6500K",
      capType: "B22",
      voltage: "220-240V"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_light",
    brandId: "brand_superstar",

    variants: [
      {
        id: "var_superstar_led_9w_b22",
        sku: "SS-LED-9W-B22",
        attributes: {
          wattage: "9W",
          colorTemperature: "6500K",
          capType: "B22"
        },
        price: 180,
        comparePrice: 210,
        images: [
          "/products/lights/superstar-9w-b22-1.jpg",
          "/products/lights/superstar-9w-b22-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 20,
        isActive: true
      },
      {
        id: "var_superstar_led_9w_e27",
        sku: "SS-LED-9W-E27",
        attributes: {
          wattage: "9W",
          colorTemperature: "6500K",
          capType: "E27"
        },
        price: 190,
        comparePrice: 220,
        images: [
          "/products/lights/superstar-9w-e27-1.jpg",
          "/products/lights/superstar-9w-e27-2.jpg"
        ],
        isDefault: false,
        lowStockThreshold: 20,
        isActive: true
      }
    ]
  },

  {
    id: "prod_superstar_led_12w",
    name: "Super Star 12W LED Bulb",
    slug: "super-star-12w-led-bulb",
    description:
      "Bright and energy efficient LED bulb for everyday lighting.",
    specifications: {
      wattage: "12W",
      colorTemperature: "6500K",
      capType: "B22",
      voltage: "220-240V"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_light",
    brandId: "brand_superstar",

    variants: [
      {
        id: "var_superstar_led_12w",
        sku: "SS-LED-12W-B22",
        attributes: {
          wattage: "12W",
          colorTemperature: "6500K",
          capType: "B22"
        },
        price: 220,
        comparePrice: 250,
        images: [
          "/products/lights/superstar-12w-1.jpg",
          "/products/lights/superstar-12w-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 20,
        isActive: true
      }
    ]
  },

  {
    id: "prod_walton_panel_18w",
    name: "Walton 18W LED Panel Light",
    slug: "walton-18w-led-panel-light",
    description:
      "Slim LED panel light for modern indoor lighting.",
    specifications: {
      wattage: "18W",
      shape: "Round",
      colorTemperature: "6500K",
      voltage: "220-240V"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_light",
    brandId: "brand_walton",

    variants: [
      {
        id: "var_walton_panel_18w",
        sku: "WAL-PNL-18W-RND",
        attributes: {
          wattage: "18W",
          shape: "Round",
          colorTemperature: "6500K"
        },
        price: 550,
        comparePrice: 650,
        images: [
          "/products/lights/walton-panel-18w-1.jpg",
          "/products/lights/walton-panel-18w-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 10,
        isActive: true
      }
    ]
  },

  {
    id: "prod_vision_tube_20w",
    name: "Vision LED Tube Light 20W",
    slug: "vision-led-tube-light-20w",
    description:
      "Energy efficient LED tube light for home and commercial use.",
    specifications: {
      wattage: "20W",
      length: "4 Feet",
      colorTemperature: "6500K",
      voltage: "220-240V"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_light",
    brandId: "brand_vision",

    variants: [
      {
        id: "var_vision_tube_20w",
        sku: "VIS-TUBE-20W",
        attributes: {
          wattage: "20W",
          length: "4 Feet",
          colorTemperature: "6500K"
        },
        price: 380,
        comparePrice: 450,
        images: [
          "/products/lights/vision-tube-20w-1.jpg",
          "/products/lights/vision-tube-20w-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 10,
        isActive: true
      }
    ]
  },

  // =====================================================
  // SWITCH & SOCKET
  // =====================================================
  {
    id: "prod_click_switch_1way",
    name: "Click 1 Gang 1 Way Switch",
    slug: "click-1-gang-1-way-switch",
    description:
      "Premium quality electrical wall switch for residential and commercial use.",
    specifications: {
      gang: "1 Gang",
      type: "1 Way",
      voltage: "220-240V",
      color: "White"
    },
    warrantyMonths: 12,
    warrantyTerms:
      "Replacement warranty according to seller policy.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_switch_socket",
    brandId: "brand_click",

    variants: [
      {
        id: "var_click_switch_1way_white",
        sku: "CLK-SW-1G-1W-WHT",
        attributes: {
          gang: "1 Gang",
          type: "1 Way",
          color: "White"
        },
        price: 145,
        comparePrice: 170,
        images: [
          "/products/switches/click-1gang-1way-white-1.jpg",
          "/products/switches/click-1gang-1way-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 10,
        isActive: true
      }
    ]
  },

  {
    id: "prod_click_socket_13a",
    name: "Click 13A Universal Socket",
    slug: "click-13a-universal-socket",
    description:
      "Durable universal electrical socket for home and office.",
    specifications: {
      ampere: "13A",
      type: "Universal",
      voltage: "220-240V",
      color: "White"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_switch_socket",
    brandId: "brand_click",

    variants: [
      {
        id: "var_click_socket_13a_white",
        sku: "CLK-SKT-13A-WHT",
        attributes: {
          ampere: "13A",
          type: "Universal",
          color: "White"
        },
        price: 420,
        comparePrice: 480,
        images: [
          "/products/sockets/click-13a-white-1.jpg",
          "/products/sockets/click-13a-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 10,
        isActive: true
      }
    ]
  },

  {
    id: "prod_havells_socket_2pin",
    name: "Havells 2 Pin Socket",
    slug: "havells-2-pin-socket",
    description:
      "Compact and durable electrical socket for everyday use.",
    specifications: {
      type: "2 Pin",
      ampere: "6A",
      voltage: "220-240V",
      color: "White"
    },
    warrantyMonths: 12,
    warrantyTerms: "Manufacturer warranty applies.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_switch_socket",
    brandId: "brand_havells",

    variants: [
      {
        id: "var_havells_socket_2pin",
        sku: "HVL-SKT-2PIN-WHT",
        attributes: {
          type: "2 Pin",
          ampere: "6A",
          color: "White"
        },
        price: 180,
        comparePrice: 220,
        images: [
          "/products/sockets/havells-2pin-white-1.jpg",
          "/products/sockets/havells-2pin-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 10,
        isActive: true
      }
    ]
  },

  {
    id: "prod_superstar_switch_board_4g",
    name: "Super Star 4 Gang Switch Board",
    slug: "super-star-4-gang-switch-board",
    description:
      "Modern multi-gang switch board for residential use.",
    specifications: {
      gang: "4 Gang",
      type: "Switch Board",
      voltage: "220-240V",
      color: "White"
    },
    warrantyMonths: 12,
    warrantyTerms: "1 year warranty.",
    isPublished: true,
    isActive: true,
    categoryId: "cat_switch_socket",
    brandId: "brand_superstar",

    variants: [
      {
        id: "var_superstar_switch_board_4g",
        sku: "SS-SWB-4G-WHT",
        attributes: {
          gang: "4 Gang",
          type: "Switch Board",
          color: "White"
        },
        price: 650,
        comparePrice: 750,
        images: [
          "/products/switches/superstar-4gang-white-1.jpg",
          "/products/switches/superstar-4gang-white-2.jpg"
        ],
        isDefault: true,
        lowStockThreshold: 5,
        isActive: true
      }
    ]
  }
];
