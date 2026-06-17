import { PrismaClient, ProductType, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // Fournisseurs
  const hachette = await prisma.supplier.upsert({
    where: { id: "supplier-hachette" },
    update: {},
    create: {
      id: "supplier-hachette",
      name: "Hachette Distribution",
      contact: "Jean Dupont",
      phone: "01 43 92 30 00",
      email: "commandes@hachette.fr",
      address: "58 rue Jean Bleuzen, 92178 Vanves",
    },
  });

  const gallimard = await prisma.supplier.upsert({
    where: { id: "supplier-gallimard" },
    update: {},
    create: {
      id: "supplier-gallimard",
      name: "Gallimard Diffusion",
      contact: "Marie Martin",
      phone: "01 49 54 42 00",
      email: "diffusion@gallimard.fr",
      address: "5 rue Sébastien Bottin, 75007 Paris",
    },
  });

  const buroplus = await prisma.supplier.upsert({
    where: { id: "supplier-buroplus" },
    update: {},
    create: {
      id: "supplier-buroplus",
      name: "BuroPlus Fournitures",
      contact: "Ahmed Benali",
      phone: "04 72 33 44 55",
      email: "pro@buroplus.fr",
      address: "12 avenue des Industries, 69100 Villeurbanne",
    },
  });

  const staedtler = await prisma.supplier.upsert({
    where: { id: "supplier-staedtler" },
    update: {},
    create: {
      id: "supplier-staedtler",
      name: "Staedtler France",
      contact: "Lucie Bernard",
      phone: "03 26 84 47 00",
      email: "france@staedtler.com",
      address: "21 rue des Capucins, 51100 Reims",
    },
  });

  // Livres
  const livres = [
    {
      id: "livre-001",
      name: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      publisher: "Gallimard",
      isbn: "9782070612758",
      genre: "Littérature classique",
      buyPrice: 5.5,
      sellPrice: 8.5,
      stock: 12,
      alertThreshold: 3,
      location: "Rayon A - Étagère 2",
      barcode: "9782070612758",
      supplierId: gallimard.id,
    },
    {
      id: "livre-002",
      name: "L'Alchimiste",
      author: "Paulo Coelho",
      publisher: "Anne Carrière",
      isbn: "9782841720200",
      genre: "Roman",
      buyPrice: 6.0,
      sellPrice: 9.5,
      stock: 8,
      alertThreshold: 3,
      location: "Rayon A - Étagère 3",
      barcode: "9782841720200",
      supplierId: gallimard.id,
    },
    {
      id: "livre-003",
      name: "Harry Potter à l'École des Sorciers",
      author: "J.K. Rowling",
      publisher: "Gallimard Jeunesse",
      isbn: "9782070541270",
      genre: "Fantasy / Jeunesse",
      buyPrice: 8.5,
      sellPrice: 14.0,
      stock: 15,
      alertThreshold: 5,
      location: "Rayon B - Étagère 1",
      barcode: "9782070541270",
      supplierId: gallimard.id,
    },
    {
      id: "livre-004",
      name: "1984",
      author: "George Orwell",
      publisher: "Gallimard",
      isbn: "9782072762093",
      genre: "Science-fiction",
      buyPrice: 7.0,
      sellPrice: 10.5,
      stock: 2,
      alertThreshold: 3,
      location: "Rayon A - Étagère 5",
      barcode: "9782072762093",
      supplierId: gallimard.id,
    },
    {
      id: "livre-005",
      name: "Les Misérables",
      author: "Victor Hugo",
      publisher: "Folio Classique",
      isbn: "9782070409228",
      genre: "Littérature classique",
      buyPrice: 9.0,
      sellPrice: 13.5,
      stock: 5,
      alertThreshold: 2,
      location: "Rayon A - Étagère 1",
      barcode: "9782070409228",
      supplierId: hachette.id,
    },
    {
      id: "livre-006",
      name: "Le Comte de Monte-Cristo",
      author: "Alexandre Dumas",
      publisher: "Folio Classique",
      isbn: "9782070413119",
      genre: "Aventure",
      buyPrice: 10.0,
      sellPrice: 15.0,
      stock: 0,
      alertThreshold: 2,
      location: "Rayon A - Étagère 1",
      barcode: "9782070413119",
      supplierId: hachette.id,
    },
    {
      id: "livre-007",
      name: "Dune",
      author: "Frank Herbert",
      publisher: "Robert Laffont",
      isbn: "9782221257951",
      genre: "Science-fiction",
      buyPrice: 9.5,
      sellPrice: 14.5,
      stock: 6,
      alertThreshold: 3,
      location: "Rayon B - Étagère 3",
      barcode: "9782221257951",
      supplierId: hachette.id,
    },
    {
      id: "livre-008",
      name: "Atomic Habits",
      author: "James Clear",
      publisher: "Marabout",
      isbn: "9782501153867",
      genre: "Développement personnel",
      buyPrice: 10.0,
      sellPrice: 16.5,
      stock: 10,
      alertThreshold: 4,
      location: "Rayon C - Étagère 2",
      barcode: "9782501153867",
      supplierId: hachette.id,
    },
    {
      id: "livre-dev-001",
      name: "S'ÉLEVER - Débloquer votre plein potentiel",
      author: "Émilie Dumont",
      publisher: "Éditions Croissance",
      isbn: "9780000000001",
      genre: "Développement personnel",
      buyPrice: 12.0,
      sellPrice: 19.9,
      stock: 15,
      alertThreshold: 3,
      location: "Rayon D - Étagère 1",
      barcode: "9780000000001",
      supplierId: hachette.id,
      imageUrl: "/images/books/dev_perso_1.jpg"
    },
    {
      id: "livre-dev-002",
      name: "CALME INTÉRIEUR - L'art de vivre au présent",
      author: "Lucas Bernard",
      publisher: "Éditions Croissance",
      isbn: "9780000000002",
      genre: "Développement personnel",
      buyPrice: 11.5,
      sellPrice: 18.5,
      stock: 20,
      alertThreshold: 5,
      location: "Rayon D - Étagère 1",
      barcode: "9780000000002",
      supplierId: hachette.id,
      imageUrl: "/images/books/dev_perso_2.jpg"
    },
    {
      id: "livre-dev-003",
      name: "CICATRICES DORÉES - Transformer ses blessures en force",
      author: "Lucas Bernard",
      publisher: "Éditions Croissance",
      isbn: "9780000000003",
      genre: "Développement personnel",
      buyPrice: 13.0,
      sellPrice: 21.0,
      stock: 12,
      alertThreshold: 3,
      location: "Rayon D - Étagère 1",
      barcode: "9780000000003",
      supplierId: hachette.id,
      imageUrl: "/images/books/dev_perso_3.jpg"
    },
    {
      id: "livre-dev-004",
      name: "OBJECTIFS ATTEINTS - Le guide de la productivité motivée",
      author: "Lucas Bernard",
      publisher: "Éditions Croissance",
      isbn: "9780000000004",
      genre: "Développement personnel",
      buyPrice: 14.5,
      sellPrice: 22.9,
      stock: 8,
      alertThreshold: 2,
      location: "Rayon D - Étagère 2",
      barcode: "9780000000004",
      supplierId: gallimard.id,
      imageUrl: "/images/books/dev_perso_4.jpg"
    },
    {
      id: "livre-dev-005",
      name: "OSEZ BRILLER - Cultivez une confiance radieuse",
      author: "Émilie Dumont",
      publisher: "Éditions Croissance",
      isbn: "9780000000005",
      genre: "Développement personnel",
      buyPrice: 10.0,
      sellPrice: 17.5,
      stock: 25,
      alertThreshold: 5,
      location: "Rayon D - Étagère 2",
      barcode: "9780000000005",
      supplierId: gallimard.id,
      imageUrl: "/images/books/dev_perso_5.jpg"
    },
    {
      id: "livre-dev-006",
      name: "LES PETITES VICTOIRES - Créer des habitudes révolutionnaires",
      author: "Émilie Dumont",
      publisher: "Éditions Croissance",
      isbn: "9780000000006",
      genre: "Développement personnel",
      buyPrice: 12.5,
      sellPrice: 19.5,
      stock: 18,
      alertThreshold: 4,
      location: "Rayon D - Étagère 2",
      barcode: "9780000000006",
      supplierId: gallimard.id,
      imageUrl: "/images/books/dev_perso_6.jpg"
    },
    {
      id: "livre-dev-007",
      name: "TROUVER SA VOIE - Explorer votre purpose unique",
      author: "Lucas Bernard",
      publisher: "Éditions Croissance",
      isbn: "9780000000007",
      genre: "Développement personnel",
      buyPrice: 11.0,
      sellPrice: 18.9,
      stock: 14,
      alertThreshold: 3,
      location: "Rayon D - Étagère 3",
      barcode: "9780000000007",
      supplierId: hachette.id,
      imageUrl: "/images/books/dev_perso_7.jpg"
    },
    {
      id: "livre-dev-008",
      name: "LIENS AUTHENTIQUES - Nourrir des relations épanouies",
      author: "Émilie Dumont",
      publisher: "Éditions Croissance",
      isbn: "9780000000008",
      genre: "Développement personnel",
      buyPrice: 13.5,
      sellPrice: 20.5,
      stock: 10,
      alertThreshold: 3,
      location: "Rayon D - Étagère 3",
      barcode: "9780000000008",
      supplierId: hachette.id,
      imageUrl: "/images/books/dev_perso_8.jpg"
    },
    {
      id: "livre-dev-009",
      name: "L'ÉTINCELLE INTÉRIEURE - Cultiver le bonheur au quotidien",
      author: "Lucas Bernard",
      publisher: "Éditions Croissance",
      isbn: "9780000000009",
      genre: "Développement personnel",
      buyPrice: 12.0,
      sellPrice: 19.0,
      stock: 22,
      alertThreshold: 5,
      location: "Rayon D - Étagère 3",
      barcode: "9780000000009",
      supplierId: gallimard.id,
      imageUrl: "/images/books/dev_perso_9.jpg"
    },
    {
      id: "livre-dev-010",
      name: "LUMIÈRE D'ÉVEIL - Vers une conscience supérieure",
      author: "Émilie Dumont",
      publisher: "Éditions Croissance",
      isbn: "978000000010",
      genre: "Développement personnel",
      buyPrice: 15.0,
      sellPrice: 24.0,
      stock: 6,
      alertThreshold: 2,
      location: "Rayon D - Étagère 3",
      barcode: "978000000010",
      supplierId: gallimard.id,
      imageUrl: "/images/books/dev_perso_10.jpg"
    }
  ];

  for (const livre of livres) {
    const imgUrl = livre.imageUrl || `https://covers.openlibrary.org/b/isbn/${livre.isbn}-L.jpg`;
    await prisma.product.upsert({
      where: { id: livre.id },
      update: {
        imageUrl: imgUrl
      },
      create: {
        ...livre,
        imageUrl: imgUrl,
        type: ProductType.LIVRE,
      },
    });
  }

  // Fournitures
  const fournitures = [
    {
      id: "fourn-001",
      name: "Stylo Bille Bleu BIC Cristal",
      brand: "BIC",
      category: "Stylos",
      sku: "BIC-CRISTAL-BLU",
      barcode: "3086123205249",
      buyPrice: 0.25,
      sellPrice: 0.6,
      stock: 150,
      alertThreshold: 30,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-002",
      name: "Stylo Feutre Staedtler Triplus (set x10)",
      brand: "Staedtler",
      category: "Stylos",
      sku: "STAD-TRIPLUS-10",
      barcode: "4007817334010",
      buyPrice: 4.5,
      sellPrice: 8.9,
      stock: 25,
      alertThreshold: 5,
      supplierId: staedtler.id,
    },
    {
      id: "fourn-003",
      name: "Cahier Oxford A4 Grands Carreaux 96p",
      brand: "Oxford",
      category: "Cahiers & Carnets",
      sku: "OXF-A4-GC-96",
      barcode: "3020120124893",
      buyPrice: 1.8,
      sellPrice: 3.5,
      stock: 80,
      alertThreshold: 20,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-004",
      name: "Cahier Spirale A5 Petits Carreaux 180p",
      brand: "Clairefontaine",
      category: "Cahiers & Carnets",
      sku: "CLF-A5-PC-180",
      barcode: "3329680085750",
      buyPrice: 2.2,
      sellPrice: 4.2,
      stock: 3,
      alertThreshold: 10,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-005",
      name: "Crayon à Papier HB Staedtler (lot x12)",
      brand: "Staedtler",
      category: "Crayons",
      sku: "STAD-HB-12",
      barcode: "4007817132197",
      buyPrice: 1.5,
      sellPrice: 3.2,
      stock: 40,
      alertThreshold: 10,
      supplierId: staedtler.id,
    },
    {
      id: "fourn-006",
      name: "Colle en Bâton UHU 21g",
      brand: "UHU",
      category: "Colles & Adhésifs",
      sku: "UHU-BATON-21G",
      barcode: "4026700004515",
      buyPrice: 0.9,
      sellPrice: 1.8,
      stock: 55,
      alertThreshold: 15,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-007",
      name: "Surligneur Stabilo Boss x4 couleurs",
      brand: "Stabilo",
      category: "Stylos",
      sku: "STAB-BOSS-4C",
      barcode: "4006381505864",
      buyPrice: 2.1,
      sellPrice: 4.5,
      stock: 30,
      alertThreshold: 8,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-008",
      name: "Règle 30cm Transparent",
      brand: "Staedtler",
      category: "Matériel Scolaire",
      sku: "STAD-REGLE-30",
      barcode: "4007817561904",
      buyPrice: 0.4,
      sellPrice: 0.95,
      stock: 1,
      alertThreshold: 5,
      supplierId: staedtler.id,
    },
    {
      id: "fourn-009",
      name: "Agenda 2025 Format A5",
      brand: "Quo Vadis",
      category: "Agendas & Planners",
      sku: "QV-AGENDA-A5-2025",
      barcode: "3004496088524",
      buyPrice: 5.0,
      sellPrice: 9.9,
      stock: 20,
      alertThreshold: 5,
      supplierId: buroplus.id,
    },
    {
      id: "fourn-010",
      name: "Gomme Staedtler Mars Plastic",
      brand: "Staedtler",
      category: "Crayons",
      sku: "STAD-GOMME-MARS",
      barcode: "4007817526651",
      buyPrice: 0.5,
      sellPrice: 1.1,
      stock: 70,
      alertThreshold: 20,
      supplierId: staedtler.id,
    },
  ];

  for (const fourn of fournitures) {
    await prisma.product.upsert({
      where: { id: fourn.id },
      update: {},
      create: {
        ...fourn,
        type: ProductType.FOURNITURE,
      },
    });
  }

  // Ventes d'exemple (30 derniers jours)
  const now = new Date();
  const salesData = [
    {
      daysAgo: 0,
      items: [
        { productId: "livre-001", qty: 2, price: 8.5 },
        { productId: "fourn-003", qty: 3, price: 3.5 },
      ],
      payment: PaymentMethod.ESPECES,
      amountPaid: 32,
    },
    {
      daysAgo: 0,
      items: [
        { productId: "livre-003", qty: 1, price: 14.0 },
        { productId: "fourn-001", qty: 5, price: 0.6 },
      ],
      payment: PaymentMethod.CARTE,
      amountPaid: 17.0,
    },
    {
      daysAgo: 1,
      items: [
        { productId: "livre-008", qty: 1, price: 16.5 },
        { productId: "fourn-007", qty: 2, price: 4.5 },
      ],
      payment: PaymentMethod.CARTE,
      amountPaid: 25.5,
    },
    {
      daysAgo: 1,
      items: [{ productId: "livre-005", qty: 1, price: 13.5 }],
      payment: PaymentMethod.ESPECES,
      amountPaid: 15,
    },
    {
      daysAgo: 2,
      items: [
        { productId: "fourn-005", qty: 2, price: 3.2 },
        { productId: "fourn-006", qty: 3, price: 1.8 },
        { productId: "fourn-010", qty: 2, price: 1.1 },
      ],
      payment: PaymentMethod.ESPECES,
      amountPaid: 15,
    },
    {
      daysAgo: 3,
      items: [
        { productId: "livre-002", qty: 1, price: 9.5 },
        { productId: "livre-007", qty: 1, price: 14.5 },
      ],
      payment: PaymentMethod.CHEQUE,
      amountPaid: 24.0,
    },
    {
      daysAgo: 5,
      items: [
        { productId: "livre-003", qty: 2, price: 14.0 },
        { productId: "fourn-003", qty: 4, price: 3.5 },
        { productId: "fourn-001", qty: 10, price: 0.6 },
      ],
      payment: PaymentMethod.CARTE,
      amountPaid: 48.0,
    },
    {
      daysAgo: 7,
      items: [
        { productId: "livre-001", qty: 3, price: 8.5 },
        { productId: "fourn-009", qty: 1, price: 9.9 },
      ],
      payment: PaymentMethod.ESPECES,
      amountPaid: 36,
    },
    {
      daysAgo: 10,
      items: [
        { productId: "livre-008", qty: 2, price: 16.5 },
        { productId: "fourn-007", qty: 1, price: 4.5 },
      ],
      payment: PaymentMethod.CARTE,
      amountPaid: 37.5,
    },
    {
      daysAgo: 14,
      items: [
        { productId: "livre-005", qty: 1, price: 13.5 },
        { productId: "livre-002", qty: 2, price: 9.5 },
      ],
      payment: PaymentMethod.ESPECES,
      amountPaid: 35,
    },
    {
      daysAgo: 20,
      items: [
        { productId: "fourn-003", qty: 5, price: 3.5 },
        { productId: "fourn-005", qty: 3, price: 3.2 },
        { productId: "fourn-010", qty: 4, price: 1.1 },
      ],
      payment: PaymentMethod.ESPECES,
      amountPaid: 30,
    },
    {
      daysAgo: 25,
      items: [
        { productId: "livre-007", qty: 1, price: 14.5 },
        { productId: "fourn-009", qty: 2, price: 9.9 },
      ],
      payment: PaymentMethod.CARTE,
      amountPaid: 34.3,
    },
  ];

  let saleIndex = 1;
  for (const saleData of salesData) {
    const saleDate = new Date(now);
    saleDate.setDate(saleDate.getDate() - saleData.daysAgo);

    const subtotal = saleData.items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    await prisma.sale.create({
      data: {
        id: `sale-${String(saleIndex).padStart(3, "0")}`,
        total: subtotal,
        subtotal,
        amountPaid: saleData.amountPaid,
        change: Math.max(0, saleData.amountPaid - subtotal),
        paymentMethod: saleData.payment,
        createdAt: saleDate,
        items: {
          create: saleData.items.map((item, idx) => ({
            id: `saleitem-${String(saleIndex).padStart(3, "0")}-${idx}`,
            productId: item.productId,
            quantity: item.qty,
            unitPrice: item.price,
            subtotal: item.qty * item.price,
          })),
        },
      },
    });
    saleIndex++;
  }

  console.log("✅ Seeding terminé avec succès !");
  console.log(
    `   📚 ${livres.length} livres créés`
  );
  console.log(
    `   🖊️  ${fournitures.length} fournitures créées`
  );
  console.log(`   🛒 ${salesData.length} ventes d'exemple créées`);
  console.log(`   🏭 4 fournisseurs créés`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
