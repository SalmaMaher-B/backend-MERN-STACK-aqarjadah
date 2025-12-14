// routes/adRoute.js
import express from "express";
import Ad from "../models/Ad.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create Ad
router.post("/", auth, async (req, res) => {
  try {
    console.log("=== CREATE AD REQUEST ===");
    console.log("User from token:", req.user);
    console.log("Request body:", req.body);

    const { type, images, area, rooms, bathrooms, description, phone, whatsapp, ...restData } = req.body;
    
    // Base ad data with user info
    const adData = {
      ...restData,
      type,
      user: req.user.id,
      // استخدم الأرقام من الفورم (req.body) مش من req.user
      phone: phone || req.user.phone || '',
      whatsapp: whatsapp || req.user.whatsapp || ''
    };

    console.log("Phone from request:", phone);
    console.log("WhatsApp from request:", whatsapp);

    // Handle based on type
    if (type === 'wanted') {
      // للمطلوب: لا نحفظ الصور والتفاصيل
      adData.images = [];
      adData.area = null;
      adData.rooms = null;
      adData.bathrooms = null;
      adData.description = '';
    } else {
      // للبيع والإيجار: نحفظ كل شيء
      adData.images = images || [];
      adData.area = area || null;
      adData.rooms = rooms || null;
      adData.bathrooms = bathrooms || null;
      adData.description = description || '';
    }

    console.log("Final adData to save:", adData);

    // حفظ الإعلان
    const ad = await Ad.create(adData);
    console.log("Ad created successfully:", ad._id);
    console.log("Saved phone:", ad.phone);
    console.log("Saved whatsapp:", ad.whatsapp);

    res.status(201).json({
      success: true,
      message: "تم إضافة الإعلان بنجاح",
      ad
    });

  } catch (err) {
    console.error("=== CREATE AD ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    // تحقق من أخطاء التحقق
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        error: "خطأ في البيانات المدخلة",
        details: errors 
      });
    }

    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Read all ads
router.get("/", async (req, res) => {
  try {
    console.log("=== GET ALL ADS ===");
    const { type, category, location } = req.query;
    
    // Build filter object
    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };

    console.log("Filter:", filter);

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    console.log(`Found ${ads.length} ads`);

    res.json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (err) {
    console.error("Get ads error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Read one ad
import mongoose from 'mongoose';

router.get("/:id", async (req, res) => {
  try {
    console.log("=== GET SINGLE AD ===");
    const { id } = req.params;
    console.log("Ad ID:", id);

    // تحقق من صحة الـ ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ad ID"
      });
    }

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found"
      });
    }

    console.log("Ad found:", ad._id);

    res.json({
      success: true,
      ad
    });
  } catch (err) {
    console.error("Get ad error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// Update ad
router.put("/:id", auth, async (req, res) => {
  try {
    console.log("=== UPDATE AD ===");
    console.log("Ad ID:", req.params.id);
    console.log("Update data:", req.body);

    const { type, images, area, rooms, bathrooms, description, ...restData } = req.body;
    
    // Base update data
    const updateData = {
      ...restData,
      type
    };

    // Handle based on type
    if (type === 'wanted') {
      // للمطلوب: امسح الصور والتفاصيل
      updateData.images = [];
      updateData.area = null;
      updateData.rooms = null;
      updateData.bathrooms = null;
      updateData.description = '';
    } else {
      // للبيع والإيجار: حدث كل شيء
      updateData.images = images || [];
      updateData.area = area || null;
      updateData.rooms = rooms || null;
      updateData.bathrooms = bathrooms || null;
      updateData.description = description || '';
    }

    console.log("Final update data:", updateData);

    const ad = await Ad.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!ad) {
      return res.status(404).json({ 
        success: false,
        message: "Ad not found" 
      });
    }

    console.log("Ad updated successfully");

    res.json({
      success: true,
      message: "تم تحديث الإعلان بنجاح",
      ad
    });
  } catch (err) {
    console.error("Update ad error:", err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Delete ad
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("=== DELETE AD ===");
    console.log("Ad ID:", req.params.id);

    const ad = await Ad.findByIdAndDelete(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ 
        success: false,
        message: "Ad not found" 
      });
    }

    console.log("Ad deleted successfully");

    res.json({ 
      success: true,
      message: "تم حذف الإعلان بنجاح" 
    });
  } catch (err) {
    console.error("Delete ad error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default router;