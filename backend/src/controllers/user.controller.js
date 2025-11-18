import User from "../models/user.model.js";

export const selectRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user._id;

    if (!role || !['client', 'freelancer'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

    res.status(200).json({
      message: "Role selected successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { education, skills, bio, certifications, experience } = req.body;

    if (!education || !skills || !bio) {
      return res.status(400).json({
        message: "Education, skills, and bio are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        education,
        skills,
        bio,
        certifications: certifications || [],
        experience: experience || [],
        isProfileComplete: true,
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: "Freelancer profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateClientProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { businessName, businessType } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        businessName,
        businessType,
        isProfileComplete: true,
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: "Client profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, address, bio, skills, education, experience } = req.body;

    if (!fullName) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    const updateData = {
      fullName,
      address,
      bio,
      skills,
      education,
    };

    if (experience !== undefined) {
      if (Array.isArray(experience)) {
        updateData.experience = experience.map((exp) => {
          if (typeof exp === 'string') {
            return {
              title: exp,
              company: '',
              duration: '',
              description: '',
            };
          } else if (typeof exp === 'object' && exp !== null) {
            return {
              title: exp.title || exp,
              company: exp.company || '',
              duration: exp.duration || '',
              description: exp.description || '',
            };
          }
          return exp;
        });
      } else if (typeof experience === 'string') {
        updateData.experience = experience.trim()
          ? [
              {
                title: experience.trim(),
                company: '',
                duration: '',
                description: '',
              },
            ]
          : [];
      } else {
        updateData.experience = [];
      }
    }

    if (skills !== undefined) {
      if (typeof skills === 'string') {
        updateData.skills = skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
      } else if (Array.isArray(skills)) {
        updateData.skills = skills;
      } else {
        updateData.skills = [];
      }
    }

    if (education !== undefined) {
      if (typeof education === 'string') {
        updateData.education = education
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e);
      } else if (Array.isArray(education)) {
        updateData.education = education;
      } else {
        updateData.education = [];
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -wallet');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImagePath },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
