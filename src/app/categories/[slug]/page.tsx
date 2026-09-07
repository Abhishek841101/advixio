// import { notFound } from "next/navigation";

// import CategoryHeader from "@/components/categories/CategoryHeader";
// import CategorySidebar from "@/components/categories/CategorySidebar";
// import CategoryGrid from "@/components/categories/CategoryGrid";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:5000/api";

// type Category = {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   image?: string;
//   icon?: string;
//   isActive: boolean;
//   sortOrder: number;
// };

// type Props = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function CategoryPage({
//   params,
// }: Props) {
//   const { slug } = await params;

//   console.log(
//     "Category page slug:",
//     slug
//   );

//   try {
//     const categoryUrl =
//       `${API_URL}/categories/${encodeURIComponent(slug)}`;

//     console.log(
//       "Fetching category:",
//       categoryUrl
//     );

//     const response = await fetch(
//       categoryUrl,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       console.error(
//         "Category API failed:",
//         response.status,
//         categoryUrl
//       );

//       notFound();
//     }

//     const result = await response.json();

//     const category: Category =
//       result?.data;

//     if (!category) {
//       console.error(
//         "Category data missing:",
//         result
//       );

//       notFound();
//     }

//     return (
//       <main className="category-page">

//         {/* Category Header */}
//         <CategoryHeader
//           category={category}
//         />

//         <div className="category-layout">

//           {/* Sidebar */}
//           <CategorySidebar />

//           {/* Products */}
//           <CategoryGrid
//             slug={category.slug}
//           />

//         </div>

//       </main>
//     );
//   } catch (error) {
//     console.error(
//       "Category page error:",
//       error
//     );

//     notFound();
//   }
// }




import { notFound } from "next/navigation";

import CategoryHeader from "@/components/categories/CategoryHeader";
import CategorySidebar from "@/components/categories/CategorySidebar";
import CategoryGrid from "@/components/categories/CategoryGrid";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const categories: Category[] = [
  {
    _id: "1",
    name: "Industrial Machinery",
    slug: "industrial-machinery",
    description:
      "Industrial machines, production equipment and manufacturing solutions.",
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: "2",
    name: "Automobile & Auto Parts",
    slug: "automobile-auto-parts",
    description:
      "Vehicles, automotive components, spare parts and accessories.",
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: "3",
    name: "Electrical & Electronics",
    slug: "electrical-electronics",
    description:
      "Electrical equipment, electronic components, appliances and systems.",
    isActive: true,
    sortOrder: 3,
  },
  {
    _id: "4",
    name: "Construction & Building Materials",
    slug: "construction-building-materials",
    description:
      "Construction materials, building products, equipment and solutions.",
    isActive: true,
    sortOrder: 4,
  },
  {
    _id: "5",
    name: "Tools & Hardware",
    slug: "tools-hardware",
    description:
      "Hand tools, power tools, hardware and industrial accessories.",
    isActive: true,
    sortOrder: 5,
  },
  {
    _id: "6",
    name: "Safety & Security",
    slug: "safety-security",
    description:
      "Personal protective equipment, workplace safety and security products.",
    isActive: true,
    sortOrder: 6,
  },
  {
    _id: "7",
    name: "Agriculture & Farming",
    slug: "agriculture-farming",
    description:
      "Agricultural machinery, farming equipment, irrigation and farm supplies.",
    isActive: true,
    sortOrder: 7,
  },
  {
    _id: "8",
    name: "Food Processing Machinery",
    slug: "food-processing-machinery",
    description:
      "Food processing, packaging and commercial kitchen machinery.",
    isActive: true,
    sortOrder: 8,
  },
  {
    _id: "9",
    name: "Packaging & Printing",
    slug: "packaging-printing",
    description:
      "Packaging machines, packaging materials, printing equipment and supplies.",
    isActive: true,
    sortOrder: 9,
  },
  {
    _id: "10",
    name: "Chemicals",
    slug: "chemicals",
    description:
      "Industrial chemicals, specialty chemicals and chemical raw materials.",
    isActive: true,
    sortOrder: 10,
  },
  {
    _id: "11",
    name: "Pharmaceuticals & Medical",
    slug: "pharmaceuticals-medical",
    description:
      "Pharmaceutical products, medical equipment and healthcare supplies.",
    isActive: true,
    sortOrder: 11,
  },
  {
    _id: "12",
    name: "Textiles & Garments",
    slug: "textiles-garments",
    description:
      "Textile machinery, fabrics, garments, yarns and textile accessories.",
    isActive: true,
    sortOrder: 12,
  },
  {
    _id: "13",
    name: "Plastic & Rubber",
    slug: "plastic-rubber",
    description:
      "Plastic products, rubber products, raw materials and processing machinery.",
    isActive: true,
    sortOrder: 13,
  },
  {
    _id: "14",
    name: "Metals & Metal Products",
    slug: "metals-metal-products",
    description:
      "Steel, aluminium, copper, metal products and metal processing solutions.",
    isActive: true,
    sortOrder: 14,
  },
  {
    _id: "15",
    name: "Welding & Fabrication",
    slug: "welding-fabrication",
    description:
      "Welding machines, fabrication equipment, consumables and accessories.",
    isActive: true,
    sortOrder: 15,
  },
  {
    _id: "16",
    name: "Pumps & Motors",
    slug: "pumps-motors",
    description:
      "Industrial pumps, motors, pumping systems and related equipment.",
    isActive: true,
    sortOrder: 16,
  },
  {
    _id: "17",
    name: "Valves & Pipes",
    slug: "valves-pipes",
    description:
      "Industrial valves, pipes, fittings, flanges and piping systems.",
    isActive: true,
    sortOrder: 17,
  },
  {
    _id: "18",
    name: "HVAC & Refrigeration",
    slug: "hvac-refrigeration",
    description:
      "Heating, ventilation, air conditioning and refrigeration equipment.",
    isActive: true,
    sortOrder: 18,
  },
  {
    _id: "19",
    name: "Material Handling",
    slug: "material-handling",
    description:
      "Cranes, hoists, conveyors, forklifts and material handling equipment.",
    isActive: true,
    sortOrder: 19,
  },
  {
    _id: "20",
    name: "Laboratory Equipment",
    slug: "laboratory-equipment",
    description:
      "Laboratory instruments, testing equipment and scientific supplies.",
    isActive: true,
    sortOrder: 20,
  },
  {
    _id: "21",
    name: "Renewable Energy",
    slug: "renewable-energy",
    description:
      "Solar, wind, battery storage and renewable energy products.",
    isActive: true,
    sortOrder: 21,
  },
  {
    _id: "22",
    name: "Batteries & Power Solutions",
    slug: "batteries-power-solutions",
    description:
      "Batteries, UPS systems, inverters, generators and power backup solutions.",
    isActive: true,
    sortOrder: 22,
  },
  {
    _id: "23",
    name: "IT & Computer Hardware",
    slug: "it-computer-hardware",
    description:
      "Computers, networking equipment, servers, accessories and IT hardware.",
    isActive: true,
    sortOrder: 23,
  },
  {
    _id: "24",
    name: "Telecommunication",
    slug: "telecommunication",
    description:
      "Telecommunication equipment, networking products and communication systems.",
    isActive: true,
    sortOrder: 24,
  },
  {
    _id: "25",
    name: "Office Supplies & Equipment",
    slug: "office-supplies-equipment",
    description:
      "Office furniture, stationery, printers and workplace equipment.",
    isActive: true,
    sortOrder: 25,
  },
  {
    _id: "26",
    name: "Furniture",
    slug: "furniture",
    description:
      "Office, industrial, commercial and residential furniture.",
    isActive: true,
    sortOrder: 26,
  },
  {
    _id: "27",
    name: "Home Appliances",
    slug: "home-appliances",
    description:
      "Home appliances, kitchen appliances and consumer electrical products.",
    isActive: true,
    sortOrder: 27,
  },
  {
    _id: "28",
    name: "Industrial Automation",
    slug: "industrial-automation",
    description:
      "Automation systems, PLCs, sensors, robotics and control equipment.",
    isActive: true,
    sortOrder: 28,
  },
  {
    _id: "29",
    name: "Robotics",
    slug: "robotics",
    description:
      "Industrial robots, robotic systems, automation and robotic accessories.",
    isActive: true,
    sortOrder: 29,
  },
  {
    _id: "30",
    name: "Instrumentation & Control",
    slug: "instrumentation-control",
    description:
      "Industrial instruments, measurement systems and process control equipment.",
    isActive: true,
    sortOrder: 30,
  },
  {
    _id: "31",
    name: "Material & Handling Equipment",
    slug: "material-handling-equipment",
    description:
      "Industrial handling, lifting, storage and warehouse equipment.",
    isActive: true,
    sortOrder: 31,
  },
  {
    _id: "32",
    name: "Cleaning & Maintenance",
    slug: "cleaning-maintenance",
    description:
      "Industrial cleaning machines, maintenance products and facility supplies.",
    isActive: true,
    sortOrder: 32,
  },
  {
    _id: "33",
    name: "Water Treatment & Waste Management",
    slug: "water-treatment-waste-management",
    description:
      "Water treatment systems, filtration, wastewater and waste management equipment.",
    isActive: true,
    sortOrder: 33,
  },
  {
    _id: "34",
    name: "Mining & Quarrying",
    slug: "mining-quarrying",
    description:
      "Mining machinery, quarrying equipment and mineral processing solutions.",
    isActive: true,
    sortOrder: 34,
  },
  {
    _id: "35",
    name: "Petroleum & Oil Equipment",
    slug: "petroleum-oil-equipment",
    description:
      "Oil, gas, petroleum handling equipment and related industrial products.",
    isActive: true,
    sortOrder: 35,
  },
  {
    _id: "36",
    name: "Renewable & Environmental Solutions",
    slug: "renewable-environmental-solutions",
    description:
      "Environmental technology, renewable energy and pollution control solutions.",
    isActive: true,
    sortOrder: 36,
  },
  {
    _id: "37",
    name: "Woodworking Machinery",
    slug: "woodworking-machinery",
    description:
      "Wood cutting, processing, furniture and woodworking machinery.",
    isActive: true,
    sortOrder: 37,
  },
  {
    _id: "38",
    name: "Glass & Ceramics",
    slug: "glass-ceramics",
    description:
      "Glass products, ceramic products, manufacturing equipment and supplies.",
    isActive: true,
    sortOrder: 38,
  },
  {
    _id: "39",
    name: "Leather & Footwear",
    slug: "leather-footwear",
    description:
      "Leather products, footwear, machinery and manufacturing supplies.",
    isActive: true,
    sortOrder: 39,
  },
  {
    _id: "40",
    name: "Paper & Pulp",
    slug: "paper-pulp",
    description:
      "Paper products, pulp, paper manufacturing machinery and supplies.",
    isActive: true,
    sortOrder: 40,
  },
  {
    _id: "41",
    name: "Hospitality & Hotel Supplies",
    slug: "hospitality-hotel-supplies",
    description:
      "Hotel, restaurant, catering and hospitality equipment and supplies.",
    isActive: true,
    sortOrder: 41,
  },
  {
    _id: "42",
    name: "Restaurant & Commercial Kitchen",
    slug: "restaurant-commercial-kitchen",
    description:
      "Commercial kitchen equipment, restaurant supplies and food service products.",
    isActive: true,
    sortOrder: 42,
  },
  {
    _id: "43",
    name: "Medical & Hospital Equipment",
    slug: "medical-hospital-equipment",
    description:
      "Hospital equipment, medical devices, diagnostic equipment and healthcare supplies.",
    isActive: true,
    sortOrder: 43,
  },
  {
    _id: "44",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description:
      "Beauty products, salon equipment, cosmetics and personal care supplies.",
    isActive: true,
    sortOrder: 44,
  },
  {
    _id: "45",
    name: "Gems, Jewellery & Handicrafts",
    slug: "gems-jewellery-handicrafts",
    description:
      "Jewellery, gemstones, handicrafts, decorative products and artisan goods.",
    isActive: true,
    sortOrder: 45,
  },
  {
    _id: "46",
    name: "Apparel & Fashion",
    slug: "apparel-fashion",
    description:
      "Clothing, fashion accessories, footwear and fashion products.",
    isActive: true,
    sortOrder: 46,
  },
  {
    _id: "47",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description:
      "Sports equipment, gym equipment, fitness products and accessories.",
    isActive: true,
    sortOrder: 47,
  },
  {
    _id: "48",
    name: "Toys & Games",
    slug: "toys-games",
    description:
      "Toys, games, educational products and recreational equipment.",
    isActive: true,
    sortOrder: 48,
  },
  {
    _id: "49",
    name: "Electrical Cables & Wires",
    slug: "electrical-cables-wires",
    description:
      "Power cables, wires, control cables and electrical wiring products.",
    isActive: true,
    sortOrder: 49,
  },
  {
    _id: "50",
    name: "Industrial Supplies",
    slug: "industrial-supplies",
    description:
      "General industrial consumables, components and manufacturing supplies.",
    isActive: true,
    sortOrder: 50,
  },
];

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = categories.find(
    (item) =>
      item.slug === slug &&
      item.isActive
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="category-page">
      <CategoryHeader
        category={category}
      />

      <div className="category-layout">
        <CategorySidebar />

        <CategoryGrid
          slug={category.slug}
        />
      </div>
    </main>
  );
}