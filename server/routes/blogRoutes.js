const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect, adminOnly } = require("../middleware/auth");

// Initial sample articles for seeding if DB is empty
const initialArticles = [
  {
    title: "The Regal Nukra Horse: Pakistan's Icon of Prestige",
    category: "Breeds",
    author: "Malik Shahzad",
    readTime: "5 min read",
    summary: "Known for their pure white coat and pink skin, Nukra horses hold an esteemed place in Punjab's traditional festivals and ceremonies.",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    content: [
      "The Nukra horse is not just a breed; it is a living symbol of cultural pride, heritage, and luxury in Pakistan, particularly across the fertile plains of Punjab. Characterized by its signature pure white coat, white mane, pink skin, and often light-colored eyes, a true Nukra is a sight of breathtaking beauty. In local horse culture, the pink-spotted skin is beautifully referred to as 'phulkari' (floral embroidery).",
      "Genetically, the Nukra's stunning white coat is the result of specific double-sabino genes. While breeders across Pakistan treat them as a distinct class, experts note that they share conformational lineages with other regional breeds like the Sindhi and Chamba horses. They are highly agile, spirited, and possess a regal stance.",
      "In traditional celebrations, Nukra horses play an irreplaceable role. They are trained for traditional dancing (tent-pegging shows, cultural fairs) where they move gracefully to the beat of Punjabi 'dhol' drums. Owning a Nukra stallion is considered a status symbol of nobility and hospitality, and they are regularly featured in high-profile weddings and national festivals like the Lahore Horse and Cattle Show."
    ]
  },
  {
    title: "The Legendary Anmol Breed: Pakistan's Ancient Horse Heritage",
    category: "Breeds",
    author: "Dr. Tariq Mahmood",
    readTime: "7 min read",
    summary: "Tracing the roots of the ancient Anmol breed, and exploring the deep connection of horses with human history and the rich culture of Punjab and Pakistan.",
    image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800",
    content: [
      "The connection of the horse with humans is deeply rooted in the history and vibrant culture of Punjab and Pakistan. For centuries, these magnificent creatures have been more than just a mode of transport; they have been faithful companions to warriors, symbols of prestige for nobles, and central figures in rural festivities like Nezabazi (tent pegging). This historic bond reflects a shared legacy of survival, honor, and deep mutual respect that continues to thrive in modern Pakistani society.",
      "The 'Anmol' (meaning priceless in Urdu) is an ancient equine lineage of the Indian subcontinent and Pakistan. Legend traces the Anmol breed back over 2,000 years to Alexander the Great's campaign along the Jhelum River, where local horses were crossed with Arabian and Persian stock.",
      "Anmol horses are famed for their sleek bay or chestnut coats, powerful quarters, and exceptionally high stamina under harsh weather conditions. Unlike modern sports horses, the Anmol horse is compact, robust, and capable of covering vast distances with minimal sustenance.",
      "Today, dedicated breeders in Punjab and Khyber Pakhtunkhwa are working tirelessly to preserve and revive true Anmol bloodlines. Conservation efforts aim to protect this historic treasure from extinction and highlight its historic role in Pakistani folklore."
    ]
  },
  {
    title: "Essential Equine Nutrition & Daily Diet Guidelines",
    category: "Equine Care",
    author: "Vet. Bilal Ahmed",
    readTime: "4 min read",
    summary: "A practical guide to horse feed, hydration, and nutritional balance to keep your companion healthy and strong.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
    content: [
      "Proper nutrition is the cornerstone of horse health and performance. A horse's digestive system is designed to process high-fiber forage in small amounts throughout the day. Ideally, high-quality grass or hay (forage) should constitute 1.5% to 2% of their total body weight daily. For example, a 500kg horse needs around 7.5 to 10kg of forage each day.",
      "Clean, fresh water must be accessible at all times. A horse can drink anywhere from 20 to 50 liters of water a day, which increases significantly during summer heat or high-intensity work. Dehydration is a primary cause of impaction colic, a life-threatening veterinary emergency.",
      "While forage provides base energy, active stallions, pregnant mares, or growing foals require supplemental concentrates (oats, barley, commercial pellets) and essential mineral blocks. Always introduce dietary changes gradually over 7 to 10 days to allow the horse's gut microbiome to adapt and prevent colic or laminitis."
    ]
  }
];

// GET /api/blogs (Public - fetch all blog posts)
router.get("/", async (req, res) => {
  try {
    let blogs = await Blog.find().sort({ createdAt: -1 });

    // Seed initial blogs if DB is empty
    if (blogs.length === 0) {
      blogs = await Blog.insertMany(initialArticles);
    }

    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blog posts", error: err.message });
  }
});

// GET /api/blogs/:id (Public - fetch single blog post)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blog post", error: err.message });
  }
});

// POST /api/blogs (Admin Only - create new blog post)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, category, author, readTime, summary, image, content } = req.body;
    if (!title || !summary || !image || !content) {
      return res.status(400).json({ success: false, message: "Title, summary, image, and content are required." });
    }

    const contentArray = Array.isArray(content)
      ? content
      : String(content).split('\n\n').map(p => p.trim()).filter(Boolean);

    const newBlog = await Blog.create({
      title,
      category: category || "Equine Care",
      author: author || req.user.name || "Admin",
      readTime: readTime || "5 min read",
      summary,
      image,
      content: contentArray
    });

    res.status(201).json({ success: true, message: "Blog article published successfully!", data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating blog article", error: err.message });
  }
});

// DELETE /api/blogs/:id (Admin Only - delete blog post)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, message: "Blog article deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting blog article", error: err.message });
  }
});

module.exports = router;
