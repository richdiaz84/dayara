
export const products = [
  {
    id: "1",
    name: "Set de Esmaltes Gel UV 'Galaxy Dreams'",
    description: "Colección de 6 esmaltes en gel con acabado brillante y colores inspirados en la galaxia. Larga duración y secado rápido con lámpara UV/LED.",
    price: 29.99,
    originalPrice: 35.00,
    images: [
      { id: "img1", alt: "Set de esmaltes Galaxy Dreams en sus botellas", description: "Botellas de esmaltes de uñas coloridos con temática galáctica" },
      { id: "img2", alt: "Muestras de colores de esmaltes Galaxy Dreams en uñas postizas", description: "Muestras de colores vibrantes de esmaltes en uñas postizas" },
    ],
    category: "GEL SYSTEM",
    stock: 50,
    rating: 4.8,
    reviews: 120,
    tags: ["gel", "uv", "galaxy", "brillante", "set"],
    isNew: true,
    onSale: true,
  },
  {
    id: "2",
    name: "Kit Decoración Uñas 'Floral Fantasy'",
    description: "Completo kit con stickers de flores, pedrería fina, y herramientas de punteado para diseños florales encantadores.",
    price: 19.99,
    images: [
      { id: "img3", alt: "Kit de decoración de uñas Floral Fantasy con varios elementos", description: "Kit de nail art con stickers florales y pedrería" },
      { id: "img4", alt: "Ejemplo de diseño de uñas floral creado con el kit", description: "Uñas decoradas con motivos florales utilizando el kit" },
    ],
    category: "DECORATION LINE",
    stock: 75,
    rating: 4.5,
    reviews: 85,
    tags: ["decoracion", "flores", "stickers", "pedreria", "kit"],
    isNew: false,
    onSale: false,
  },
  {
    id: "3",
    name: "Lámpara LED/UV Profesional 'Pro Cure X5'",
    description: "Lámpara de 48W con sensor inteligente, múltiples temporizadores y diseño espacioso para manos y pies. Cura todo tipo de geles.",
    price: 45.50,
    images: [
      { id: "img5", alt: "Lámpara LED/UV Pro Cure X5 color blanco", description: "Lámpara profesional blanca para secado de uñas de gel" },
    ],
    category: "NAIL TOOLS LINE",
    stock: 30,
    rating: 4.9,
    reviews: 210,
    tags: ["lampara", "led", "uv", "profesional", "secado"],
    isNew: true,
    onSale: false,
  },
  {
    id: "4",
    name: "Polvo Acrílico 'Crystal Clear'",
    description: "Polvo acrílico transparente de alta calidad para construcción y encapsulado. Fórmula autonivelante y de gran adherencia.",
    price: 15.00,
    images: [
      { id: "img6", alt: "Envase de polvo acrílico Crystal Clear", description: "Tarro de polvo acrílico transparente para uñas" },
    ],
    category: "ACRILYC SYSTEM",
    stock: 100,
    rating: 4.7,
    reviews: 95,
    tags: ["acrilico", "polvo", "transparente", "construccion"],
    isNew: false,
    onSale: true,
    originalPrice: 18.00,
  },
  {
    id: "5",
    name: "Pincel para Nail Art 'Detail Master #00'",
    description: "Pincel ultra fino de alta precisión, ideal para líneas detalladas, dibujos y micro pintura en uñas. Cerdas sintéticas de calidad.",
    price: 8.99,
    images: [
      { id: "img7", alt: "Pincel fino para nail art Detail Master", description: "Pincel de detalle para nail art con punta fina" },
    ],
    category: "BRUSH",
    stock: 120,
    rating: 4.6,
    reviews: 70,
    tags: ["pincel", "detalle", "nail art", "dibujo"],
    isNew: false,
    onSale: false,
  },
  {
    id: "6",
    name: "Top Coat Efecto Mate 'Velvet Touch'",
    description: "Transforma cualquier color de esmalte en un acabado mate aterciopelado. Larga duración y protección anti-rayaduras.",
    price: 12.50,
    images: [
      { id: "img8", alt: "Botella de top coat efecto mate Velvet Touch", description: "Esmalte top coat con acabado mate" },
    ],
    category: "EFFECT SYSTEM",
    stock: 60,
    rating: 4.8,
    reviews: 150,
    tags: ["top coat", "mate", "acabado", "esmalte"],
    isNew: true,
    onSale: false,
  },
  {
    id: "7",
    name: "Gel de Tallado 3D 'SculptIt White'",
    description: "Gel de alta viscosidad perfecto para crear diseños 3D en uñas. Color blanco puro, fácil de moldear.",
    price: 18.75,
    images: [
      { id: "img9", alt: "Envase de gel de tallado 3D SculptIt White", description: "Tarro de gel blanco para diseños 3D en uñas" },
    ],
    category: "3D CARVING GEL",
    stock: 40,
    rating: 4.7,
    reviews: 65,
    tags: ["3d", "carving", "gel", "sculpt", "blanco"],
    isNew: true,
    onSale: false,
  },
  {
    id: "8",
    name: "Set de Geles Artísticos 'Rainbow Palette'",
    description: "Colección de 12 geles artísticos altamente pigmentados para diseños detallados y pintura a mano alzada.",
    price: 39.99,
    images: [
      { id: "img10", alt: "Paleta de geles artísticos Rainbow Palette", description: "Set de pequeños tarros de geles de colores para nail art" },
    ],
    category: "ART GEL",
    stock: 35,
    rating: 4.9,
    reviews: 90,
    tags: ["art gel", "pintura", "diseño", "colorido", "set"],
    isNew: false,
    onSale: true,
    originalPrice: 45.00,
  },
  {
    id: "9",
    name: "Placa de Stamping 'Geometric Patterns'",
    description: "Placa de acero inoxidable con diversos patrones geométricos para stamping nail art.",
    price: 9.50,
    images: [
      { id: "img11", alt: "Placa de stamping con diseños geométricos", description: "Placa metálica con grabados de patrones geométricos para uñas" },
    ],
    category: "STAMPING ART",
    stock: 80,
    rating: 4.6,
    reviews: 110,
    tags: ["stamping", "placa", "geometrico", "diseño"],
    isNew: false,
    onSale: false,
  },
  {
    id: "10",
    name: "Empujador de Cutícula Profesional",
    description: "Herramienta de acero inoxidable de doble punta para empujar cutículas y limpiar el área de la uña.",
    price: 7.20,
    images: [
      { id: "img12", alt: "Empujador de cutícula metálico", description: "Herramienta profesional para cutículas de acero inoxidable" },
    ],
    category: "NAIL TOOLS LINE",
    stock: 150,
    rating: 4.8,
    reviews: 130,
    tags: ["herramienta", "cuticula", "profesional", "acero"],
    isNew: false,
    onSale: false,
  }
];
