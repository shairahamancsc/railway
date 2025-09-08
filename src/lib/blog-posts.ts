
// This file is no longer used for fetching posts on the public site, 
// as they are now fetched directly from the database via Supabase.
// It can be kept for reference or removed.

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  aiHint: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: 'importance-of-proper-transformer-maintenance',
    title: 'The Importance of Proper Transformer Maintenance',
    date: '2024-08-20T10:00:00Z',
    excerpt: 'Regular maintenance of electrical transformers is crucial for ensuring their longevity, efficiency, and safety. Neglecting this critical task can lead to costly failures, power outages, and significant safety hazards. Learn why a proactive approach is key.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    aiHint: 'electrical transformer maintenance',
    content: `Regular maintenance of electrical transformers is not just a recommendation; it's a critical operational necessity. These vital components of the power grid are responsible for stepping voltage up or down, and their failure can have cascading effects on an entire electrical system. A proactive maintenance schedule ensures reliability, extends the equipment's lifespan, and most importantly, enhances safety.\n\nOne of the primary reasons for regular maintenance is to prevent costly downtime. A failed transformer can bring operations to a halt, leading to significant financial losses. Routine checks can identify potential issues like oil leaks, overheating, or corrosion before they escalate into catastrophic failures. By analyzing insulation oil, for example, technicians can diagnose the internal health of the transformer without invasive procedures, catching problems like arcing or partial discharges early.\n\nFurthermore, efficiency is directly tied to maintenance. A well-maintained transformer operates closer to its optimal performance level, reducing energy losses and lowering operational costs over time. Dirt, debris, and loose connections can all contribute to inefficiency and heat buildup, which is why regular cleaning and torque checks are essential. Ultimately, investing in a consistent maintenance program is a small price to pay compared to the cost of emergency repairs, replacements, and the associated operational disruptions.`,
  },
  {
    slug: 'choosing-right-steel-utility-pole',
    title: 'Choosing the Right Steel Utility Pole for Your Project',
    date: '2024-08-15T10:00:00Z',
    excerpt: 'Steel utility poles offer superior strength, durability, and a longer lifespan compared to traditional wood poles. However, selecting the correct type of steel pole requires careful consideration of load requirements, environmental conditions, and project budget.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    aiHint: 'steel utility pole',
    content: `When planning for electrical distribution or telecommunications infrastructure, the choice of utility pole is a foundational decision that impacts the entire project's lifecycle. While wood has been a traditional choice, steel utility poles are increasingly becoming the standard due to their significant advantages in strength, durability, and longevity. Steel poles are less susceptible to rot, insects, and woodpecker damage, and they can be engineered to withstand higher wind and ice loads, making them ideal for areas prone to extreme weather.\n\nSelecting the right steel pole involves more than just choosing a material. Engineers must consider several factors. The first is the required load capacity, which includes the weight of the conductors, transformers, and other equipment, as well as the stress from wind and ice. The pole's height and class are determined by these calculations. Environmental conditions also play a crucial role. For coastal or industrial areas with corrosive elements, galvanized or specially coated steel poles are necessary to prevent rust and degradation over time.\n\nFinally, logistics and installation must be factored in. Steel poles are often lighter than their wood counterparts of similar strength, which can simplify transportation and installation, potentially reducing project costs. While the initial material cost of a steel pole may be higher than wood, its longer lifespan and lower maintenance requirements often result in a lower total cost of ownership over the decades-long service life of the infrastructure. Careful planning ensures that the selected poles provide a safe, reliable, and cost-effective solution for years to come.`,
  },
    {
    slug: 'foundations-of-safe-civil-engineering',
    title: 'Foundations of Safe Civil Engineering in Construction',
    date: '2024-08-10T10:00:00Z',
    excerpt: 'In any construction project, the civil engineering work forms the bedrock of success. From soil analysis to foundation pouring, every step must be executed with precision to ensure the structural integrity and safety of the entire project for decades to come.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    aiHint: 'construction foundation concrete',
    content: `Civil engineering is the unsung hero of the construction world. While architectural designs and finishing touches capture the eye, it is the meticulous work of civil engineers that ensures a structure is safe, stable, and durable. This work begins long before the first brick is laid, starting with a comprehensive site analysis. Geotechnical surveys are conducted to understand the soil composition, water table levels, and seismic risks, which are all critical factors that dictate the design of the foundation.\n\nA solid foundation is paramount. Whether it's a simple slab-on-grade for a small building or a complex system of deep piles for a skyscraper, the foundation's job is to transfer the building's load safely to the ground. The choice of foundation type depends entirely on the findings of the site analysis and the structural requirements of the building. Any miscalculation or shortcut at this stage can compromise the entire structure, leading to cracks, settlement, or even catastrophic failure in the future.\n\nBeyond the foundation, civil engineering encompasses drainage, grading, and utility connections. Proper site grading and drainage systems are essential to manage stormwater, prevent flooding, and protect the foundation from water damage. It is this holistic approach—from the ground down to the pipes below—that creates a safe and sustainable built environment. The precision and foresight of civil engineering provide the stability and resilience that allow architectural visions to stand the test of time.`,
  },
];
