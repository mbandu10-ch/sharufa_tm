export interface VehicleBrand {
  name: string;
  models: string[];
}

export const VEHICLE_BRANDS: VehicleBrand[] = [
  {
    name: "Toyota",
    models: [
      "Land Cruiser", "Prado", "Hilux", "RAV4", "Corolla", "Camry", "Fortuner", 
      "Highlander", "Yaris", "Avalon", "Supra", "Tacoma", "Tundra", "Vitz", "Belta"
    ]
  },
  {
    name: "Lexus",
    models: ["LX570", "LX600", "GX460", "RX350", "ES350", "IS300", "NX200t", "LS500"]
  },
  {
    name: "Mercedes-Benz",
    models: [
      "G-Class", "GLE", "GLS", "S-Class", "E-Class", "C-Class", "A-Class", 
      "GLC", "CLA", "V-Class", "Actros"
    ]
  },
  {
    name: "BMW",
    models: ["X5", "X6", "X7", "3 Series", "5 Series", "7 Series", "X3", "X1", "M4"]
  },
  {
    name: "Suzuki",
    models: ["Swift", "Vitara", "Jimny", "Ertiga", "Dzire", "Baleno", "Alto"]
  },
  {
    name: "Honda",
    models: ["Civic", "CR-V", "Accord", "HR-V", "Pilot", "Fit", "City"]
  },
  {
    name: "Hyundai",
    models: ["Tucson", "Santa Fe", "Elantra", "Accent", "Palisade", "Kona", "Creta", "Ioniq"]
  },
  {
    name: "Kia",
    models: ["Sportage", "Sorento", "Cerato", "Rio", "Telluride", "Seltos", "K5", "Picanto"]
  },
  {
    name: "Mitsubishi",
    models: ["Pajero", "L200", "Outlander", "ASX", "Montero Sport", "Eclipse Cross"]
  },
  {
    name: "Nissan",
    models: ["Patrol", "X-Trail", "Navara", "Altima", "Sunny", "Qashqai", "Kicks", "Pathfinder"]
  },
  {
    name: "Ford",
    models: ["Ranger", "Everest", "F-150", "Explorer", "Mustang", "Edge", "Expedition"]
  },
  {
    name: "Land Rover",
    models: ["Range Rover", "Range Rover Sport", "Defender", "Discovery", "Evoque", "Velar"]
  },
  {
    name: "Volkswagen",
    models: ["Tiguan", "Touareg", "Golf", "Passat", "Teramont", "Amarok", "ID.4", "ID.6"]
  },
  {
    name: "Tesla",
    models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"]
  },
  {
    name: "Audi",
    models: ["Q7", "Q5", "Q8", "A6", "A4", "A3", "e-tron"]
  },
  {
    name: "Mazda",
    models: ["CX-5", "CX-9", "Mazda3", "Mazda6", "CX-30", "BT-50"]
  },
  {
    name: "Jeep",
    models: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"]
  },
  {
    name: "BYD",
    models: ["Atto 3", "Han", "Tang", "Song", "Dolphin", "Seal"]
  },
  {
    name: "Changan",
    models: ["CS35", "CS75", "UNI-K", "UNI-T", "Eado"]
  },
  {
    name: "Geely",
    models: ["Coolray", "Azkarra", "Tugella", "Okavango", "Emgrand"]
  },
  {
    name: "GWM",
    models: ["Haval H6", "Haval Jolion", "Poer", "Tank 300", "Tank 500"]
  }
];

export const FUEL_TYPES = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
export const TRANSMISSION_TYPES = ["Automatique", "Manuelle", "Semi-automatique"];
export const STEERING_SIDE = ["Gauche", "Droite"];
export const VEHICLE_COLORS = [
  "Blanc", "Noir", "Gris", "Argent", "Bleu", "Rouge", "Vert", "Beige", "Marron", "Or", "Orange", "Jaune"
];
