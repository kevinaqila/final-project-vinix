import Service from '../models/service.model.js';
import User from '../models/user.model.js';

export const createService = async (req, res) => {
  try {
    const { title, category, description, packages, images, clientUploads, freelancerDelivers } = req.body;
    const freelancerId = req.user._id;

    if (!title || !category || !description || !packages) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!packages.basic || !packages.standard || !packages.premium) {
      return res.status(400).json({ message: 'All three packages are required' });
    }

    const user = await User.findById(freelancerId);
    if (user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create services' });
    }

    const service = await Service.create({
      freelancerId,
      title,
      category,
      description,
      clientUploads: clientUploads || [],
      freelancerDelivers: freelancerDelivers || [],
      packages,
      images: images || [],
    });

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServices = async (req, res) => {
  try {
    const { category, search, freelancerId } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (freelancerId) query.freelancerId = freelancerId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query)
      .populate('freelancerId', 'fullName profileImage education averageRating')
      .sort({ createdAt: -1 });

    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).populate(
      'freelancerId',
      'fullName profileImage education bio skills certifications experience averageRating'
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user._id;
    const updates = req.body;

    const service = await Service.findOne({ _id: id, freelancerId });

    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    Object.keys(updates).forEach((key) => {
      service[key] = updates[key];
    });

    await service.save();
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user._id;

    const service = await Service.findOneAndDelete({ _id: id, freelancerId });

    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const services = await Service.find({ freelancerId }).sort({ createdAt: -1 });
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
