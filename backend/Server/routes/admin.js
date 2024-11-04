const express = require("express");
const router = express.Router();
const Property = require("../models/properties");
const User = require("../models/Users");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const Transaction = require("../models/transaction");
const Booking = require("../models/booking");
const Terms = require("../models/Terms");
const Dispute = require("../models/disputes");

// Route to get active properties with pagination
router.get("/properties/active", async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch properties with pagination
    const properties = await Property.find({ status: true })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get the total count of documents
    const totalCount = await Property.countDocuments({ status: true });

    // Send response with pagination info
    res.json({
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get users with both roles
router.get("/users/both", async (req, res) => {
  try {
    // Fetch users with both roles
    const users = await User.find({ role: 3 });

    // Fetch profiles for these users
    const userIds = users.map((user) => user._id);
    const profiles = await Profile.find({ user_id: { $in: userIds } });

    // Merge user and profile data
    const result = users.map((user) => {
      const profile = profiles.find(
        (profile) => profile.user_id.toString() === user._id.toString()
      );
      return {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        first_name: profile ? profile.first_name : "",
        middle_name: profile ? profile.middle_name : "",
        phone_number: profile ? profile.phoneNumber : "",
        address: profile ? profile.address : "",
        profile_picture: profile ? profile.profile_picture : "", // Include the profile picture
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch users with landlord role
router.get("/users/landlord", async (req, res) => {
  try {
    // Fetch users with landlord role (assuming role 2 is for landlords)
    const users = await User.find({ role: 2 });

    // Fetch profiles for these users
    const userIds = users.map((user) => user._id);
    const profiles = await Profile.find({ user_id: { $in: userIds } });

    // Merge user and profile data
    const result = users.map((user) => {
      const profile = profiles.find(
        (profile) => profile.user_id.toString() === user._id.toString()
      );
      return {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        first_name: profile ? profile.first_name : "",
        middle_name: profile ? profile.middle_name : "",
        phone_number: profile ? profile.phoneNumber : "",
        address: profile ? profile.address : "",
        profile_picture: profile ? profile.profile_picture : "", // Add profile picture here
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users/tenant", async (req, res) => {
  try {
    // Fetch users with tenant role (assuming role 1 is for tenants)
    const users = await User.find({ role: 1 });

    // Fetch profiles for these users
    const userIds = users.map((user) => user._id);
    const profiles = await Profile.find({ user_id: { $in: userIds } });

    // Merge user and profile data
    const result = users.map((user) => {
      const profile = profiles.find(
        (profile) => profile.user_id.toString() === user._id.toString()
      );
      return {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        first_name: profile ? profile.first_name : "",
        middle_name: profile ? profile.middle_name : "",
        phone_number: profile ? profile.phoneNumber : "",
        address: profile ? profile.address : "",
        profile_picture: profile ? profile.profile_picture : "",
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/properties/pending", async (req, res) => {
  try {
    // Fetch all properties with 'verification' status as 'verified'
    const properties = await Property.find({ verification: "pending" });

    // Fetch owner details from the Profile schema
    const propertiesWithOwnerInfo = await Promise.all(
      properties.map(async (property) => {
        const profile = await Profile.findOne({
          user_id: property.user_id,
        }).exec();

        // Default to empty strings if profile fields are not found
        return {
          _id: property._id,
          property_name: property.property_name,
          image: property.image,
          description: property.description,
          price: property.price,
          location: property.location,
          address: property.address,
          category: property.category,
          createdAt: property.createdAt,
          verification: property.verification,
          ownerName: `${profile?.first_name || ""} ${profile?.last_name || ""}`,
          ownerProfilePic: profile?.profile_picture || "",
        };
      })
    );

    // Send response with the properties and owner details
    res.json(propertiesWithOwnerInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept Property - Set verification to 'verified'
router.put("/properties/accept/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findByIdAndUpdate(
      id,
      { verification: "verified" },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject Property - Set verification to 'rejected'
router.put("/properties/reject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findByIdAndUpdate(
      id,
      { verification: "rejected" },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profiles", async (req, res) => {
  try {
    // Fetch all profiles
    const profiles = await Profile.find({ verification: "pending" });

    // If you need additional user details, fetch users by user_ids
    const userIds = profiles.map((profile) => profile.user_id);
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map for quick user lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // Merge profile data with user data
    const result = profiles.map((profile) => {
      const user = userMap[profile.user_id.toString()];
      return {
        _id: user ? user._id : profile.user_id,
        user_name: user ? user.user_name : "",
        email: user ? user.email : "",
        role: user ? user.role : "",
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        phone_number: profile.phoneNumber,
        address: profile.address,
        id_image: profile.id_image,
        verification: profile.verification || "pending", // Default to "pending"
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// Approve profile endpoint
// Approve (Verify) profile endpoint
// Approve profile endpoint using user ID
router.put("/profiles/verify/:userId", async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await Profile.findOneAndUpdate(
      { user_id: req.params.userId },
      { verification: "verified" },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error verifying profile:", err);
    res
      .status(500)
      .json({ message: "Failed to verify profile", error: err.message });
  }
});

// Reject profile endpoint using user ID
router.put("/profiles/reject/:userId", async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await Profile.findOneAndUpdate(
      { user_id: req.params.userId },
      { verification: "rejected" },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error rejecting profile:", err);
    res.status(500).json({ message: "Failed to reject profile", error: err });
  }
});

router.get("/total-users", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Get the count of all users
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the total number of properties
router.get("/total-properties", async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    res.json({ totalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    // Find the user by username or email
    const user = await User.findOne({ $or: [{ user_name }, { email }] });

    // Check if the user exists
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    // Compare the provided password with the stored password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id.toString() }, // Ensure _id is a string
      "4dC1aYbZ9eKxR3uWvA8hP7tQwJ2nL5sFzM0oO1rT6pVbGxN", // Your JWT secret
      { expiresIn: "1h" }
    );

    // Respond with success message and user data including role
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id.toString(), // Ensure _id is a string
        role: user.role, // Include the role field
      },
    });
  } catch (error) {
    console.error("Error during sign-in", error);
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
});

// Route to fetch admin profile
router.get("/profile", async (req, res) => {
  try {
    // Find the user with role 0 (admin)
    const user = await User.findOne({ role: 0 });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find the profile associated with the user
    const profile = await Profile.findOne({ user_id: user._id });

    // Prepare the response
    const response = {
      username: user.user_name,
      role: user.role === 0 ? "Admin" : "SubAdmin", // Adjust based on role values
      profilePic:
        profile && profile.profile_picture
          ? profile.profile_picture
          : `https://ui-avatars.com/api/?name=${user.user_name}&background=random`, // Fallback if picture is not found
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/properties/verified", async (req, res) => {
  try {
    const verifiedProperties = await Property.find({
      verification: "pending",
    });
    res.json(verifiedProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profiles/verified", async (req, res) => {
  try {
    const verifiedProfiles = await Profile.find({ verification: "pending" });
    res.json(verifiedProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profiles/verified/count", async (req, res) => {
  try {
    const count = await Profile.countDocuments({ verification: "pending" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/properties/verified/count", async (req, res) => {
  try {
    const count = await Property.countDocuments({ verification: "pending" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/balance", async (req, res) => {
  const { user_id, account_no } = req.query;

  try {
    let account;

    // Fetch account based on user_id or account_no
    if (user_id) {
      account = await Account.findOne({ user_id });
    } else if (account_no) {
      account = await Account.findOne({ account_no });
    } else {
      return res
        .status(400)
        .json({ error: "Please provide user_id or account_no" });
    }

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Return the balance
    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get transactions
router.get("/transactions", async (req, res) => {
  try {
    // Fetch transactions and populate user name
    const transactions = await Transaction.find({})
      .populate("user_id", "user_name") // Populate user_name from User model
      .exec();

    // Send the transactions as response
    res.json(transactions);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch rented items with property images and usernames
router.get("/rented", async (req, res) => {
  try {
    // Fetch all rented bookings
    const bookings = await Booking.find({ status: "booked" }).exec();

    // Fetch additional details
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const property = await Property.findById(booking.property_id).exec();
        const tenant = await User.findById(booking.tenant_id).exec();
        const owner = await User.findById(booking.owner_id).exec();

        return {
          ...booking.toObject(),
          property_image: property?.image?.[0] || "", // Assuming image is an array, pick the first image
          tenant_username: tenant?.user_name || "Unknown",
          owner_username: owner?.user_name || "Unknown",
        };
      })
    );

    res.json(bookingsWithDetails);
  } catch (err) {
    console.error("Error fetching rented items:", err);
    res.status(500).json({ error: "Failed to fetch rented items." });
  }
});

// Endpoint to get total transactions
router.get("/total-transactions", async (req, res) => {
  try {
    // Count all transactions
    const totalTransactions = await Transaction.countDocuments({});
    res.json({ totalTransactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get total rents (booked status)
router.get("/total-rents", async (req, res) => {
  try {
    // Count bookings with status "booked"
    const totalRents = await Booking.countDocuments({ status: "booked" });
    res.json({ totalRents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE: Add new terms and conditions
router.post("/terms", async (req, res) => {
  const { content, version } = req.body;

  try {
    const newTerms = new Terms({
      content,
      version,
    });
    const savedTerms = await newTerms.save();
    res.status(201).json(savedTerms);
  } catch (error) {
    res.status(500).json({ message: "Error saving terms", error });
  }
});

// READ: Get all terms and conditions
router.get("/terms", async (req, res) => {
  try {
    const termsList = await Terms.find();
    res.status(200).json(termsList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving terms", error });
  }
});

// READ: Get a specific terms and conditions by ID
router.get("/terms/:id", async (req, res) => {
  try {
    const terms = await Terms.findById(req.params.id);
    if (!terms) return res.status(404).json({ message: "Terms not found" });
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving terms", error });
  }
});

// UPDATE: Update a specific terms and conditions by ID
router.put("/terms/:id", async (req, res) => {
  const { content, version } = req.body;

  try {
    const updatedTerms = await Terms.findByIdAndUpdate(
      req.params.id,
      { content, version },
      { new: true }
    );
    if (!updatedTerms)
      return res.status(404).json({ message: "Terms not found" });
    res.status(200).json(updatedTerms);
  } catch (error) {
    res.status(500).json({ message: "Error updating terms", error });
  }
});

// DELETE: Remove a specific terms and conditions by ID
router.delete("/terms/:id", async (req, res) => {
  try {
    const deletedTerms = await Terms.findByIdAndDelete(req.params.id);
    if (!deletedTerms)
      return res.status(404).json({ message: "Terms not found" });
    res.status(200).json({ message: "Terms deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting terms", error });
  }
});

// Get all disputes
router.get("/disputes", async (req, res) => {
  try {
    const disputes = await Dispute.find({ disagree: "true" });

    const disputesWithDetails = await Promise.all(
      disputes.map(async (dispute) => {
        // Find the booking related to this dispute
        const booking = await Booking.findById(dispute.bookingId).populate(
          "property_id",
          "property_name price"
        ); // Ensure 'property_id' is correctly populated

        if (booking && booking.property_id) {
          return {
            ...dispute._doc,
            property: {
              name: booking.property_id.property_name,
              price: booking.property_id.price,
            },
          };
        } else {
          return {
            ...dispute._doc,
            property: null,
          };
        }
      })
    );

    res.json(disputesWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/transactions-per-day", async (req, res) => {
  try {
    // Aggregate transaction data by day of the week
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // Group by the day of the week (1 = Sunday, 7 = Saturday)
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Days of the week array
    const daysOfWeek = [
      { day: "Sunday", totalAmount: 0, count: 0 },
      { day: "Monday", totalAmount: 0, count: 0 },
      { day: "Tuesday", totalAmount: 0, count: 0 },
      { day: "Wednesday", totalAmount: 0, count: 0 },
      { day: "Thursday", totalAmount: 0, count: 0 },
      { day: "Friday", totalAmount: 0, count: 0 },
      { day: "Saturday", totalAmount: 0, count: 0 },
    ];

    // Update the daysOfWeek array with actual transaction data
    transactions.forEach((transaction) => {
      const dayIndex = transaction._id - 1; // Convert MongoDB dayOfWeek (1-7) to index (0-6)
      daysOfWeek[dayIndex].totalAmount = transaction.totalAmount;
      daysOfWeek[dayIndex].count = transaction.count;
    });

    // Send response
    res.json(daysOfWeek);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get booking count per day of the week based on createdAt time
router.get("/bookings/count-per-day-of-week", async (req, res) => {
  try {
    const bookingsPerDayOfWeek = await Booking.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week (1=Sunday, 7=Saturday)
          count: { $sum: 1 }, // Count the number of bookings for each day of the week
        },
      },
      {
        $sort: { _id: 1 }, // Sort by day of the week
      },
    ]);

    // Map the _id numbers to actual day names
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const formattedResponse = bookingsPerDayOfWeek.map((item) => ({
      day: dayNames[item._id - 1], // MongoDB returns 1 for Sunday, so subtract 1 for array indexing
      count: item.count,
    }));

    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
